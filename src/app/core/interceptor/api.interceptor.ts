import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../services/api-response.model';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshResult$ = new BehaviorSubject<boolean | null>(null);

function toApiRequest(req: HttpRequest<unknown>): HttpRequest<unknown> {
  const isAbsolute = /^https?:\/\//i.test(req.url);
  const url = isAbsolute ? req.url : `${environment.apiUrl}${req.url}`;
  return req.clone({ url, withCredentials: true });
}

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const auth = inject(AuthService);

  const apiReq = toApiRequest(req);
  const isRefreshRequest = apiReq.url.includes('/Account/Refresh');
  const isLoginRequest = apiReq.url.includes('/Account/Login');
  const isSessionProbe = apiReq.url.includes('/Account/CheckMe');
  const isSilentAuth = isRefreshRequest;

  const successToast = tap<HttpEvent<unknown>>((event) => {
    if (event instanceof HttpResponse && !isSilentAuth) {
      const message = (event.body as ApiResponse<unknown> | null)?.message;
      if (message) {
        messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
      }
    }
  });

  const errorToast = (error: HttpErrorResponse): Observable<never> => {
    if (!isSilentAuth) {
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
    if (isRefreshing) {
      return refreshResult$.pipe(
        filter((done): done is boolean => done !== null),
        take(1),
        switchMap((ok) => (ok ? retryWithToasts() : throwError(() => new Error('Sessão expirada.')))),
      );
    }

    isRefreshing = true;
    refreshResult$.next(null);

    return auth.refresh().pipe(
      catchError((refreshError) => {
        isRefreshing = false;
        refreshResult$.next(false);
        auth.clearAuth();
        if (!isSessionProbe && router.url !== '/auth/sign-in') {
          router.navigateByUrl('/auth/sign-in');
        }
        return throwError(() => refreshError);
      }),
      switchMap(() => {
        isRefreshing = false;
        refreshResult$.next(true);
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
