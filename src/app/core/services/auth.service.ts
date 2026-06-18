import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AccountService, LoginPayload, MeResponse } from './account/account.service';
import { ApiResponse } from './api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly account = inject(AccountService);

  private readonly _user = signal<MeResponse | null>(null);
  private readonly _isChecking = signal(false);
  private initialized = false;
  private check$?: Observable<boolean>;

  readonly user = this._user.asReadonly();
  readonly isChecking = this._isChecking.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(payload: LoginPayload): Observable<boolean> {
    return this.account.login(payload).pipe(
      map((res) => {
        this._user.set(res.data ?? null);
        this.initialized = true;
        return true;
      }),
      catchError(() => {
        this._user.set(null);
        return of(false);
      }),
    );
  }

  initAuth(): Observable<boolean> {
    if (this.initialized) {
      return of(this.isAuthenticated());
    }
    if (!this.check$) {
      this.check$ = this.checkMe().pipe(
        tap(() => (this.initialized = true)),
        map(() => this.isAuthenticated()),
        shareReplay(1),
      );
    }
    return this.check$;
  }

  checkMe(): Observable<boolean> {
    this._isChecking.set(true);
    return this.account.checkMe().pipe(
      map((res) => {
        this._user.set(res.data ?? null);
        return true;
      }),
      catchError(() => {
        this._user.set(null);
        return of(false);
      }),
      finalize(() => this._isChecking.set(false)),
    );
  }

  logout(): Observable<void> {
    return this.account.logout().pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
      finalize(() => this.clearAuth()),
    );
  }

  refresh(): Observable<ApiResponse<string>> {
    return this.account.refresh();
  }

  clearAuth(): void {
    this._user.set(null);
  }
}
