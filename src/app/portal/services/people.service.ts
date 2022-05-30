import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { IPersonalInfo } from 'src/app/shared/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getChurchSlug();
  }
  //add Personal information
  addPersonalInfo(model: IPersonalInfo): Observable<any> {
    return this.http
      .post<IPersonalInfo>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/personal`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  // Fetch Regular Members
  fetchAllMembers(): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members`
      )
      .pipe(catchError(handleError));
  }
  fetchAllMembersFromTrash(): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/trash`
      )
      .pipe(catchError(handleError));
  }
  updateProfileImage(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/membership`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  moveToTrash(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  deleteMember(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  restoreMember(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/trash/restore`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  searchMember(params: string): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/search?query=${params}`
      )
      .pipe(catchError(handleError));
  }
}
