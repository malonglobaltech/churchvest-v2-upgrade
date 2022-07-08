import { Component, OnInit } from '@angular/core';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import Swal from 'sweetalert2';
import { printElement, setDateQuery } from 'src/app/shared';

@Component({
  selector: 'app-messages-journal',
  templateUrl: './messages-journal.component.html',
  styleUrls: ['./messages-journal.component.scss']
})
export class MessagesJournalComponent implements OnInit {
  emailMessagesList: any[] = [];
  smsMessagesList: any[] = [];
  newConvertList: any[] = [];
  _loading_: boolean = false;
  _printElement = printElement;
  _setDateQuery = setDateQuery;

  constructor(
    private reportService: ReportingService,
    private exportService: ExportServiceService,
  ) { }

  ngOnInit(): void {
    this.getMessageJournal();
  }

  getMessageJournal(evt?:any) {
    this._loading_ = true
    let date = setDateQuery(evt)
    this.reportService
    .fetchJournal('message_journal', date).subscribe(
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
    )
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
    this.exportService.exportTableElmToExcel(edata, 'Email message journal data');
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
    this.exportService.exportTableElmToExcel(edata, 'Email message journal data');
  }


}
