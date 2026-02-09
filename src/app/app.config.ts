import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ResourceHandler } from '@ngx-resource/core';
import { ResourceHandlerHttpClient } from '@ngx-resource/handler-ngx-http';
import { httpInterceptor } from './api/interceptors/http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    { provide: ResourceHandler, useClass: ResourceHandlerHttpClient },
  ],
};
