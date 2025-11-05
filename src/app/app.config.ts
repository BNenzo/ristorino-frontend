import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ResourceHandler } from '@ngx-resource/core';
import { ResourceHandlerHttpClient } from '@ngx-resource/handler-ngx-http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(),
    { provide: ResourceHandler, useClass: ResourceHandlerHttpClient },
  ],
};
