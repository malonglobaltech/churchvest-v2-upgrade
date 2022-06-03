import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { AuthService } from 'src/app/services/auth.service';
import { IFellowship, IPersonalInfo } from 'src/app/shared/model';
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
  addFellowship(model: IFellowship): Observable<any> {
    return this.http
      .post<IFellowship>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  assignMemberRole(model: any, id?: number): Observable<any> {
    return this.http
      .post<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/${id}/role`,
        model
      )
      .pipe(catchError(handleError));
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
  deleteFromTrash(model: any, type: string): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  deleteFellowship(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/trash/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  fetchAllMembers(pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFellowships(pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  fetchMemberDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/people/members/member/${id}`
      )
      .pipe(catchError(handleError));
  }
  fetchFellowshipDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/people/fellowships/${id}/show`
      )
      .pipe(catchError(handleError));
  }
  fetchTrashedMember(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/people/members/trash/${id}`
      )
      .pipe(catchError(handleError));
  }

  fetchAllMembersFromTrash(
    pageNumber?: number,
    pageSize?: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/trash/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFellowshipFromTrash(
    pageNumber?: number,
    pageSize?: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/trash/?page=${pageNumber}&size=${pageSize}`
      )
      .pipe(catchError(handleError));
  }
  getFellowshipSummary(date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
  getEvangelismSummary(date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/evangelism/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
  getMembersSummary(date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
  getConvertsSummary(date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/converts/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
  getFirstTimerSummary(date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/first_timers/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
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
  moveFellowshipToTrash(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/delete`,
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
  restoreFellowship(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowship/trash/restore`,
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
  updateMemberServiceInfo(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/service`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateMemberOtherInfo(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/other`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateFellowship(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/fellowships/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
