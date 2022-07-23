import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/portal/services/events.service';
import { checkForEventMonth, getMonthList } from 'src/app/shared';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  eventList: any[] = [];
  _loading: boolean = false;
  pageSize: number = 50;
  currentPage = 0;
  _monthList = getMonthList;
  _checkForEventMonth = checkForEventMonth;
  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.getEvent();
  }

  getEventDay(date: string) {
    let dt = new Date(date);

    let res = {
      month: this._monthList()[dt.getMonth()],
      day: dt.getDate(),
    };
    return [res.month, res.day];
  }
  isEventMonth(val: string) {
    let days = this._checkForEventMonth(val);
    if (days == 365) {
      return `Today is event!`;
    } else {
      return `${days} ${days > 1 ? 'days' : 'day'} to event!`;
    }
  }

  getEvent() {
    this._loading = true;
    this.eventList = [];
    this.eventsService.fetchAllEvents(this.currentPage + 1).subscribe(
      (res: any) => {
        this._loading = false;
        const { data } = res;
        this.eventList = data;

        let today = new Date().getDate();
        let currMonth: any = new Date().getMonth() + 1;

        //filter list to get upcoming event
        this.eventList = data.filter(
          (x: any) =>
            (x.start_date.split(/[- :]/)[2] >= today &&
              currMonth == x.start_date.split(/[- :]/)[1]) ||
            (x.start_date.split(/[- :]/)[2] < today &&
              currMonth < x.start_date.split(/[- :]/)[1])
        );
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.eventList = [];
        }
      }
    );
  }
}
