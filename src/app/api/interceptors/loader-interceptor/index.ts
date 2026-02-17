import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../services/loader-service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  const skip = req.headers.get('X-Skip-Loader') === 'true';

  if (!skip) {
    loader.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skip) {
        loader.hide();
      }
    }),
  );
};
