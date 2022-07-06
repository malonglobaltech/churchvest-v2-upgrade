import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  reportsItems: any[] = []

  constructor() { }

  ngOnInit(): void {
    this.getReportsItems()
  }

  getReportsItems() {
    return this.reportsItems = [
      {
        title: 'Membership Journal',
        desc: 'Find more insight on regular members, first timers, new converts and much more',
        url: '/portal/reporting/membership-journal',
        icon: 'plus-heart'
      },
      {
        title: 'Financial Journal',
        desc: 'Find all your balance sheet information and more',
        url: '/portal/reporting/financial-journal',
        icon: 'reconciliation'
      },
      {
        title: 'Messages Journal',
        desc: 'Text Messages and Email Messages',
        url: '/portal/reporting/messages-journal',
        icon: 'message-mail'
      },
      {
        title: 'Member Connect',
        desc: 'Web connect and mobile connect report',
        url: '/portal/reporting/member-connect',
        icon: 'message-mail'
      },
      {
        title: 'Login Activity',
        desc: 'User management timeline',
        url: '/portal/reporting/login-activity',
        icon: 'login-svgrepo-com'
      },
    ];
  }

}
