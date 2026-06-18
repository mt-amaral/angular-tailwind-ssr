import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../api-response.model';
import { PagedResponse } from '../paged-response.model';
import { PaginationRequest } from '../pagination-request.model';

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

export interface CreateUserPayload {
  userName: string;
  email: string;
  newPassword?: string;
  confirmPassword?: string;
  roleId: number;
}

export interface UpdateUserPayload {
  userName: string;
  email: string;
  newPassword?: string;
  confirmPassword?: string;
  roleId: number;
}

export interface UpdateUserByIdPayload extends UpdateUserPayload {
  id: number;
}

export interface ListUsersParams extends PaginationRequest {
  searchString?: string;
  roleId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  listUsers(params?: ListUsersParams): Observable<PagedResponse<User[]>> {
    let httpParams = new HttpParams();
    if (params?.currentPage != null) httpParams = httpParams.set('PageNumber', params.currentPage);
    if (params?.pageSize != null) httpParams = httpParams.set('PageSize', params.pageSize);
    if (params?.searchString != null) httpParams = httpParams.set('SearchString', params.searchString);
    if (params?.roleId != null) httpParams = httpParams.set('RoleId', params.roleId);

    return this.http.get<PagedResponse<User[]>>('/User/list-users', { params: httpParams });
  }

  create(payload: CreateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/User/create', payload);
  }

  update(payload: UpdateUserByIdPayload): Observable<ApiResponse<User>> {
    const { id, ...body } = payload;
    const params = new HttpParams().set('UserId', id);
    return this.http.post<ApiResponse<User>>('/User/update', body, { params });
  }

  updateLogged(payload: UpdateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/User/update-logged', payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`/User/delete/${id}`);
  }
}
