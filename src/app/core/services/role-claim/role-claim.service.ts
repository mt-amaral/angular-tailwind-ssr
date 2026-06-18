import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../api-response.model';

export interface RoleClaimItem {
  claimValue: string;
  claimType: string;
  description: string;
  selected: boolean;
}

export interface RoleClaimResponse {
  roleId: number;
  roleName: string;
  claims: RoleClaimItem[];
}

export interface UpdateRoleClaimPayload {
  roleId: number;
  claims: string[];
}

@Injectable({ providedIn: 'root' })
export class RoleClaimService {
  private readonly http = inject(HttpClient);

  getByRoleId(roleId: number): Observable<ApiResponse<RoleClaimResponse>> {
    return this.http.get<ApiResponse<RoleClaimResponse>>(`/RoleClaim/${roleId}`);
  }

  update(payload: UpdateRoleClaimPayload): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>('/RoleClaim/update', payload);
  }
}
