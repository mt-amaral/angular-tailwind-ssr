import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../api-response.model';
import { PagedResponse } from '../paged-response.model';
import { PaginationRequest } from '../pagination-request.model';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface RoleList {
  id: number;
  name: string;
  description: string;
  countUser: number;
}

export interface CreateRolePayload {
  name: string;
  description: string;
}

export interface UpdateRolePayload {
  id: number;
  name: string;
  description: string;
}

export interface ListRolesParams extends PaginationRequest {
  searchString?: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);

  listRoles(params?: ListRolesParams): Observable<PagedResponse<RoleList[]>> {
    const httpParams = new HttpParams()
      .set('SearchString', params?.searchString ?? '')
      .set('PageNumber', params?.currentPage ?? 1)
      .set('PageSize', params?.pageSize ?? 10);

    return this.http.get<PagedResponse<RoleList[]>>('/Role/list-roles', { params: httpParams });
  }

  listAllRoles(): Observable<ApiResponse<RoleList[]>> {
    return this.http.get<ApiResponse<RoleList[]>>('/Role/list-all-roles');
  }

  create(payload: CreateRolePayload): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>('/Role/create', payload);
  }

  update(payload: UpdateRolePayload): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>('/Role/update', payload);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`/Role/delete/${id}`);
  }
}
