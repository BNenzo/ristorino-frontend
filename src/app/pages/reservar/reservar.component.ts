import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { SucursalRestaurante } from '../../api/resources/restaurante/models/sucursal-restaurante';
import { TurnoDisponible } from '../../api/resources/reserva/models/turno-disponible.model';
import { CrearReservaRequest } from '../../api/resources/reserva/models/reserva.model';
import { RestauranteResource } from '../../api/resources/restaurante/restaurante-resource';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, BannerComponent, ReactiveFormsModule],
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss'],
})
export class ReservarComponent implements OnInit {
  form!: FormGroup;
  restaurantes: Restaurante[] = [];
  sucursales: SucursalRestaurante[] = [];
  turnosDisponibles: TurnoDisponible[] = [];
  cantidadesComensalesOpciones: number[] = Array.from({ length: 60 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private restauranteApi: RestauranteResource,
    private reservaApi: ReservaResource,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      restaurante: [null, Validators.required],
      sucursal: [{ value: null, disabled: true }, Validators.required],
      fecha: [{ value: null, disabled: true }, Validators.required],
      personas: [{ value: null, disabled: true }, Validators.required],
      menores: [{ value: null, disabled: true }, Validators.required],
      turno: [{ value: null, disabled: true }, Validators.required],
    });

    this.route.data.subscribe(({ restaurantes }) => {
      this.restaurantes = restaurantes;
      console.log('RESTAURANTES DESDE RESOLVER:', restaurantes);
    });

    this.form.get('restaurante')?.valueChanges.subscribe((nroRestaurante) => {
      if (!nroRestaurante) {
        this.sucursales = [];
        this.form.get('sucursal')?.reset();
        this.form.get('sucursal')?.disable();
        return;
      }

      this.cargarSucursales(nroRestaurante);
    });

    //habilitar fecha
    this.form.get('sucursal')?.valueChanges.subscribe((sucursal) => {
      if (!sucursal) {
        this.form.get('fecha')?.reset();
        this.form.get('fecha')?.disable();
        return;
      }

      this.form.get('fecha')?.enable();
    });

    //traemos los turnos
    this.form.get('fecha')?.valueChanges.subscribe((fecha) => {
      if (!fecha) {
        this.turnosDisponibles = [];
        this.form.get('personas')?.reset();
        this.form.get('personas')?.disable();
        this.form.get('turno')?.reset();
        this.form.get('turno')?.disable();
        return;
      }

      this.form.get('personas')?.enable();
      this.form.get('menores')?.enable();
      const nroRestaurante = Number(this.form.get('restaurante')?.value);
      const nroSucursal = Number(this.form.get('sucursal')?.value);

      if (!nroRestaurante || !nroSucursal) {
        return;
      }

      this.cargarTurnosDisponibles(nroRestaurante, nroSucursal, fecha);
    });

    this.form.get('personas')?.valueChanges.subscribe((cantidad) => {
      if (!cantidad) {
        this.form.get('turno')?.reset();
        this.form.get('turno')?.disable();
        return;
      }

      this.form.get('turno')?.enable();
    });
  }

  private cargarSucursales(nroRestaurante: number): void {
    this.restauranteApi
      .getSucursalesDeRestaurante({ nro_restaurante: nroRestaurante })
      .subscribe((sucursales) => {
        this.sucursales = sucursales;
        this.form.get('sucursal')?.enable();

        console.log('SUCURSALES:', sucursales);
      });
  }

  private cargarTurnosDisponibles(
    nroRestaurante: number,
    nroSucursal: number,
    fechaAReservar: string,
  ): void {
    this.reservaApi
      .getDisponibilidadTurnos({
        nroRestaurante,
        nroSucursal,
        fechaAReservar,
      })
      .subscribe((turnos) => {
        this.turnosDisponibles = turnos;

        console.log('TURNOS DISPONIBLES:', turnos);
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const sucursalSeleccionada = this.sucursales.find(
      (sucursal) => sucursal.nroSucursal == Number(raw.sucursal),
    );

    const reserva: CrearReservaRequest = {
      nroRestaurante: Number(raw.restaurante),
      nroSucursal: Number(raw.sucursal),
      fechaReserva: raw.fecha,
      horaReserva: raw.turno,
      cantAdultos: Number(raw.personas),
      cantMenores: 0,
      codZona: sucursalSeleccionada?.codZona ?? '',
    };

    console.log('RESERVA NORMALIZADA:', reserva);

    this.reservaApi.crearReserva(reserva).subscribe({
      next: () => {
        console.log('Reserva creada correctamente');
      },
      error: (err) => {
        const turnoCtrl = this.form.get('turno');
        turnoCtrl?.reset();

        // forzar que el usuario vuelva a elegir fecha/personas
        this.form.get('fecha')?.updateValueAndValidity();
      },
    });
  }

  isTurnoDisabled(t: any): boolean {
    const personas = this.form.get('personas')?.value ?? 0;
    const menores = this.form.get('menores')?.value ?? 0;
    const totalComensales = Number(menores) + Number(personas);
    return totalComensales > t.cupoDisponible || t.turnoCerrado === 1;
  }
}
