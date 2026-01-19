import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BannerComponent } from '../../components/banner/banner.component';

import { ClientesResource } from '../../api/resources/clientes-resource';
import { Cliente } from '../../api/resources/models/cliente.model';

@Component({
  selector: 'app-registrarse',
  imports: [BannerComponent, ReactiveFormsModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.scss',
})
export class RegistrarseComponent {
  constructor(private fb: FormBuilder, private clientesResource: ClientesResource) {}

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
    telefonos: [''],
    nroLocalidad: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.registroForm.invalid) {
      return;
    }

    const formValue = this.registroForm.value;

    const cliente: Cliente = {
      nroCliente: Math.floor(Math.random() * 100000),
      nombre: formValue.nombre!,
      apellido: formValue.apellido!,
      correo: formValue.correo!,
      clave: formValue.clave!,
      telefonos: formValue.telefonos ?? '',
      nroLocalidad: Number(formValue.nroLocalidad),
    };

    this.clientesResource.registrarCliente(cliente).subscribe({
      next: () => {
        console.log('✅ Cliente registrado correctamente');
        this.registroForm.reset();
      },
      error: (err) => {
        console.error('❌ Error al registrar cliente', err);
      },
    });
  }
}
