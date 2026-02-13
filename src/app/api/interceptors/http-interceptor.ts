import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '../../store/session-store';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(SessionStore);
  const token = store.token();
  const nroIdioma = store.nroIdioma();
  const nroCliente = store.user()?.nroCliente;

  const headers: Record<string, string> = {
    nroIdioma: nroIdioma.toString(),
  };

  token && (headers['Authorization'] = `Bearer ${token}`);
  nroCliente && (headers['nroCliente'] = nroCliente?.toString());

  const request = req.clone({
    setHeaders: headers,
  });

  return next(request);
};
