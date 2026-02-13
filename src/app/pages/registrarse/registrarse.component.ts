import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { ClienteResource } from '../../api/resources/cliente/cliente-resource';
import { LocalidadResponse } from '../../api/resources/localidad/models/localidad.model';
import { PreferenciaResponse } from '../../api/resources/preferencia/models/preferencia.model';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.scss',
})
export class RegistrarseComponent {
  localidades: LocalidadResponse[] = [];
  preferencias: PreferenciaResponse[] = [];

  form = this.fb.group(
    {
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: [null, Validators.required],
      telefono: [''],
      nroLocalidad: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      preferencias: this.fb.nonNullable.control<number[]>([], Validators.required),
    },
    { validators: passwordMatchValidator },
  );

  constructor(
    private fb: FormBuilder,
    private clienteApi: ClienteResource,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // DATOS VIENEN DEL RESOLVER
    this.localidades = this.route.snapshot.data['localidades'];
    this.preferencias = this.route.snapshot.data['preferencias'];
  }

  /* ==========================
     CHIPS LOGIC
  ========================== */

  isSelected(id: number): boolean {
    return this.form.value.preferencias?.includes(id) ?? false;
  }

  togglePreferencia(id: number) {
    const actuales = this.form.value.preferencias || [];

    if (actuales.includes(id)) {
      this.form.patchValue({
        preferencias: actuales.filter((p: number) => p !== id),
      });
    } else {
      this.form.patchValue({
        preferencias: [...actuales, id],
      });
    }

    this.form.get('preferencias')?.markAsTouched();
  }

  /* ==========================
     SUBMIT
  ========================== */

  onSubmit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload = {
      correo: raw.correo!,
      nombre: raw.nombre!,
      apellido: raw.apellido!,
      dni: Number(raw.dni),
      telefono: raw.telefono || '',
      nroLocalidad: Number(raw.nroLocalidad),
      password: raw.password!,
      preferencias: raw.preferencias!,
    };

    this.clienteApi.registrar(payload).subscribe({
      next: () => {
        alert('Cuenta creada correctamente 🎉');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('El correo ya está registrado ❌');
        } else {
          alert('Error inesperado');
        }
      },
    });
  }
}

/* ==========================
   PASSWORD VALIDATOR
========================== */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) return null;

  return password === confirmPassword ? null : { passwordsNotMatching: true };
}
