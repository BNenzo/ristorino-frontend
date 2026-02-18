import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObtenerReservasCliente } from '../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReservasResource } from '../../api/resources/reservas/reservas-resource';
import { ObtenerEstadosReserva } from '../../api/resources/reservas/models/obtener-estados-reserva.model';
import { FilterDropdown } from '../../components/filter-dropdown/filter-dropdown';
import { obtenerTextoEstadoClassname } from '../../utils/obtenerColorEstadoReserva';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { puedeEditarReserva } from '../editar-reserva/utils';

@Component({
  selector: 'app-mis-reservas',
  imports: [ReactiveFormsModule, FilterDropdown, RouterLink],
  providers: [ReservasResource, ReservaResource],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss',
})
export class MisReservas {
  constructor(
    private fb: FormBuilder,
    private api: ReservasResource,
    private reservaApi: ReservaResource,
    private _route: ActivatedRoute,
  ) {}

  reservas: ObtenerReservasCliente[] = [];
  estadosDisponibles: ObtenerEstadosReserva[] = [];
  obtenerTextoEstadoClassname = obtenerTextoEstadoClassname;
  isFiltersOpen = false;

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  closeFilters() {
    this.isFiltersOpen = false;
  }
  form = this.fb.group({
    fecha: this.fb.control<string | null>(null),
    estados: this.fb.group({
      CONF: [false],
      PEN: [false],
    }),
  });

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.reservas = data['reservas'];
      this.estadosDisponibles = data['estadosReserva'];
    });

    const estadosGroup = this.form.get('estados') as FormGroup;

    // opcional: limpiar por si recarga
    Object.keys(estadosGroup.controls).forEach((k) => estadosGroup.removeControl(k));

    // crear un control booleano por cada codEstado
    for (const e of this.estadosDisponibles) {
      estadosGroup.addControl(e.codEstado, new FormControl(false));
    }
  }

  aplicarFiltros() {
    const raw = this.form.getRawValue();
    const estadosSeleccionados = Object.entries(raw.estados ?? {})
      .filter(([, checked]) => checked === true)
      .map(([estado]) => estado);

    const filters = {
      ...(raw.fecha ? { fecha: raw.fecha } : {}),
      ...(estadosSeleccionados.length ? { estados: estadosSeleccionados } : {}),
    };

    this.api
      .getReservasCliente({
        ...filters,
      })
      .subscribe((res) => {
        this.reservas = res;
      });

    console.log({ filters });
  }

  formatearFecha(fechaIso: string): string {
    const [year, month, day] = fechaIso.split('-').map(Number);

    // month - 1 porque JS usa meses 0–11
    const fecha = new Date(year, month - 1, day);

    const formato = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return formato.charAt(0).toUpperCase() + formato.slice(1).replace(',', ' -');
  }

  obtenerFechaHoyISO(): string {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancelarReserva({ codReservaSucursal, nroReserva, nroRestaurante }: ObtenerReservasCliente) {
    const reserva = {
      fechaCancelacion: this.obtenerFechaHoyISO(),
      codReservaSucursal,
      nroReserva,
      nroRestaurante,
    };

    this.reservaApi.actualizarReservaCliente(reserva).subscribe(() => {
      this.api.getReservasCliente().subscribe((res) => {
        this.reservas = res;
      });
    });
  }

  puedeEditarReserva(reserva: ObtenerReservasCliente): boolean {
    return puedeEditarReserva({ ...reserva });
  }
}
