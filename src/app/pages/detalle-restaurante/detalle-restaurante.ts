import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Restaurant } from '../../api/resources/restaurante/models/restaurant.model';
import { Sucursal } from '../../api/resources/restaurante/models/sucursal.model';
import { PreferenciaRestaurante } from '../../api/resources/restaurante/models/preferencia-restaurante.model';
import { Location } from '@angular/common';
import { Promotion } from '../../api/resources/contenido/models/promotion.model';
import { RegistrarClickPromocionBody } from '../../api/resources/contenido/models/registrarClickPromocionBody.model';
import { ContenidoResource } from '../../api/resources/contenido/contenido-resource';
import { SessionStore } from '../../store/session-store';

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
  promociones: Promotion[] = [];
  especialidad: { nomValorDominio: string; observaciones: string } | null = null;
  cargando = false;

  constructor(
    private _route: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private contenidoApi: ContenidoResource,
    private sessionStore: SessionStore,
  ) {}

  volver(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this._route.data.subscribe(({ datosRestaurante, sucursales, preferencias, promociones }) => {
      this.restaurante = datosRestaurante;
      this.sucursales = sucursales;
      this.preferencias = preferencias;
      this.promociones = promociones;
    });

    if (this.preferencias?.length) {
      const { nomValorDominio, observaciones } = this.preferencias[0];
      this.especialidad = { nomValorDominio, observaciones };
    }
  }

  promosDeSucursal(nroSucursal: number) {
    return (this.promociones ?? []).filter((p) => p.nroSucursal === nroSucursal);
  }

  onPromoClick(promo: Promotion): void {
    const registrarClickBody: RegistrarClickPromocionBody = {
      nroRestaurante: promo.nroRestaurante,
      nroIdioma: promo.nroIdioma,
      nroContenido: promo.nroContenido,
      nroCliente: 1,
      costoClick: promo.costoClick,
      codContenidoRestaurante: promo.codContenidoRestaurante,
    };

    this.contenidoApi.registrarClickContenido(registrarClickBody).subscribe({
      next: (nroClick: number) => {
        console.log('Click registrado:', nroClick, 'promo:', promo);
        this.redirectToReservas(promo.nroSucursal);
      },
      error: (err) => {
        console.error('Error registrando click:', err);
      },
    });
  }

  redirectToReservas(nroSucursal: number) {
    const nroRestaurante = Number(this._route.snapshot.paramMap.get('nro_restaurante'));
    this.sessionStore.setReservaDraft({
      nroRestaurante,
      nroSucursal,
    });
    this.router.navigate(['/reservar']);
  }
}
