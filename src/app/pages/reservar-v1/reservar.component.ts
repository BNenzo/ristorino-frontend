import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { SucursalRestaurante } from '../../api/resources/restaurante/models/sucursal-restaurante';
import {
  CrearReservaDraftRequest,
  CrearReservaRequest,
} from '../../api/resources/reserva/models/reserva.model';
import { RestauranteResource } from '../../api/resources/restaurante/restaurante-resource';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { SessionStore } from '../../store/session-store';
import { DisponibilidadZonaRow, HorarioDisponible, ZonaDisponible } from './types';
import { agruparDisponibilidadPorZona } from './utils/agrupar-disponibilidad-por-zona';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss'],
})
export class ReservarComponent implements OnInit {
  // ----------------------------
  // Estado
  // ----------------------------
  form!: FormGroup;

  restaurantes: Restaurante[] = [];
  sucursales: SucursalRestaurante[] = [];
  zonasDisponibles: ZonaDisponible[] = [];
  zonaSeleccionada: ZonaDisponible | null = null;
  cantidadesComensalesOpciones: number[] = Array.from({ length: 10 }, (_, i) => i);

  mostrarModal = false;
  mostrarModalError = false;
  modalData: {
    restaurante?: string;
    sucursal?: string;
    fecha?: string;
    hora?: string;
    codigo?: string;
  } = {};

