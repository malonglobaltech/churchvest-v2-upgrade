import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { String } from 'aws-sdk/clients/appstream';
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
  addConvert(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/converts`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  addFirstTimer(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/first_timers`,
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
  addEvangelism(model: any): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/evangelism`,
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
  fetchAll(type: string, pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  fetchByStatus(type: string, optional?: string): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/?status=${optional}`
      )
      .pipe(catchError(handleError));
  }
  fetchDetails(id: any, type: string, optional?: string): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/people/${type}/${id}/${optional}`
      )
      .pipe(catchError(handleError));
  }
  fetchTrashedItem(id: any, type?: string): Observable<any> {
    return this.http
      .get<any>(
        environment.managementbaseUrl +
          `/${this.authService.getChurchSlug()}/people/${type}/trash/${id}`
      )
      .pipe(catchError(handleError));
  }
  fetchAllFromTrash(type: string, pageNumber?: number): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/trash?page=${pageNumber}`
      )
      .pipe(catchError(handleError));
  }
  getSummary(type: string, date?: any): Observable<any> {
    return this.http
      .get<any>(
        `${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/summary/?date=${date}`
      )
      .pipe(catchError(handleError));
  }
  moveToTrash(model: any, type: string): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/delete`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  restore(model: any, type: String): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/${type}/trash/restore`,
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
  updateMember(model: any, type: string): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/${type}`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateEvangelism(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/evangelism/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateConvert(model: any, id: number): Observable<any> {
    return this.http
      .post<any>(
        ` ${
          environment.managementbaseUrl
        }/${this.authService.getChurchSlug()}/people/members/converts/${id}/update`,
        model
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateFirstTimer(model: any): Observable<any> {
    return this.http
      .post<any>(
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
