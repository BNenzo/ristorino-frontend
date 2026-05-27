import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ObtenerSucursalesFormReservas } from '../../api/resources/reservas/models/obtener-sucursales.model';
import { ObtenerZonasSucursalesRestaurantesFormReservas } from '../../api/resources/reservas/models/obtener-zonas-sucursales-restaurantes.model';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { DisponibilidadTurnos } from '../../api/resources/reserva/models/disponibilidad-turnos.model';
import { TurnoDisponible } from '../../api/resources/reserva/models/turno-disponible.model';

@Component({
  selector: 'app-reservar.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservar.component.html',
  styleUrl: './reservar.component.scss',
})
export class ReservarComponent {
  form: FormGroup;

  restaurantes: Restaurante[] = [];

  sucursales: ObtenerSucursalesFormReservas[] = [];
  sucursalesFiltradas: ObtenerSucursalesFormReservas[] = [];

  zonas: ObtenerZonasSucursalesRestaurantesFormReservas[] = [];
  zonasFiltradas: ObtenerZonasSucursalesRestaurantesFormReservas[] = [];

  cantidadesComensalesOpciones: number[] = Array.from({ length: 10 }, (_, i) => i);

  turnosDisponibles: DisponibilidadTurnos[] = [];
  turnoSeleccionado: string | null = null;

  mostrarModal = false;
  mostrarModalError = false;
  modalData: {
    restaurante?: string;
    sucursal?: string;
    fecha?: string;
    hora?: string;
    codigo?: string;
  } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservaApi: ReservaResource,
  ) {
    this.form = this.fb.group({
      restaurante: ['', [Validators.required]],
      sucursal: ['', [Validators.required]],
      zona: ['', Validators.required],
      cantAdultos: [0, Validators.required],
      cantMenores: [0, Validators.required],
      fecha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ restaurantes, sucursales, zonas }) => {
      this.restaurantes = restaurantes;
      this.sucursales = sucursales;
      this.zonas = zonas;
    });

    // Escuchás cambios en el select de restaurante
    this.form.get('restaurante')!.valueChanges.subscribe((nroRestaurante) => {
      this.sucursalesFiltradas = this.sucursales.filter(
        (s) => s.nroRestaurante === Number(nroRestaurante),
      );

      // Reseteás la sucursal seleccionada cuando cambia el restaurante
      this.form.get('sucursal')!.setValue('');
      this.form.get('zona')!.setValue('');
    });

    this.form.get('sucursal')!.valueChanges.subscribe((nroSucursal) => {
      const nroRestaurante = Number(this.form.get('restaurante')!.value);

      this.zonasFiltradas = this.zonas.filter(
        (zona) =>
          zona.nroRestaurante === nroRestaurante && zona.nroSucursal === Number(nroSucursal),
      );

      this.form.get('zona')!.setValue('');
    });
  }

  get cantMenores(): number {
    return Number(this.form.get('cantMenores')!.value) || 0;
  }

  get cantAdultos(): number {
    return Number(this.form.get('cantAdultos')!.value) || 0;
  }

  get nombreZonaSeleccionada(): string {
    const codZona = this.form.get('zona')!.value;
    return this.zonasFiltradas.find((z) => z.codZona === codZona)?.zona ?? codZona;
  }

  consultarDisponibilidad(): void {
    const nroRestaurante = Number(this.form.get('restaurante')!.value);
    const nroSucursal = Number(this.form.get('sucursal')!.value);
    const codZona = this.form.get('zona')!.value;
    const fecha = this.form.get('fecha')!.value;
    this.reservaApi
      .getDisponibilidadTurnos({
        nroRestaurante,
        nroSucursal,
        codZona,
        fechaAReservar: fecha,
      })
      .subscribe((rows: DisponibilidadTurnos[]) => {
        console.log(rows);
        this.turnosDisponibles = rows;
      });
  }

  reservar(): void {
    // POST de reserva
    const nroRestaurante = Number(this.form.get('restaurante')!.value);
    const nroSucursal = Number(this.form.get('sucursal')!.value);
    const codZona = this.form.get('zona')!.value;
    const fecha = this.form.get('fecha')!.value;

    this.reservaApi
      .crearReserva({
        nroRestaurante,
        nroSucursal,
        codZona,
        cantAdultos: this.cantAdultos,
        cantMenores: this.cantMenores,
        fechaReserva: fecha,
        horaReserva: this.turnoSeleccionado ?? '',
      })
      .subscribe({
        next: (codigoReserva: string) => {
          const restauranteSeleccionado = this.restaurantes.find(
            (r) => Number(r.nroRestaurante) === nroRestaurante,
          );
          const sucursalSeleccionada = this.sucursales.find(
            (s) => Number(s.nroSucursal) === nroSucursal,
          );

          this.modalData = {
            restaurante: restauranteSeleccionado?.razonSocial ?? '',
            sucursal: sucursalSeleccionada?.nomSucursal ?? '',
            fecha: fecha,
            hora: this.turnoSeleccionado ?? '',
            codigo: codigoReserva,
          };
          this.mostrarModal = true;
        },
        error: () => {
          this.form.get('turno')?.reset();
          this.mostrarModalError = true;
        },
      });
  }

  seleccionarTurno(turno: DisponibilidadTurnos): void {
    this.turnoSeleccionado = turno.horaDesde;
    // Acá después harías el POST de la reserva
    console.log('Turno seleccionado:', turno);
  }

  volverAlFormulario(): void {
    this.turnosDisponibles = [];
    this.turnoSeleccionado = null;
  }

  irHome(): void {
    this.mostrarModal = false;
    this.router.navigate(['/']);
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
    this.form.reset();
  }
}
