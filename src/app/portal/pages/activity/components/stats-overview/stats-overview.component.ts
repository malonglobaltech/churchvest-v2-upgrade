import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss'],
})
export class StatsOverviewComponent implements OnInit {
  @ViewChild('scrollItems') scrollItems: any;
  constructor() {}

  ngOnInit(): void {}
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
  activitiesItems = [
    {
      title: 'Regular Members',
      url: '/portal/people/members',
      count: '1',
      icon: 'plus-heart',
    },
    {
      title: 'New Departments',
      url: '',
      count: '0',
      icon: 'square-add',
    },
    {
      title: 'Income',
      url: '',
      count: '0',
      icon: 'income',
    },
    {
      title: 'Expense',
      url: '',
      count: '0',
      icon: 'expense',
    },
    {
      title: 'Reconciled',
      url: '',
      count: '0',
      icon: 'reconciliation',
    },
  ];
}
