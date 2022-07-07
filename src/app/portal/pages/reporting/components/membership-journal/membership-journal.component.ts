import { Component, OnInit } from '@angular/core';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import { printElement } from 'src/app/shared';

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
  _printElement = printElement;

  constructor(
    private reportService: ReportingService,
    private exportService: ExportServiceService,
  ) { }

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
  exportFirstTimersToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'FIRST TIMERS DATA' }, //title
        {
          A: '#',
          B: 'First Name',
          C: 'Last Name',
          D: 'Phone Number',
          E: 'Membership Information',
          F: 'Convert Status',
        }, // table header
      ],
      skipHeader: true,
    };
    this.firstTimersList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.first_name,
        C: data.last_name,
        D: data.phone,
        E: data.membership_info,
        F: data.convert_status,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, 'First Timer data')
  }

  exportRegularMembersToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'REGULAR MEMBERS JOURNAL DATA' }, // title
        {
          A: '#',
          B: 'First Name',
          C: 'Last Name',
          D: 'Phone',
          E: 'Email',
        }, // table header
      ],
      skipHeader: true,
    };
    this.regularMemberList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.user.first_name,
        C: data.user.last_name,
        D: data.user.phone,
        E: data.user.email,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, 'Regular members Journal Data')
  }

}
