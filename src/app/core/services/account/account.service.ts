import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../api-response.model';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  roleId: number;
  claims?: string[];
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  login(payload: LoginPayload): Observable<ApiResponse<MeResponse>> {
    return this.http.post<ApiResponse<MeResponse>>('/Account/Login', payload);
  }

  checkMe(): Observable<ApiResponse<MeResponse>> {
    return this.http.get<ApiResponse<MeResponse>>('/Account/CheckMe');
  }

  refresh(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>('/Account/Refresh', {});
  }

  logout(): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>('/Account/Logout', {});
  }
}
