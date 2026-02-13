import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { SucursalRestaurante } from '../../api/resources/restaurante/models/sucursal-restaurante';
import { TurnoDisponible } from '../../api/resources/reserva/models/turno-disponible.model';
import {
  CrearReservaDraftRequest,
  CrearReservaRequest,
} from '../../api/resources/reserva/models/reserva.model';
import { RestauranteResource } from '../../api/resources/restaurante/restaurante-resource';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { SessionStore } from '../../store/session-store';

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

  cantidadesComensalesOpciones: number[] = Array.from({ length: 60 }, (_, i) => i);

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
      personas: [{ value: null, disabled: true }, Validators.required],
      menores: [{ value: null, disabled: true }, Validators.required],
      turno: [{ value: null, disabled: true }, Validators.required],
    });
  }

  private loadRestaurantesFromResolver(): void {
    this.route.data.subscribe(({ restaurantes }) => (this.restaurantes = restaurantes));
  }

  private wireControlFlow(): void {
    this.onRestauranteChange();
    this.onSucursalChange();
    this.onFechaChange();
    this.onPersonasChange();
    this.onMenoresChange();
  }

  // ----------------------------
  // ValueChanges (flujo)
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

      this.enable('personas');
      this.updateMenoresAvailability();

      const nroRestaurante = Number(this.form.get('restaurante')?.value);
      const nroSucursal = Number(this.form.get('sucursal')?.value);
      if (!nroRestaurante || !nroSucursal) return;

      this.fetchTurnosDisponibles(nroRestaurante, nroSucursal, fecha);
    });
  }

  private onPersonasChange(): void {
    this.form.get('personas')?.valueChanges.subscribe((cantidad) => {
      this.resetFrom('personas');

      if (!cantidad) return;

      this.enable('turno');
    });
  }

  private onMenoresChange(): void {
    this.form.get('menores')?.valueChanges.subscribe((menores) => {
      this.resetFrom('menores');

      if (!menores) return;

      this.enable('turno');
    });
  }

  // ----------------------------
  // Reset/Enable helpers
  // ----------------------------

  /**
   * Resetea y deshabilita todo lo que depende del campo indicado.
   * La idea: una sola fuente de verdad para el "cascade reset".
   */
  private resetFrom(from: 'restaurante' | 'sucursal' | 'fecha' | 'personas' | 'menores'): void {
    if (from === 'restaurante') {
      this.sucursales = [];
      this.turnosDisponibles = [];
      this.disableAndReset(['sucursal', 'fecha', 'personas', 'menores', 'turno']);
      return;
    }

    if (from === 'sucursal') {
      this.turnosDisponibles = [];
      this.disableAndReset(['fecha', 'personas', 'menores', 'turno']);
      return;
    }

    if (from === 'fecha') {
      this.turnosDisponibles = [];
      this.disableAndReset(['personas', 'menores', 'turno']);
      return;
    }

    // from === 'personas'
    this.disableAndReset(['turno']);
  }

  private disableAndReset(
    keys: Array<'sucursal' | 'fecha' | 'personas' | 'menores' | 'turno'>,
  ): void {
    keys.forEach((k) => {
      const c = this.form.get(k);
      c?.reset();
      c?.disable();
    });
  }

  private enable(key: 'sucursal' | 'fecha' | 'personas' | 'menores' | 'turno'): void {
    this.form.get(key)?.enable();
  }

  // ----------------------------
  // Business helpers
  // ----------------------------

  private updateMenoresAvailability(): void {
    // por defecto, menores queda deshabilitado hasta evaluar la sucursal
    this.form.get('menores')?.reset();
    this.form.get('menores')?.disable();

    const raw = this.form.getRawValue();
    const sucursalSeleccionada = this.sucursales.find(
      (s) => Number(s.nroSucursal) === Number(raw.sucursal),
    );

    if (sucursalSeleccionada?.permiteMenores === 1) {
      this.enable('menores');
    }
  }

  private getDraft(): CrearReservaDraftRequest | null {
    return this.sessionStore.reservaDraft();
  }

  // ----------------------------
  // Draft restore (secuencia explícita)
  // ----------------------------

  private tryRestoreDraft(): void {
    const draft = this.getDraft();
    if (!draft) return;

    this.restoring = true;

    // Paso 1: set restaurante => dispara fetchSucursales
    this.form.patchValue({ restaurante: draft.nroRestaurante }, { emitEvent: true });
  }

  private continueRestoreAfterSucursalesLoaded(): void {
    const d = this.getDraft();
    if (!this.restoring || !d) return;

    // Paso 2: set sucursal => habilita fecha
    this.form.patchValue({ sucursal: d.nroSucursal }, { emitEvent: true });

    // Paso 3: set fecha => dispara fetchTurnosDisponibles
    this.enable('fecha');
    this.form.patchValue({ fecha: d.fechaReserva }, { emitEvent: true });
  }

  private continueRestoreAfterTurnosLoaded(): void {
    const d = this.getDraft();
    if (!this.restoring || !d) return;

    // Paso 4: set personas/menores => habilita turno
    this.enable('personas');
    this.enable('menores');
    this.form.patchValue({ personas: d.cantAdultos, menores: d.cantMenores }, { emitEvent: true });

    // Paso 5: turno si existe
    const existe = this.turnosDisponibles.some((t) => t.horaReserva === d.horaReserva);
    this.enable('turno');
    this.form.patchValue({ turno: existe ? d.horaReserva : null }, { emitEvent: true });

    this.restoring = false;
    this.sessionStore.clearReservaDraft();
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

        // si venimos de draft, seguimos la secuencia
        this.continueRestoreAfterSucursalesLoaded();
      });
  }

  private fetchTurnosDisponibles(
    nroRestaurante: number,
    nroSucursal: number,
    fechaAReservar: string,
  ): void {
    this.reservaApi
      .getDisponibilidadTurnos({ nroRestaurante, nroSucursal, fechaAReservar })
      .subscribe((turnos) => {
        this.turnosDisponibles = turnos;

        // si venimos de draft, seguimos la secuencia
        this.continueRestoreAfterTurnosLoaded();
      });
  }

  // ----------------------------
  // Submit
  // ----------------------------

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const sucursalSeleccionada = this.sucursales.find(
      (s) => Number(s.nroSucursal) === Number(raw.sucursal),
    );

    const reserva: CrearReservaRequest = {
      nroRestaurante: Number(raw.restaurante),
      nroSucursal: Number(raw.sucursal),
      fechaReserva: raw.fecha,
      horaReserva: raw.turno,
      cantAdultos: Number(raw.personas),
      cantMenores: Number(raw.menores),
      codZona: sucursalSeleccionada?.codZona ?? '',
    };

    if (!this.sessionStore.isUserLogged()) {
      this.sessionStore.setReservaDraft(reserva);
      this.router.navigate(['/login'], { state: { from: this.router.url } });
      return;
    }

    this.reservaApi.crearReserva(reserva).subscribe({
      next: () => {},
      error: () => {
        this.form.get('turno')?.reset();
        this.form.get('fecha')?.updateValueAndValidity();
      },
    });
  }

  // ----------------------------
  // UI helpers
  // ----------------------------

  isTurnoDisabled(t: TurnoDisponible): boolean {
    const personas = Number(this.form.get('personas')?.value ?? 0);
    const menores = Number(this.form.get('menores')?.value ?? 0);
    const total = personas + menores;
    return total > t.cupoDisponible || t.turnoCerrado === 1;
  }
}
