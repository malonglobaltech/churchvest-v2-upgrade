import { Component, OnInit } from '@angular/core';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  _isOpen: boolean = false;
  openAccordion: boolean = false;
  constructor(private guidedTourService: GuidedTourService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    setTimeout(() => {
      if (!localStorage.getItem('viewed-tour')) {
        this.takeTour();
        this.openAccordion = !this.openAccordion;
        localStorage.setItem('viewed-tour', 'yes');
      }
    }, 2000);
  }
  takeTour(): void {
    this.guidedTourService.startTour(this.activityTour);
  }
  toggleSnap() {
    this._isOpen = !this._isOpen;
  }
  public activityTour: GuidedTour = {
    tourId: 'welcome-tour',
    useOrb: false,
    steps: [
      {
        title: 'Welcome on board 👋',
        content: `Nice to have you here... Take a moment and go through
        the exciting features we have installed for you`,
        orientation: Orientation.Center,
        useHighlightPadding: true,
      },
      {
        title: 'Activity Management 🧑🏿‍🤝‍🧑🏿',
        selector: '.activities-step0',
        content: `See all activities, and statistics from a single view`,
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Members Management 🧑🏿‍🤝‍🧑🏿',
        selector: '.activities-step1',
        content: `Create new members in your church and assign them to different department, and
        create cell meetings, leadership information and more...`,
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Events 📅',
        selector: '.activities-step2',
        content: 'Create scheduled events for your church',
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Departments 🏬',
        selector: '.activities-step3',
        content:
          'Create new department for your church and assign members to them',
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Financial Inclusion 💰',
        selector: '.activities-step4',
        content: 'Try out the finance module and manage your inflows',
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Report Tracking 📝',
        selector: '.activities-step5',
        content:
          'You can customize, and download reports for church leaders at a time so you save time and focus on what really matters, your firm and clients.',
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'Configure Your Settings ⚙️',
        selector: '.activities-step7',
        content: 'Configure all settings here',
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },
      {
        title: 'You’re good to go! 🚀',
        content:
          'You’ve gotten a glimpse of how our features work - remember you can always take this tour whenever you want.',
        orientation: Orientation.Center,
        useHighlightPadding: true,
      },
    ],
  };
  menu = [
    {
      title: 'Activity',
      url: 'activity',
      icon: 'assets/img/svg/activity-icon.svg',
      hasChildren: false,
      hasSelector: true,
    },
    {
      title: 'People',
      url: 'people',
      icon: 'assets/img/svg/people-icon.svg',
      hasChildren: true,
      hasSelector: true,
      children: [
        {
          title: 'Summary',
          url: 'summary',
        },
        {
          title: 'Regular Members',
          url: 'members',
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
      hasSelector: true,
    },
    {
      title: 'Department',
      url: 'department',
      icon: 'assets/img/svg/department-icon.svg',
      hasChildren: false,
      hasSelector: true,
    },
    {
      title: 'Financials',
      url: 'financials',
      icon: 'assets/img/svg/financial-icon.svg',
      hasChildren: true,
      hasSelector: true,
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
          disabled: true,
        },
        {
          title: 'Payroll',
          url: 'payroll',
          disabled: true,
        },
        // {
        //   title: 'Settings',
        //   url: 'settings',
        // },
      ],
    },
    {
      title: 'Reporting',
      url: 'reporting',
      icon: 'assets/img/svg/report-icon.svg',
      hasChildren: false,
      hasSelector: true,
    },
    {
      title: 'More',
      url: 'more',
      icon: 'assets/img/svg/more-icon.svg',
      hasChildren: true,
      hasSelector: false,
      children: [
        {
          title: 'Media',
          url: 'media',
          hasSelector: false,
        },
        {
          title: 'Messages',
          url: 'messages',
          hasSelector: false,
        },
        {
          title: 'Online Giving',
          url: 'online-giving',
          hasSelector: true,
        },
        {
          title: 'Location',
          url: 'location',
          hasSelector: false,
          disabled: true,
        },
        {
          title: 'Group',
          url: 'group',
          hasSelector: false,
        },
        {
          title: 'Member Connect (Web)',
          url: 'member-connect',
          hasSelector: false,
          disabled: true,
        },
        {
          title: 'Live Streaming',
          url: 'live-streaming',
          hasSelector: false,
          disabled: true,
        },
      ],
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'assets/img/svg/settings-icon.svg',
      hasChildren: true,
      hasSelector: true,
      children: [
        {
          title: 'Profile Settings',
          url: 'profile-settings',
        },
        {
          title: 'Online Giving',
          url: 'online-giving',
          hasSelector: true,
        },
        {
          title: 'Module Access',
          url: 'module-access',
        },
      ],
    },
  ];
}
