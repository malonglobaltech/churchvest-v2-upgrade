import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import Swal from 'sweetalert2';
import { concatColumnString, printElement, setDateQuery } from 'src/app/shared';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-membership-journal',
  templateUrl: './membership-journal.component.html',
  styleUrls: ['./membership-journal.component.scss'],
})
export class MembershipJournalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 50;
  currentPage = 0;
  firstTimersList: any[] = [];
  regularMemberList: any[] = [];
  newConvertList: any[] = [];
  _loading_: boolean = false;
  _printElement = printElement;
  _setDateQuery = setDateQuery;
  dateQuery = new Date();
  _query: any;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private reportService: ReportingService,
    private exportService: ExportServiceService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getMemberShipJournal();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  column = ['first name', 'last name', 'role', 'phone', 'email'];
  gotoBack() {
    this._location.back();
  }
  onPreview(query) {
    this._query = query;
    switch (query) {
      case (query = 'reg_members'):
        return (this.dataSource = new MatTableDataSource(
          this.regularMemberList
        ));
      case (query = 'first-timer'):
        return (this.dataSource = new MatTableDataSource(this.firstTimersList));
      case (query = 'new-convert'):
        console.log(this.newConvertList);
        return (this.dataSource = new MatTableDataSource(this.newConvertList));
      default:
        return;
    }
  }
  getMemberShipJournal(evt?: any) {
    this._loading_ = true;
    let date = setDateQuery(evt);
    this.reportService
      .fetchMembershipJournal('membership_journal', date)
      .subscribe(
        (res) => {
          this._loading_ = false;
          const { first_timers, regular_members, new_converts } = res;
          this.firstTimersList = first_timers;
          this.newConvertList = new_converts;
          this.regularMemberList = regular_members;
        },
        (error) => {
          this._loading_ = false;
          Swal.fire('Server error', error, 'error');
          this.firstTimersList = [];
          this.newConvertList = [];
          this.regularMemberList = [];
        }
      );
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
    this.exportService.exportTableElmToExcel(edata, 'First Timer data');
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
    this.exportService.exportTableElmToExcel(
      edata,
      'New converts Journal Data'
    );
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
    this.exportService.exportTableElmToExcel(
      edata,
      'Regular members Journal Data'
    );
  }
}
