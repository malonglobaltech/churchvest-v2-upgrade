import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.authService.getChurchSlug();
  }

  fetchMembershipJournal(type: any, date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/reporting/${type}/?date=${date}`
      )
      .pipe(catchError(handleError));
  }

  fetchJournal(type: any, date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/reporting/${type}/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
}
