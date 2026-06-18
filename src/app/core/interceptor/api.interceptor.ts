import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../services/api-response.model';
import { AuthService } from '../services/auth.service';
import { RefreshCoordinator } from './refresh-coordinator.service';

function isApiHost(url: string): boolean {
  try {
    return new URL(url).host === new URL(environment.apiUrl).host;
  } catch {
    return false;
  }
}

function toApiRequest(req: HttpRequest<unknown>, serverCookie: string | null): HttpRequest<unknown> {
  const isAbsolute = /^https?:\/\//i.test(req.url);
  const url = isAbsolute ? req.url : `${environment.apiUrl}${req.url}`;
  const apiReq = req.clone({ url, withCredentials: true });
  if (serverCookie && isApiHost(url)) {
    return apiReq.clone({ setHeaders: { Cookie: serverCookie } });
  }
  return apiReq;
}

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const auth = inject(AuthService);
  const refresh = inject(RefreshCoordinator);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const serverRequest = isBrowser ? null : inject(REQUEST, { optional: true });
  const serverCookie = serverRequest?.headers.get('cookie') ?? null;

  const apiReq = toApiRequest(req, serverCookie);
  const isRefreshRequest = apiReq.url.includes('/Account/Refresh');
  const isLoginRequest = apiReq.url.includes('/Account/Login');
  const isSessionProbe = apiReq.url.includes('/Account/CheckMe');
  const isSilentAuth = isRefreshRequest;

  const successToast = tap<HttpEvent<unknown>>((event) => {
    if (!isBrowser || isSilentAuth) {
      return;
    }
    if (event instanceof HttpResponse) {
      const message = (event.body as ApiResponse<unknown> | null)?.message;
      if (message) {
        messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
      }
    }
  });

  const errorToast = (error: HttpErrorResponse): Observable<never> => {
    if (isBrowser && !isSilentAuth) {
      const message = (error.error as ApiResponse<unknown> | null)?.message;
      if (message) {
        if (error.status >= 400 && error.status < 500) {
          messageService.add({ severity: 'warn', summary: 'Atenção', detail: message });
        } else {
          messageService.add({ severity: 'error', summary: 'Erro', detail: message });
        }
      }
    }
    return throwError(() => error);
  };

  const retryWithToasts = (): Observable<HttpEvent<unknown>> => next(apiReq).pipe(successToast, catchError(errorToast));

  const handleUnauthorized = (): Observable<HttpEvent<unknown>> => {
    if (refresh.isRefreshing) {
      return refresh.result$.pipe(
        filter((done): done is boolean => done !== null),
        take(1),
        switchMap((ok) => (ok ? retryWithToasts() : throwError(() => new Error('Sessão expirada.')))),
      );
    }

    refresh.isRefreshing = true;
    refresh.result$.next(null);

    return auth.refresh().pipe(
      catchError((refreshError) => {
        refresh.isRefreshing = false;
        refresh.result$.next(false);
        auth.clearAuth();
        if (isBrowser && !isSessionProbe && router.url !== '/auth/sign-in') {
          router.navigateByUrl('/auth/sign-in');
        }
        return throwError(() => refreshError);
      }),
      switchMap(() => {
        refresh.isRefreshing = false;
        refresh.result$.next(true);
        return retryWithToasts();
      }),
    );
  };

  return next(apiReq).pipe(
    successToast,
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshRequest && !isLoginRequest) {
        return handleUnauthorized();
      }
      return errorToast(error);
    }),
  );
};
