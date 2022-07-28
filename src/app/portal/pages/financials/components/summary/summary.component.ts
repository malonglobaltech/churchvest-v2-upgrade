import { Component, OnInit } from '@angular/core';
import { FinancialsService } from 'src/app/portal/services/financials.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  _loading_: boolean = false;
  ItemDetails: any;
  constructor(private financialService: FinancialsService) {}

  ngOnInit(): void {
    this.getSummary();
  }
  getSummary() {
    this._loading_ = true;
    this.financialService.fetchTransactionSummary().subscribe(
      (res) => {
        this._loading_ = false;
        this.ItemDetails = res;
      },
      () => {
        this._loading_ = false;
      }
    );
  }
}
