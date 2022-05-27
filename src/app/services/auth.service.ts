import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAuth } from '../shared/model';
import { handleError } from './apiErrorHandler';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: any;
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}
  getUserData() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (user) {
      return user;
    }
  }
  isAuthenticated(): any {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  login(credentials: IAuth): Observable<any> {
    return this.http
      .post<any>(environment.managementbaseUrl + `/login`, credentials)
      .pipe(catchError(handleError));
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_church');
    localStorage.removeItem('viewed-tour');
    localStorage.removeItem('user_details');
    return false;
  }
  register(credentials: any): Observable<any> {
    return this.http
      .post<any>(environment.managementbaseUrl + `/register`, credentials)
      .pipe(catchError(handleError));
  }
  resolveUser(payload: any): Observable<any> {
    return this.http
      .post<any>(environment.managementbaseUrl + `/resolve_user`, payload)
      .pipe(catchError(handleError));
  }
  resendVerificationEmail(): Observable<any> {
    let token = localStorage.getItem('token');
    return this.http
      .post<any>(
        `${environment.managementbaseUrl}/email/verification-notification`,
        token
      )
      .pipe(catchError(handleError));
  }
  resetEmail(email: any): Observable<any> {
    return this.http
      .post<any>(`${environment.mainUrl}/forgot-password`, email)
      .pipe(catchError(handleError));
  }
  resetPassword(payload: any): Observable<any> {
    return this.http
      .post<any>(`${environment.mainUrl}/reset-password`, payload)
      .pipe(catchError(handleError));
  }

  verify(link: string): Observable<any> {
    return this.http.get<any>(link).pipe(catchError(handleError));
  }
}
