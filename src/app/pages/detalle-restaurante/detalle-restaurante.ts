import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Restaurant } from '../../api/resources/models/restaurant.model';
import { Sucursal } from '../../api/resources/models/sucursal.model';
import { PreferenciaRestaurante } from '../../api/resources/models/preferencia-restaurante.model';

@Component({
  selector: 'app-detalle-restaurante',
  standalone: true,
  imports: [CommonModule],
  providers: [RistorinoResource],
  templateUrl: './detalle-restaurante.html',
  styleUrls: ['./detalle-restaurante.scss'],
})
export class DetalleRestauranteComponent implements OnInit {
  restaurante: Restaurant | null = null;
  sucursales: Sucursal[] = [];
  preferencias: PreferenciaRestaurante[] = [];
  especialidad: { nomValorDominio: string; observaciones: string } | null = null; //me quedo solo con lo que quiero de preferencias
  cargando = true;

  constructor(private api: RistorinoResource, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const nroRestaurante = Number(this.route.snapshot.paramMap.get('nro_restaurante'));
    console.log('Número restaurante desde URL:', nroRestaurante); // debug
    if (nroRestaurante) {
      this.cargarDatos(nroRestaurante);
      this.cargarSucursales(nroRestaurante);
      this.cargarPreferencias(nroRestaurante);
    } else {
      this.cargando = false;
    }
  }

  cargarDatos(nroRestaurante: number): void {
    this.api.getDatosRestaurante({ nroRestaurante }).subscribe({
      next: (datos) => {
        console.log('Datos recibidos:', datos);
        this.restaurante = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del restaurante', err);
        this.cargando = false;
      },
    });
  }

  cargarSucursales(nroRestaurante: number): void {
    this.api.getSucursalesRestaurante({ nroRestaurante }).subscribe({
      next: (sucursales) => {
        console.log('Sucursales:', sucursales);
        this.sucursales = sucursales;
      },
      error: (err) => console.error('Error al cargar sucursales', err),
    });
  }

  cargarPreferencias(nroRestaurante: number): void {
    this.api.getPreferenciasRestaurante({ nroRestaurante }).subscribe({
      next: (preferencias) => {
        console.log('Preferencias:', preferencias);
        this.preferencias = preferencias;

        if (preferencias && preferencias.length > 0) {
          const primera = preferencias[0];
          this.especialidad = {
            nomValorDominio: primera.nomValorDominio,
            observaciones: primera.observaciones,
          };
        }
      },
      error: (err) => console.error('Error al cargar preferencias', err),
    });
  }
}
