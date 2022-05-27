import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  _isOpen: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  toggleSnap() {
    this._isOpen = !this._isOpen;
  }
  menu = [
    {
      title: 'Activity',
      url: 'activity',
      icon: 'assets/img/svg/activity-icon.svg',
      hasChildren: false,
    },
    {
      title: 'People',
      url: 'people',
      icon: 'assets/img/svg/people-icon.svg',
      hasChildren: true,
      children: [
        {
          title: 'Summary',
          url: 'summary',
        },
        {
          title: 'Regular Members',
          url: 'regular-members',
        },
        {
          title: 'House Fellowship',
          url: 'house-fellowship',
        },
        {
          title: 'Evangelism',
          url: 'evangelism',
        },
        {
          title: 'New Convert',
          url: 'new-convert',
        },
        {
          title: 'First-timers',
          url: 'first-timers',
        },
      ],
    },
    {
      title: 'Events',
      url: 'events',
      icon: 'assets/img/svg/events-icon.svg',
      hasChildren: false,
    },
    {
      title: 'Department',
      url: 'department',
      icon: 'assets/img/svg/department-icon.svg',
      hasChildren: false,
    },
    {
      title: 'Financials',
      url: 'financials',
      icon: 'assets/img/svg/financial-icon.svg',
      hasChildren: true,
      children: [
        {
          title: 'Summary',
          url: 'summary',
        },
        {
          title: 'Income',
          url: 'income',
        },
        {
          title: 'Expenses',
          url: 'expenses',
        },
        {
          title: 'Reconciliation',
          url: 'reconciliation',
        },
        {
          title: 'Payroll',
          url: 'payroll',
        },
        {
          title: 'Settings',
          url: 'settings',
        },
      ],
    },
    {
      title: 'Reporting',
      url: 'reporting',
      icon: 'assets/img/svg/report-icon.svg',
      hasChildren: false,
    },
    {
      title: 'More',
      url: 'people',
      icon: 'assets/img/svg/more-icon.svg',
      hasChildren: true,
      children: [
        {
          title: 'Media',
          url: 'media',
        },
        {
          title: 'Messages',
          url: 'messages',
        },
        {
          title: 'Online Giving',
          url: 'online-giving',
        },
        {
          title: 'Location',
          url: 'location',
        },
        {
          title: 'Group',
          url: 'group',
        },
        {
          title: 'Member Connect (Web)',
          url: 'member-connect',
        },
        {
          title: 'Live Streaming',
          url: 'live-streaming',
        },
      ],
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'assets/img/svg/settings-icon.svg',
      hasChildren: true,
      children: [
        {
          title: 'Profile Settings',
          url: 'profile-settings',
        },
        {
          title: 'Online Giving',
          url: 'online-giving',
        },
        {
          title: 'Module Access',
          url: 'module-access',
        },
        {
          title: 'Trash',
          url: 'trash',
        },
      ],
    },
  ];
}
