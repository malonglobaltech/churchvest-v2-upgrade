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
        icon: 'person_add_alt_1',
        title: 'Member Management',
        description: 'Manage your members effectively, Add members in bulk instantly.',
      },
      {
        icon: 'person_3',
        title: 'First-timers Management',
        description: 'Add first timers and assign a follow up to track them effectively.',
      },
      {
        icon: 'apartment',
        title: 'Department Management',
        description: 'Create and manage various departments in your church at once.',
      },
    ];
    
    this.allFeaturesList = [
      {
        icon: 'person_add_alt_1',
        title: 'Member Management',
        description: 'Manage your members effectively, Add members in bulk instantly.',
      },
      {
        icon: 'person_3',
        title: 'First-timers Management',
        description: 'Add first timers and assign a follow up to track them effectively.',
      },
      {
        icon: 'apartment',
        title: 'Department Management',
        description: 'Create and manage various departments in your church at once.',
      },
      {
        icon: 'calendar_month',
        title: 'Event Planning',
        description: 'Create, manage and track events seamlessly.',
      },
      {
        icon: 'calculate',
        title: 'Financial Tracking',
        description: 'Track all transactions/ payments made all at once.',
      },
      {
        icon: 'summarize',
        title: 'Report Generation',
        description: 'Get Report on all activities undergone in your Church.',
      },
      {
        icon: 'language',
        title: 'Customized Website',
        description: 'Get a modern and beautiful website that suits your Church preferences.',
      },
      {
        icon: 'phone_iphone',
        title: 'Customized Mobile App',
        description: 'Get an application fully featured for both your members and role leaders.',
      },
      {
        image: 'assets/img/png/collaborate.png',
        title: 'Collaborate with Others',
        description: 'Add, invite and work with other role leaders in one space.',
      },
      {
        icon: 'merge',
        title: 'Multi-branch Management',
        description: 'Create and manage various branches, linked to the Mother Church.',
      },
      {
        icon: 'groups_2',
        title: 'Groups Management',
        description: 'Create and manage various groups in the church, and tag members.',
      },
      {
        image: 'assets/img/png/sms.png',
        title: 'Bulk Messaging',
        description: 'In app messaging feature. Send messages to all members at a go.',
      },
      {
        icon: 'email',
        title: 'Email Support',
        description: 'Provide quick response to assist you in carrying out all features effectively.',
      },
      {
        icon: 'support_agent',
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
