import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from './apiErrorHandler';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
  ) { }

  subscribeMail(payload): Observable<any> {
    return this.http
      .post<any>(`${environment.managementbaseUrl}/subscribe`, payload)
      .pipe(catchError(handleError))
  }
  postContact(payload): Observable<any> {
    return this.http
      .post<any>(`${environment.managementbaseUrl}/contact`, payload)
      .pipe(catchError(handleError))
  }

}
