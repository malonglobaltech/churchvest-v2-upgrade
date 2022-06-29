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
export class MessagesService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }
  deleteFromTrash(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  deleteMessage(id: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/${id}/delete`,
        null
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllMessages(type?: string, page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/${type}?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/trash/messages_trashed?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchMesaageDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/messages/${id}`
      )
      .pipe(catchError(handleError));
  }

  moveToTrash(model: any): Observable<any> {
    return this.http.get<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/messages/delete`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  sendMessage(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
