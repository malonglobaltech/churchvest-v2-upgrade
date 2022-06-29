import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  addGroup(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  deleteFromTrash(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllGroups(page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments/trash/departments_trashed/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  fetchGroupDetails(id: any, optional?: string): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/groups/${id}`
      )
      .pipe(catchError(handleError));
  }
  fetchGroupFromTrash(pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups/trash/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  fetchTrashedDept(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/departments/trash/${id}`
      )
      .pipe(catchError(handleError));
  }
  getAllGroups(pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any): Observable<any> {
    return this.http.post<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/groups/delete`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateGroup(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/groups/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
