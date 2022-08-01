import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { ReportingService } from 'src/app/portal/services/reporting.service';
import { concatColumnString, printElement, setDateQuery, truncateString } from 'src/app/shared';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-financial-journal',
  templateUrl: './financial-journal.component.html',
  styleUrls: ['./financial-journal.component.scss']
})
export class FinancialJournalComponent implements OnInit {
  incomeList: any[] = [];
  expensesList: any[] = [];
  _loading_: boolean = false;
  _printElement = printElement;
  _setDateQuery = setDateQuery;
  _trancateString = truncateString;
  _query: any;
  _concatColumnString = concatColumnString;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private reportService: ReportingService,
    private exportService: ExportServiceService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.getFinancialJournal();
  }

  gotoBack() {
    this._location.back();
  }

  onPreview(query) {
    this._query = query;
  }

  getFinancialJournal(evt?: any) {
    this._loading_ = true;
    let date = setDateQuery(evt);
    this.reportService.fetchJournal('financial_journal', date).subscribe(
      (res) => {
        this._loading_ = false;
        const { income_data, expenses_data } = res;
        this.incomeList = income_data;
        this.expensesList = expenses_data;
        console.log('this.incomeList', this.incomeList)
        console.log('this.expensesList', this.expensesList)
      },
      (error)=> {
        this._loading_ = false;
        Swal.fire('Server error', error, 'error');
      }
    )
  }

  exportIncomeToExcel() {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'FINANCIAL EXPENDITURE REPORT' }, //title
        {
          A: '#',
          B: 'title',
          C: 'type',
          D: 'account_type',
          E: 'amount',
          F: 'status',
          G: 'date',
          H: 'description',
        }, // table header
      ],
      skipHeader: true,
    };
    this.incomeList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.title,
        C: data.type,
        D: data.account_type,
        E: data.amount,
        F: data.status,
        G: data.date,
        H: data.description,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, 'FINANCIAL INCOME REPORT');
  }

  exportExpensesToExcel() {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'FINANCIAL EXPENDITURE REPORT' }, //title
        {
          A: '#',
          B: 'title',
          C: 'type',
          D: 'account_type',
          E: 'amount',
          F: 'status',
          G: 'date',
          H: 'description',
        }, // table header
      ],
      skipHeader: true,
    };
    this.incomeList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.title,
        C: data.type,
        D: data.account_type,
        E: data.amount,
        F: data.status,
        G: data.date,
        H: data.description,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, 'FINANCIAL EXPENDITURE REPORT');
  }

}
