import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  viewSomeFeature;
  allFeaturesList;
  allFeatures: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.viewSomeFeature = [
      {
        icon: 'fas fa-user-plus',
        title: 'Member Management',
        description: 'Manage your members effectively, Add members in bulk instantly.',
      },
      {
        icon: 'fas fa-user-tie',
        title: 'First-timers Management',
        description: 'Add first timers and assign a follow up to track them effectively.',
      },
      {
        icon: 'fas fa-building',
        title: 'Department Management',
        description: 'Create and manage various departments in your church at once.',
      },
    ];
    
    this.allFeaturesList = [
      {
        icon: 'fas fa-user-plus',
        title: 'Member Management',
        description: 'Manage your members effectively, Add members in bulk instantly.',
      },
      {
        icon: 'fas fa-user-tie',
        title: 'First-timers Management',
        description: 'Add first timers and assign a follow up to track them effectively.',
      },
      {
        icon: 'fas fa-building',
        title: 'Department Management',
        description: 'Create and manage various departments in your church at once.',
      },
      {
        icon: 'fas fa-calendar-alt',
        title: 'Event Planning',
        description: 'Create, manage and track events seamlessly.',
      },
      {
        icon: 'fas fa-calculator',
        title: 'Financial Tracking',
        description: 'Track all transactions/ payments made all at once.',
      },
      {
        icon: 'fas fa-file-csv',
        title: 'Report Generation',
        description: 'Get Report on all activities undergone in your Church.',
      },
      {
        icon: 'fas fa-globe',
        title: 'Customized Website',
        description: 'Get a modern and beautiful website that suits your Church preferences.',
      },
      {
        icon: 'fas fa-mobile',
        title: 'Customized Mobile App',
        description: 'Get an application fully featured for both your members and role leaders.',
      },
      {
        image: 'assets/img/png/collaborate.png',
        title: 'Collaborate with Others',
        description: 'Add, invite and work with other role leaders in one space.',
      },
      {
        icon: 'fas  fa-code-branch',
        title: 'Multi-branch Management',
        description: 'Create and manage various branches, linked to the Mother Church.',
      },
      {
        icon: 'fas fa-users',
        title: 'Groups Management',
        description: 'Create and manage various groups in the church, and tag members.',
      },
      {
        image: 'assets/img/png/sms.png',
        title: 'Bulk Messaging',
        description: 'In app messaging feature. Send messages to all members at a go.',
      },
      {
        icon: 'fas fa-envelope',
        title: 'Email Support',
        description: 'Provide quick response to assist you in carrying out all features effectively.',
      },
      {
        image: 'assets/img/png/phone.png',
        title: 'Phone Support',
        description: 'Provide great help all round so as to make your Church Management easy.',
      },
      {
        image: 'assets/img/png/cross.png',
        title: 'Evangelism',
        description: 'Add members to your team and keep track of the number of members.',
      },
    ];
    
  }

  toggleAllFeatures() {
    this.allFeatures = !this.allFeatures
  }


}
