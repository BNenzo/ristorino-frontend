import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Restaurant } from '../../api/resources/models/restaurant.model';
import { Sucursal } from '../../api/resources/models/sucursal.model';
import { PreferenciaRestaurante } from '../../api/resources/models/preferencia-restaurante.model';
import { Location } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
  selector: 'app-detalle-restaurante',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  providers: [RistorinoResource],
  templateUrl: './detalle-restaurante.html',
  styleUrls: ['./detalle-restaurante.scss'],
})
export class DetalleRestauranteComponent implements OnInit {
  restaurante: Restaurant | null = null;
  sucursales: Sucursal[] = [];
  preferencias: PreferenciaRestaurante[] = [];
  especialidad: { nomValorDominio: string; observaciones: string } | null = null; //me quedo solo con lo que quiero de preferencias
  cargando = false;

  constructor(
    private _route: ActivatedRoute,
    private api: RistorinoResource,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  volver(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const nroRestaurante = Number(this.route.snapshot.paramMap.get('nro_restaurante'));
    console.log('Número restaurante desde URL:', nroRestaurante);

    this._route.data.subscribe(({ datosRestaurante, sucursales, preferencias }) => {
      this.restaurante = datosRestaurante;
      this.sucursales = sucursales;
      this.preferencias = preferencias;

      console.log('Datos restaurante:', datosRestaurante);
      console.log('Sucursales:', sucursales);
      console.log('Preferencias:', preferencias);
    });

    if (this.preferencias?.length) {
      const { nomValorDominio, observaciones } = this.preferencias[0];
      this.especialidad = { nomValorDominio, observaciones };
    }
  }
}
