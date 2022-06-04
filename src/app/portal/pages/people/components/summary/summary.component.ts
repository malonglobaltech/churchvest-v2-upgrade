import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/portal/services/people.service';
import {
  checkForBirthdayMonth,
  getMonthList,
  setDateQuery,
  truncateString,
} from 'src/app/shared/_helperFunctions';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  _loading: boolean = false;
  isBirthDate: boolean;
  convertSummary: any;
  evangelismSummary: any;
  fellowshipSummary: any;
  firstTimerSummary: any;
  memberSummary: any;
  listItem: any;

  _checkForBirthMonth = checkForBirthdayMonth;
  _setDateQuery = setDateQuery;
  _truncateString = truncateString;
  _monthList = getMonthList;
  constructor(
    private peopleService: PeopleService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchSummaryByParams(1);
    this.fetchSummaryByParams(2);
    this.fetchSummaryByParams(3);
    this.fetchSummaryByParams(4);
    this.fetchSummaryByParams(5);
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  getBirthDay(date: string) {
    let dt = new Date(date);
    let res = {
      month: this._monthList()[dt.getMonth()],
      day: dt.getDate(),
    };
    return [res.month, res.day];
  }

  isBirthdayMonth(val: string) {
    let days = this._checkForBirthMonth(val);
    if (days == 0) {
      return `Today is your birthday!`;
    } else {
      return `${days} ${days > 1 ? 'days' : 'day'} to birthday!`;
    }
  }

  fetchSummaryByParams(service: number, query?: string) {
    this._loading = true;
    let date = this._setDateQuery(query);
    switch (service) {
      case (service = 1):
        return this.peopleService.getSummary('members', date).subscribe(
          (res) => {
            this._loading = false;
            const { data } = res;
            this.memberSummary = data;
          },
          (error) => {
            this._loading = false;
            Swal.fire('Server error', error, 'error');
          }
        );
      case (service = 2):
        return this.peopleService.getSummary('fellowships', date).subscribe(
          (res) => {
            this._loading = false;
            const { data } = res;
            this.fellowshipSummary = data;
          },
          (error) => {
            this._loading = false;
            Swal.fire('Server error', error, 'error');
          }
        );
      case (service = 3):
        return this.peopleService.getSummary('evangelism', date).subscribe(
          (res) => {
            this._loading = false;
            const { data } = res;
            this.evangelismSummary = data;
          },
          (error) => {
            this._loading = false;
            Swal.fire('Server error', error, 'error');
          }
        );
      case (service = 4):
        return this.peopleService
          .getSummary('members/converts', date)
          .subscribe(
            (res) => {
              this._loading = false;
              const { data } = res;
              this.convertSummary = data;
            },
            (error) => {
              this._loading = false;
              Swal.fire('Server error', error, 'error');
            }
          );
      case (service = 5):
        return this.peopleService
          .getSummary('members/first_timers', date)
          .subscribe(
            (res) => {
              this._loading = false;
              const { data } = res;
              this.firstTimerSummary = data;
            },
            (error) => {
              this._loading = false;
              Swal.fire('Server error', error, 'error');
            }
          );
      default:
        return null;
    }
  }
  getListItem(item: any) {
    this.listItem = item;
  }
  onSummaryChange(evt: any, serviceType?: number) {
    if (evt !== '' && evt !== undefined && serviceType) {
      switch (serviceType) {
        case (serviceType = 1):
          return this.fetchSummaryByParams(1, evt);
        case (serviceType = 2):
          this.fetchSummaryByParams(2, evt);
        case (serviceType = 3):
          this.fetchSummaryByParams(3, evt);
        case (serviceType = 4):
          this.fetchSummaryByParams(4, evt);
        case (serviceType = 5):
          this.fetchSummaryByParams(5, evt);
        default:
          return null;
      }
    }
  }
}
