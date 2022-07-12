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
export class FinancialsService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  addTransaction(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  deleteTransaction(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchTransactionsByType(type?: string, page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions?type=${type}?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchTransactionsByAccount(
    accId?: string,
    accType?: string,
    page?: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions?account_id=${accId}&account_type=${accType} ?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchTransactionsByDate(
    accId?: string,
    accType?: string,
    start_date?: string,
    end_date?: string,
    page?: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.managementbaseUrl}/${this.authService.getChurchSlug()}
        /transactions?account_id=${accId}&account_type=${accType}&start_date=${start_date}&end_date=${end_date}?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  mergeTransaction(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/merge`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateTransaction(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
