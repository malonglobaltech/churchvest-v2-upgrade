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
export class DepartmentService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  addDepartment(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments`,
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
        }/${this.authService.getChurchSlug()}/departments/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllDepartment(): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments/trash/departments_trashed?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  fetchDepartmentDetails(id: any, optional?: string): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/departments/${id}`
      )
      .pipe(catchError(handleError));
  }
  fetchDeptFromTrash(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments/trash?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  fetchTrashedDept(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `${this.authService.getChurchSlug()}/departments/trash/${id}`
      )
      .pipe(catchError(handleError));
  }
  getAllDepartment(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any): Observable<any> {
    return this.http.post<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/departments/delete`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateDepartment(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/departments/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
