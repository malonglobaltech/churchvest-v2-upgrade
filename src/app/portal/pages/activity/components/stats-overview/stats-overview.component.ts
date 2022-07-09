import { Component, OnInit, ViewChild } from '@angular/core';
import { SummaryService } from 'src/app/portal/services/summary.service';

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss'],
})
export class StatsOverviewComponent implements OnInit {
  @ViewChild('scrollItems') scrollItems: any;
  _loading_: boolean = false;
  data: any;
  activitiesItems: any[] = [];
  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.getSummary();
  }
  scrollRight(): void {
    this.scrollItems.nativeElement.scrollTo({
      left: this.scrollItems.nativeElement.scrollLeft + 400,
      behavior: 'smooth',
    });
  }
  scrollLeft(): void {
    this.scrollItems.nativeElement.scrollTo({
      left: this.scrollItems.nativeElement.scrollLeft - 400,
      behavior: 'smooth',
    });
  }

  getSummary() {
    this._loading_ = true;
    this.summaryService.fetchSummary().subscribe(
      (res) => {
        this._loading_ = false;
        const { summary } = res.data;
        this.getActivitySummary(summary);
      },
      () => {
        this._loading_ = false;
      }
    );
  }
  getActivitySummary(summary: any) {
    return (this.activitiesItems = [
      {
        title: 'Regular Members',
        url: '/portal/people/members',
        count: summary.regular_members,
        icon: 'plus-heart',
      },
      {
        title: 'New Departments',
        url: '/portal/department',
        count: summary.departments,
        icon: 'square-add',
      },
      {
        title: 'Events',
        url: '/portal/events',
        count: summary.events,
        icon: 'events-icon',
      },
      {
        title: 'Fellowships',
        url: '/portal/people/house-fellowship',
        count: summary.fellowships,
        icon: 'hand_with_love',
      },
      {
        title: 'Reconciled',
        url: '',
        count: '0',
        icon: 'reconciliation',
      },
    ]);
  }
}
