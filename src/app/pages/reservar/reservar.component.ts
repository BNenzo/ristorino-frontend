import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ObtenerSucursalesFormReservas } from '../../api/resources/reservas/models/obtener-sucursales.model';
import { ObtenerZonasSucursalesRestaurantesFormReservas } from '../../api/resources/reservas/models/obtener-zonas-sucursales-restaurantes.model';
import type { IResourceResponse } from '@ngx-resource/core';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { DisponibilidadTurnos } from '../../api/resources/reserva/models/disponibilidad-turnos.model';
import { SessionStore } from '../../store/session-store';

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

  step: 'consulta' | 'reservar' = 'consulta';

  turnosDisponibles: DisponibilidadTurnos[] = [];
  turnoSeleccionado: string | null = null;
  @ViewChild('fechaHiddenInput') fechaHiddenInput!: ElementRef<HTMLInputElement>;

  mostrarModal = false;
  mostrarModalError = false;
  mensajeError = '';
  private reintentarConsultaAlCerrarError = false;
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
    private sessionStore: SessionStore,
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
    const nroRestaurante = this.route.snapshot.paramMap.get('nroRestaurante'); // 1
    const nroSucursal = this.route.snapshot.paramMap.get('nroSucursal'); // 1

    // Logica para enviar al usuario a logearse y cuando termine el proceso sea redirigido a la pagina de reservar
    if (!this.sessionStore.isUserLogged()) {
      const returnUrl = this.router.serializeUrl(
        this.router.createUrlTree(['/reservar', nroRestaurante, nroSucursal]),
      );
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: returnUrl },
      });
      return;
    }

    // Escuchás cambios en el select de restaurante
    this.form.get('restaurante')!.valueChanges.subscribe((nroRestaurante) => {
      this.sucursalesFiltradas = this.sucursales.filter(
        (s) => s.nroRestaurante === Number(nroRestaurante),
      );

      // Reseteás la sucursal y zona seleccionada cuando cambia el restaurante
      this.form.get('sucursal')!.setValue('');
      this.form.get('zona')!.setValue('');
    });

    // Escuchás cambios en el select de sucursal
    this.form.get('sucursal')!.valueChanges.subscribe((nroSucursal) => {
      const nroRestaurante = Number(this.form.get('restaurante')!.value);

      this.zonasFiltradas = this.zonas.filter(
        (zona) =>
          zona.nroRestaurante === nroRestaurante && zona.nroSucursal === Number(nroSucursal),
      );

      // Reseteás la zona seleccionada cuando cambia la sucursal
      this.form.get('zona')!.setValue('');
    });

    this.route.data.subscribe(({ restaurantes, sucursales, zonas }) => {
      this.restaurantes = restaurantes;
      this.sucursales = sucursales;
      this.zonas = zonas;

      if (nroRestaurante) {
        // Preseleccionás el restaurante → esto dispara el valueChanges
        // que filtra las sucursales automáticamente
        this.form.get('restaurante')!.setValue(nroRestaurante);
      }

      if (nroSucursal) {
        // Preseleccionás la sucursal → dispara el valueChanges de zonas
        this.form.get('sucursal')!.setValue(nroSucursal);
      }
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

  get nomSucursal(): string {
    const nroSucursal = this.form.get('sucursal')!.value;
    return (
      this.sucursales.find((s) => s.nroSucursal === Number(nroSucursal))?.nomSucursal ?? nroSucursal
    );
  }

  get nomRestaurante(): string {
    const nroRestaurante = this.form.get('restaurante')!.value;
    return (
      this.restaurantes.find((s) => s.nroRestaurante === Number(nroRestaurante))?.razonSocial ??
      nroRestaurante
    );
  }

  abrirCalendario(): void {
    this.fechaHiddenInput.nativeElement.showPicker();
  }

  cambiarFecha(dias: number): void {
    const fechaActual = new Date(this.form.get('fecha')!.value);
    fechaActual.setDate(fechaActual.getDate() + dias);
    const nueva = fechaActual.toISOString().split('T')[0];
    this.form.get('fecha')!.setValue(nueva);
    this.consultarDisponibilidad();
  }

  onFechaCambiada(): void {
    this.consultarDisponibilidad();
  }

  consultarDisponibilidad(): void {
    console.log('Consultando disponibilidad para fecha:', this.form.get('fecha')!.value);
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
      .subscribe({
        next: (rows: DisponibilidadTurnos[]) => {
          console.log(rows);
          this.turnosDisponibles = rows;
          this.step = 'reservar';
        },
        error: (err: IResourceResponse<{ message?: string }>) => {
          this.turnosDisponibles = [];
          this.turnoSeleccionado = null;
          this.reintentarConsultaAlCerrarError = false;
          this.mensajeError = $localize`:@@disponibilidadErrorGenerico:Ocurrió un error al consultar la disponibilidad.`;
          this.mostrarModalError = true;
        },
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
        error: (err: IResourceResponse<{ message?: string }>) => {
          this.reintentarConsultaAlCerrarError = true;
          this.mensajeError = this.traducirMensajeError(err.body?.message);
          this.mostrarModalError = true;
        },
      });
  }

  private traducirMensajeError(
    mensajeBackend?: string,
    mensajeGenerico: string = $localize`:@@reservaErrorGenerico:Ocurrió un error al realizar la reserva.`,
  ): string {
    if (mensajeBackend?.includes('RESERVA_TURNO_INEXISTENTE')) {
      return $localize`:@@reservaErrorSinTurno:No hay turno para la hora solicitada.`;
    }
    if (mensajeBackend?.includes('RESERVA_TURNO_NO_HABILITADO')) {
      return $localize`:@@reservaErrorTurnoNoHabilitado:El turno seleccionado no está habilitado.`;
    }
    if (mensajeBackend?.includes('RESERVA_SIN_CUPO')) {
      return $localize`:@@reservaErrorSinCupo:No hay cupo disponible para el turno seleccionado.`;
    }
    if (mensajeBackend?.includes('RESERVA_CUPO_INSUFICIENTE')) {
      return $localize`:@@reservaErrorCupoInsuficiente:No hay cupo disponible para la cantidad de comensales solicitada.`;
    }
    return mensajeGenerico;
  }

  turnoDeshabilitado(turno: DisponibilidadTurnos): boolean {
    return (
      turno.cupoDisponible === 0 ||
      turno.habilitado === 0 ||
      this.cantMenores + this.cantAdultos > turno.cupoDisponible
    );
  }

  seleccionarTurno(turno: DisponibilidadTurnos): void {
    if (this.turnoDeshabilitado(turno)) {
      return;
    }
    this.turnoSeleccionado = turno.horaDesde;
    // Acá después harías el POST de la reserva
    console.log('Turno seleccionado:', turno);
  }

  volverAlFormulario(): void {
    this.step = 'consulta';
    this.turnosDisponibles = [];
    this.turnoSeleccionado = null;
  }

  irHome(): void {
    this.mostrarModal = false;
    this.router.navigate(['/']);
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
    this.mensajeError = '';

    // Solo reintenta si el error vino de reservar(): ahí el turno/cupo quedó
    // desactualizado y refrescar corrige el problema. Si el error vino de
    // consultarDisponibilidad(), reintentar automáticamente repetiría el
    // mismo fallo y dejaría al usuario sin poder volver al formulario.
    if (this.reintentarConsultaAlCerrarError) {
      this.turnoSeleccionado = null;
      this.consultarDisponibilidad();
    }
  }
}
