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
        console.log('res', res)
      },
      (error)=> {
        this._loading_ = false;
        Swal.fire('Server error', error, 'error');
      }
    )
  }

  exportIncomeToExcel() {
    // 
  }

  exportExpensesToExcel() {
    // 
  }

}
