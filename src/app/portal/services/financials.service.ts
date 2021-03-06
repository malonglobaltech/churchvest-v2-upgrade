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
  addReconciliation(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/reconciliations`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  createFinancialAccount(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/accounts/financial`,
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
  deleteFromTrash(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transanctions/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchTransactionDetails(id?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/${id}/show`
      )
      .pipe(catchError(handleError));
  }
  fetchFinancialAccounts(): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/accounts/financial`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/trash?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any): Observable<any> {
    return this.http.post<any>(
      `${
        environment.managementbaseUrl
      }/${this.authService.getChurchSlug()}/transactions/delete`,
      model
    );
  }
  restore(model: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchReconciliation(
    accid?: number,
    type?: string,
    page?: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/reconciliations?account_id=${accid}?account_type=${type}?page=${page}`
      )
      .pipe(catchError(handleError));
  }
  fetchTransactionsByType(type?: string, page?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions?type=${type}`
      )
      .pipe(catchError(handleError));
  }
  fetchTransactionsByAccount(
    accId?: string,
    accType?: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions?account_id=${accId}&account_type=${accType}`
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
  fetchTransactionSummary(): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/transactions/financial_summary`
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
