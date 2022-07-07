import { Component, OnInit } from '@angular/core';
import { bool } from 'aws-sdk/clients/signer';
import { ReportingService } from 'src/app/portal/services/reporting.service';

@Component({
  selector: 'app-membership-journal',
  templateUrl: './membership-journal.component.html',
  styleUrls: ['./membership-journal.component.scss']
})
export class MembershipJournalComponent implements OnInit {
  firstTimersList: any[] = [];
  regularMemberList: any[] = [];
  newConvertList: any[] = [];
  _loading_: boolean = false;

  constructor(private reportService: ReportingService) { }

  ngOnInit(): void {
    this.getMemberShipJournal()
  }

  getMemberShipJournal() {
    this._loading_ = true
    this.reportService
    .fetchMembershipJournal('membership_journal').subscribe(
      (res) => {
        this._loading_ = false;
        const { first_timers, members, new_converts } = res;
        console.log('res', res)
        this.firstTimersList = first_timers;
        this.newConvertList= new_converts;
        this.regularMemberList = members
      }
    )
  }

}
