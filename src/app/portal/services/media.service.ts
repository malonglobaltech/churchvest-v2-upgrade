import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  downloadMedia(id?: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/${id}/download`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        },
        { responseType: 'blob' }
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
        }/${this.authService.getChurchSlug()}/media/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllMedia(page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/all?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  queryMediaWithType(type?: string, page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/${type}?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/trash/trashed_media?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchMediaDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/media/${id}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any): Observable<any> {
    return this.http.post<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/media/delete`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateMedia(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  uploadMedia(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/media`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
