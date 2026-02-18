import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaCliente } from '../../api/resources/reserva/models/reserva-cliente.model';
import { TurnoDisponible } from '../../api/resources/reserva/models/turno-disponible.model';
import { BannerComponent } from '../../components/banner/banner.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-editar-reserva',
  standalone: true,
  imports: [CommonModule, BannerComponent, ReactiveFormsModule],
  templateUrl: './editar-reserva.html',
  styleUrl: './editar-reserva.scss',
})
export class EditarReserva {
  constructor(
    private fb: FormBuilder,
    private reservaApi: ReservaResource,
    private _route: ActivatedRoute,
    private router: Router,
  ) {}
  private destroyRef = inject(DestroyRef);
  reserva!: ReservaCliente; // <- es 1 sola reserva, no array
  turnosDisponibles: TurnoDisponible[] = [];

  // si tu HTML necesita estos arrays, dejalos (aunque estén vacíos por ahora)
  restaurantes: any[] = [];
  sucursales: any[] = [];
  cantidadesComensalesOpciones: number[] = Array.from({ length: 60 }, (_, i) => i + 1);

  form = this.fb.nonNullable.group({
    restaurante: this.fb.nonNullable.control(
      { value: '', disabled: true },
      { validators: [Validators.required] },
    ),
    sucursal: this.fb.nonNullable.control(
      { value: '', disabled: true },
      { validators: [Validators.required] },
    ),
    fecha: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    personas: this.fb.nonNullable.control(0, {
      validators: [Validators.required, Validators.min(1)],
    }),
    menores: this.fb.nonNullable.control(0, {
      validators: [Validators.required, Validators.min(1)],
    }),
    turno: this.fb.nonNullable.control('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this._route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const payload = data['data'] ?? data;

      this.reserva = payload.reserva;
      this.turnosDisponibles = payload.turnosDisponibles ?? [];

      this.form.patchValue(
        {
          fecha: this.reserva.fechaReserva,
          turno: this.reserva.horaReserva,
          personas: this.reserva.cantAdultos,
          menores: this.reserva.cantMenores,
        },
        { emitEvent: false },
      );
    });

    const fechaCtrl = this.form.get('fecha');
    if (!fechaCtrl) return;

    fechaCtrl.valueChanges
      .pipe(
        startWith(fechaCtrl.value),
        distinctUntilChanged(),
        filter((fecha): fecha is string => !!fecha),
        switchMap((fecha) =>
          this.reservaApi.getDisponibilidadTurnos({
            nroRestaurante: this.reserva.nroRestaurante,
            nroSucursal: this.reserva.nroSucursal,
            fechaAReservar: fecha,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((turnos) => {
        this.turnosDisponibles = turnos;
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const reserva = {
      nroReserva: this.reserva.nroReserva,
      fechaReserva: raw.fecha,
      horaReserva: raw.turno,
      cantAdultos: Number(raw.personas),
      cantMenores: Number(raw.menores),
      codReservaSucursal: this.reserva.codReservaSucursal,
      nroRestaurante: this.reserva.nroRestaurante,
    };

    this.reservaApi.actualizarReservaCliente(reserva).subscribe({
      next: () => {
        console.log('Reserva creada correctamente');
        this.router.navigate(['/mis-reservas']);
      },
    });
  }

  isTurnoDisabled(t: TurnoDisponible): boolean {
    const personas = Number(this.form.get('personas')?.value ?? 0);
    const menores = Number(this.form.get('menores')?.value ?? 0);
    const total = personas + menores;
    return total > t.cupoDisponible || t.turnoCerrado === 1;
  }

  confirmarReserva() {
    const reserva = {
      nroReserva: this.reserva.nroReserva,
      codEstado: 'CONF',
      nroRestaurante: this.reserva.nroRestaurante,
      codReservaSucursal: this.reserva.codReservaSucursal,
    };

    this.reservaApi.actualizarReservaCliente(reserva).subscribe({
      next: () => {
        console.log('Reserva confirmada correctamente');
        this.router.navigate(['/mis-reservas']);
      },
    });
  }
}
