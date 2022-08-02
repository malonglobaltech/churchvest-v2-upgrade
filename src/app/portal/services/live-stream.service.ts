import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }

  createUpdateStreamKey(data): Observable<any> {
    return this.http
      .post<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/livestream/streamkey`,
          data
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
