import { Component, OnInit } from '@angular/core';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import Swal from 'sweetalert2';
import { printElement, setDateQuery } from 'src/app/shared';

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
  _setDateQuery = setDateQuery;
  dateQuery = new Date();

  constructor(
    private reportService: ReportingService,
    private exportService: ExportServiceService,
  ) { }

  ngOnInit(): void {
    this.getMemberShipJournal();
  }

  getMemberShipJournal(evt?:any) {
    this._loading_ = true
    let date = setDateQuery(evt)
    this.reportService
    .fetchMembershipJournal('membership_journal', date).subscribe(
      (res) => {
        this._loading_ = false;
        const { first_timers, regular_members, new_converts } = res;
        this.firstTimersList = first_timers;
        this.newConvertList= new_converts;
        this.regularMemberList = regular_members
      },
      (error) => {
        this._loading_ = false;
            Swal.fire('Server error', error, 'error');
        this.firstTimersList = []
        this.newConvertList = [];
        this.regularMemberList = [];
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

  exportNewConvertsToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'CONVERTS DATA' }, // title
        {
          A: '#',
          B: 'First Name',
          C: 'Last Name',
          D: 'Membership Info',
          E: 'Convert Status',
        }, // table header
      ],
      skipHeader: true,
    };
    this.newConvertList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.first_name,
        C: data.last_name,
        D: data.membership_info,
        E: data.convert_status,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, 'New converts Journal Data')
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
