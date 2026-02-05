import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const nroIdioma = '1';
  const nroCliente: number = 1;

  const headers: Record<string, string> = {
    nroIdioma,
  };

  if (nroCliente != null) {
    headers['nroCliente'] = nroCliente.toString();
  }

  const requestClonada = req.clone({
    setHeaders: headers,
  });

  return next(requestClonada);
};
