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
export class SmsService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  topSmsUnit(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/messages/sms/buy_units`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }

  fetchSmsBalance(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/messages/get_sms_balance`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
