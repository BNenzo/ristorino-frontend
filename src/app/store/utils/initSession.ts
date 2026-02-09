import { inject } from '@angular/core';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { SessionStore } from '../session-store';
import { AuthResource } from '../../api/resources/auth/auth-resource';

export function initSession() {
  const session = inject(SessionStore);
  const auth = inject(AuthResource);

  session.initFromStorage();
  const token = session.token();
  if (!token) return;

  return firstValueFrom(
    auth.me().pipe(
      tap((user) => session.setUser(user)),
      catchError(() => {
        session.clearSession();
        return of(null);
      }),
    ),
  );
}
