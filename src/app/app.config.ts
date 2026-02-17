import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ResourceHandler } from '@ngx-resource/core';
import { ResourceHandlerHttpClient } from '@ngx-resource/handler-ngx-http';
import { httpInterceptor } from './api/interceptors/http-interceptor';
import { AuthResource } from './api/resources/auth/auth-resource';
import { initSession } from './store/utils/initSession';
import { loaderInterceptor } from './api/interceptors/loader-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor, loaderInterceptor])),
    { provide: ResourceHandler, useClass: ResourceHandlerHttpClient },
    AuthResource,
    provideAppInitializer(initSession),
  ],
};
