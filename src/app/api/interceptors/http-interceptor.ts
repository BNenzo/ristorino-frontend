import { HttpInterceptorFn } from '@angular/common/http';
import { inject, LOCALE_ID } from '@angular/core';
import { SessionStore } from '../../store/session-store';
import { NRO_IDIOMA_POR_LOCALE } from '../../constants';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const locale = inject(LOCALE_ID);
  const store = inject(SessionStore);
  const token = store.token();
  const nroCliente = store.user()?.nroCliente;

  const headers: Record<string, string> = {
    nroIdioma: NRO_IDIOMA_POR_LOCALE[locale].toString(),
  };

  token && (headers['Authorization'] = `Bearer ${token}`);
  nroCliente && (headers['nroCliente'] = nroCliente?.toString());

  const request = req.clone({
    setHeaders: headers,
  });

  return next(request);
};
