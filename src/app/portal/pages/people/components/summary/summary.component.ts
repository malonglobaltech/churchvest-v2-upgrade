import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/portal/services/people.service';
import {
  getDayList,
  getMonthList,
  truncateString,
} from 'src/app/shared/_helperFunctions';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  _loading: boolean = false;
  memberSummary: any;
  convertSummary: any;
  firstTimerSummary: any;
  isBirthDate: boolean;
  _truncateString = truncateString;
  _dayList = getDayList;
  _monthList = getMonthList;
  constructor(
    private peopleService: PeopleService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchMemberSummary();
    this.fetchConversSummary();
    this.fetchFirstTimerSummary();
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  getBirthDay(date) {
    let dt = new Date(date);
    let res = {
      month: this._monthList()[dt.getMonth()],
      day: dt.getDate(),
    };
    return [res.month, res.day];
  }

  isBirthdayMonth(val) {
    const parts = val.split(/[- :]/);
    var month = parts[1];
    var day = parts[2];
    var today, bday, diff, days;
    today = new Date();
    bday = new Date(today.getFullYear(), month - 1, day);
    if (today.getTime() > bday.getTime()) {
      bday.setFullYear(bday.getFullYear() + 1);
    }

    diff = bday.getTime() - today.getTime();
    days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    if (days == 0) {
      return `Today is your birthday!`;
    } else {
      return `${days} ${days > 1 ? 'days' : 'day'} to birthday!`;
    }
  }
  fetchMemberSummary() {
    this._loading = true;
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);
    this.peopleService.getMembersSummary(date).subscribe((res) => {
      this._loading = false;
      const { data } = res;
      this.memberSummary = data;
    });
  }
  fetchConversSummary() {
    this._loading = true;
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);
    this.peopleService.getConvertsSummary(date).subscribe((res) => {
      this._loading = false;
      const { data } = res;
      this.convertSummary = data;
    });
  }
  fetchFirstTimerSummary() {
    this._loading = true;
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);
    this.peopleService.getFirstTimerSummary(date).subscribe((res) => {
      this._loading = false;
      const { data } = res;
      this.firstTimerSummary = data;
    });
  }
}
