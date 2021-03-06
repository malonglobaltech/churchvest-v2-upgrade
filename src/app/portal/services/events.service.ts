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
export class EventsService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }
  addEvent(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events`,
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
        }/${this.authService.getChurchSlug()}/events/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllEvents(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events/trash/events?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  fetchAnEvents(id?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events/${id}`
      )
      .pipe(catchError(handleError));
  }
  fetchTrashedEvent(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `${this.authService.getChurchSlug()}/departments/trash/${id}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any): Observable<any> {
    return this.http.post<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/events/delete_event`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateEvent(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/events/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