  private restoring = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restauranteApi: RestauranteResource,
    private reservaApi: ReservaResource,
    private sessionStore: SessionStore,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadRestaurantesFromResolver();
    this.wireControlFlow();
    this.tryRestoreDraft();
  }

  // ----------------------------
  // Setup
  // ----------------------------

  private buildForm(): void {
    this.form = this.fb.group({
      restaurante: [null, Validators.required],
      sucursal: [{ value: null, disabled: true }, Validators.required],
      fecha: [{ value: null, disabled: true }, Validators.required],
      zona: [{ value: null, disabled: true }, Validators.required],
      turno: [{ value: null, disabled: true }, Validators.required],
      personas: [{ value: null, disabled: true }, Validators.required],
      menores: [{ value: null, disabled: true }], // sin required: puede no aplicar
    });
  }

  private loadRestaurantesFromResolver(): void {
    this.route.data.subscribe(({ restaurantes }) => (this.restaurantes = restaurantes));
  }

  private wireControlFlow(): void {
    this.onRestauranteChange();
    this.onSucursalChange();
    this.onFechaChange();
    this.onZonaChange();
    this.onTurnoChange();
  }

  // ----------------------------
  // ValueChanges (flujo en cascada)
  // ----------------------------

  private onRestauranteChange(): void {
    this.form.get('restaurante')?.valueChanges.subscribe((nroRestaurante) => {
      this.resetFrom('restaurante');
      if (!nroRestaurante) return;
      this.fetchSucursales(nroRestaurante);
    });
  }

  private onSucursalChange(): void {
    this.form.get('sucursal')?.valueChanges.subscribe((sucursal) => {
      this.resetFrom('sucursal');
      if (!sucursal) return;
      this.enable('fecha');
    });
  }

  private onFechaChange(): void {
    this.form.get('fecha')?.valueChanges.subscribe((fecha) => {
      this.resetFrom('fecha');
      if (!fecha) return;

      const nroRestaurante = Number(this.form.get('restaurante')?.value);
      const nroSucursal = Number(this.form.get('sucursal')?.value);
      if (!nroRestaurante || !nroSucursal) return;

      // this.fetchDisponibilidad(nroRestaurante, nroSucursal, fecha);
    });
  }

  private onZonaChange(): void {
    this.form.get('zona')?.valueChanges.subscribe((codZona) => {
      this.resetFrom('zona');
      if (!codZona) return;

      this.zonaSeleccionada = this.zonasDisponibles.find((z) => z.codZona === codZona) ?? null;
      this.enable('turno');
    });
  }

  private onTurnoChange(): void {
    this.form.get('turno')?.valueChanges.subscribe((turno) => {
      this.resetFrom('turno');
      if (!turno) return;

      this.enable('personas');

      // Menores: solo si la zona lo permite
      if (this.zonaSeleccionada?.permiteMenores) {
        this.enable('menores');
      }
    });
  }

  // ----------------------------
  // Reset / Enable helpers
  // ----------------------------

  private resetFrom(from: 'restaurante' | 'sucursal' | 'fecha' | 'zona' | 'turno'): void {
    switch (from) {
      case 'restaurante':
        this.sucursales = [];
        this.zonasDisponibles = [];
        this.zonaSeleccionada = null;
        this.disableAndReset(['sucursal', 'fecha', 'zona', 'turno', 'personas', 'menores']);
        break;

      case 'sucursal':
        this.zonasDisponibles = [];
        this.zonaSeleccionada = null;
        this.disableAndReset(['fecha', 'zona', 'turno', 'personas', 'menores']);
        break;

      case 'fecha':
        this.zonasDisponibles = [];
        this.zonaSeleccionada = null;
        this.disableAndReset(['zona', 'turno', 'personas', 'menores']);
        break;

      case 'zona':
        this.zonaSeleccionada = null;
        this.disableAndReset(['turno', 'personas', 'menores']);
        break;

      case 'turno':
        this.disableAndReset(['personas', 'menores']);
        break;
    }
  }

  private disableAndReset(keys: Array<keyof typeof this.form.controls>): void {
    keys.forEach((k) => {
      const c = this.form.get(k as string);
      c?.reset();
      c?.disable();
    });
  }

  private enable(key: string): void {
    this.form.get(key)?.enable();
  }

  // ----------------------------
  // UI helpers
  // ----------------------------

  get horariosDeZonaSeleccionada(): HorarioDisponible[] {
    return this.zonaSeleccionada?.horarios ?? [];
  }

  isHorarioDisabled(h: HorarioDisponible): boolean {
    const personas = Number(this.form.get('personas')?.value ?? 0);
    const menores = Number(this.form.get('menores')?.value ?? 0);
    return personas + menores > h.cupoDisponible;
  }

  // ----------------------------
  // Draft restore
  // ----------------------------

  private tryRestoreDraft(): void {
    const draft = this.getDraft();
    if (!draft) return;
    this.restoring = true;
    this.form.patchValue({ restaurante: draft.nroRestaurante }, { emitEvent: true });
  }

  private continueRestoreAfterSucursalesLoaded(): void {
    const d = this.getDraft();
    if (!this.restoring || !d) return;

    this.form.patchValue({ sucursal: d.nroSucursal }, { emitEvent: true });
    this.enable('fecha');
    this.form.patchValue({ fecha: d.fechaReserva }, { emitEvent: true });
  }

  private continueRestoreAfterDisponibilidadLoaded(): void {
    const d = this.getDraft();
    if (!this.restoring || !d) return;

    // Restaurar zona
    const zonaExiste = this.zonasDisponibles.some((z) => z.codZona === d.codZona);
    this.enable('zona');
    this.form.patchValue({ zona: zonaExiste ? d.codZona : null }, { emitEvent: true });

    if (!zonaExiste) {
      this.restoring = false;
      this.sessionStore.clearReservaDraft();
      return;
    }

    // Restaurar turno
    const turnoExiste = this.zonaSeleccionada?.horarios.some((h) => h.horaDesde === d.horaReserva);
    this.enable('turno');
    this.form.patchValue({ turno: turnoExiste ? d.horaReserva : null }, { emitEvent: true });

    // Restaurar personas y menores
    this.enable('personas');
    if (this.zonaSeleccionada?.permiteMenores) this.enable('menores');
    this.form.patchValue({ personas: d.cantAdultos, menores: d.cantMenores }, { emitEvent: true });

    this.restoring = false;
    this.sessionStore.clearReservaDraft();
  }

  private getDraft(): CrearReservaDraftRequest | null {
    return this.sessionStore.reservaDraft();
  }

  // ----------------------------
  // API
  // ----------------------------

  private fetchSucursales(nroRestaurante: number): void {
    this.restauranteApi
      .getSucursalesDeRestaurante({ nro_restaurante: nroRestaurante })
      .subscribe((sucursales) => {
        this.sucursales = sucursales;
        this.enable('sucursal');
        this.continueRestoreAfterSucursalesLoaded();
      });
  }

  // private fetchDisponibilidad(nroRestaurante: number, nroSucursal: number, fecha: string): void {
  //   this.reservaApi
  //     .getDisponibilidadTurnos({ nroRestaurante, nroSucursal, fechaAReservar: fecha })
  //     .subscribe((rows: DisponibilidadZonaRow[]) => {
  //       this.zonasDisponibles = agruparDisponibilidadPorZona(rows);
  //       if (this.zonasDisponibles.length > 0) {
  //         this.enable('zona');
  //       }
  //       this.continueRestoreAfterDisponibilidadLoaded();
  //     });
  // }

  // ----------------------------
  // Submit
  // ----------------------------

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const reserva: CrearReservaRequest = {
      nroRestaurante: Number(raw.restaurante),
      nroSucursal: Number(raw.sucursal),
      fechaReserva: raw.fecha,
      horaReserva: raw.turno,
      cantAdultos: Number(raw.personas),
      cantMenores: Number(raw.menores ?? 0),
      codZona: raw.zona,
    };

    if (!this.sessionStore.isUserLogged()) {
      this.sessionStore.setReservaDraft(reserva);
      this.router.navigate(['/login'], { state: { from: this.router.url } });
      return;
    }

    this.reservaApi.crearReserva(reserva).subscribe({
      next: (codigoReserva: string) => {
        const raw = this.form.getRawValue();
        const restauranteSeleccionado = this.restaurantes.find(
          (r) => Number(r.nroRestaurante) === Number(raw.restaurante),
        );
        const sucursalSeleccionada = this.sucursales.find(
          (s) => Number(s.nroSucursal) === Number(raw.sucursal),
        );

        this.modalData = {
          restaurante: restauranteSeleccionado?.razonSocial ?? '',
          sucursal: sucursalSeleccionada?.nomSucursal ?? '',
          fecha: raw.fecha,
          hora: raw.turno?.slice(0, 5),
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

  irHome(): void {
    this.mostrarModal = false;
    this.router.navigate(['/']);
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
    this.form.reset();
  }
}
