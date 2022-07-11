import { Component, OnInit } from '@angular/core';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import Swal from 'sweetalert2';
import { concatColumnString, printElement, setDateQuery, truncateString } from 'src/app/shared';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-messages-journal',
  templateUrl: './messages-journal.component.html',
  styleUrls: ['./messages-journal.component.scss'],
})
export class MessagesJournalComponent implements OnInit {
  emailMessagesList: any[] = [];
  smsMessagesList: any[] = [];
  newConvertList: any[] = [];
  _loading_: boolean = false;
  _printElement = printElement;
  _setDateQuery = setDateQuery;
  _truncateString = truncateString;
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
    this.getMessageJournal();
    this.displayedColumns = this.column;
  }

  column = [
    'from',
    'to',
    'message',
    'status',
    'type',
    'created at',
  ];

  gotoBack() {
    this._location.back();
  }
  onPreview(query) {
    this._query = query;
    console.log('this.dataSource', this.dataSource)
    switch (query) {
      case (query = 'sms_messages'):
        return (this.dataSource = new MatTableDataSource(this.smsMessagesList))
   
      case (query = 'email_messages'):
        return (this.dataSource = new MatTableDataSource(this.emailMessagesList))

      default:
        return;
    }
  }
  getMessageJournal(evt?: any) {
    this._loading_ = true;
    let date = setDateQuery(evt);
    this.reportService.fetchJournal('message_journal', date).subscribe(
      (res) => {
        this._loading_ = false;
        const { message_by_mail, message_by_sms } = res;
        this.emailMessagesList = message_by_mail;
        this.smsMessagesList = message_by_sms;
      },
      (error) => {
        this._loading_ = false;
        Swal.fire('Server error', error, 'error');
        this.emailMessagesList = [];
        this.smsMessagesList = [];
      }
    );
  }

  exportEmailToExcel() {
    const edata: Array<any> = [];

    const udt: any = {
      data: [
        { A: 'MEDIA DATA' }, // title
        {
          A: '#',
          B: 'From',
          C: 'To',
          D: 'Message',
        }, // table header
      ],
      skipHeader: true,
    };
    this.emailMessagesList.forEach((data) => {
      let res = data.to.map((x) => x);
      udt.data.push({
        A: data.id,
        B: data.from,
        C: res.toString(),
        D: data.message,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(
      edata,
      'Email message journal data'
    );
  }

  exportSmsToExcel() {
    const edata: Array<any> = [];

    const udt: any = {
      data: [
        { A: 'MEDIA DATA' }, // title
        {
          A: '#',
          B: 'From',
          C: 'To',
          D: 'Message',
        }, // table header
      ],
      skipHeader: true,
    };
    this.smsMessagesList.forEach((data) => {
      let res = data.to.map((x) => x);
      udt.data.push({
        A: data.id,
        B: data.from,
        C: res.toString(),
        D: data.message,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(
      edata,
      'Email message journal data'
    );
  }
}
