import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { FinancialsService } from 'src/app/portal/services/financials.service';
import { GivingService } from 'src/app/portal/services/giving.service';
import { concatColumnString, printElement } from 'src/app/shared';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  itemList: any[] = [];
  trashList: any[] = [];
  accountList: any[] = [];
  isBusy: boolean = false;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'giving_data';
  filterValue: string;
  memberId: number;
  selectedItem: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  pageSize: number = 50;
  currentPage = 0;
  itemDetails: any;
  payload: any[] = [];
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public addIncomeForm: FormGroup = new FormGroup({});
  constructor(
    private financialService: FinancialsService,
    private exportService: ExportServiceService,
    private givingService: GivingService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addIncomeForm = this.fb.group({
      title: [null, Validators.required],
      type: [null],
      account_id: [null, Validators.required],
      date: [null],
      amount: [null],
      description: [null],
    });
  }

  ngOnInit(): void {
    this.queryAccount();
    this.getAccounts();
    this.displayedColumns = this.column;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['title', 'type', 'account type', 'action'];
  get incomeRawValue(): any {
    return this.addIncomeForm.getRawValue();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  queryAccount() {
    this._loading = true;
    this.itemList = [];
    this.financialService
      .fetchTransactionsByType('income', this.currentPage + 1)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.itemList = data;
          this.dataSource = new MatTableDataSource(this.itemList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.itemList.length;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.itemList = [];
          }
        }
      );
  }

  getselectedItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedItem = filter;
  }
  getAccounts() {
    this._loading_ = true;
    this.givingService.fetchAccounts().subscribe(
      (res) => {
        this._loading_ = false;
        const { data } = res;
        this.accountList = data;
      },
      () => {
        this._loading_ = false;
      }
    );
  }
  onSubmit() {
    this.isBusy = true;

    if (this.addIncomeForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.addIncomeForm.valid) {
      //Make api call here...
      this.financialService.addTransaction(this.incomeRawValue).subscribe(
        ({ message, data }) => {
          this.addIncomeForm.reset();
          this.isBusy = false;
          this.closebtn._elementRef.nativeElement.click();
          this.queryAccount();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.addIncomeForm.reset();
        }
      );
    }
  }

  // getDetails(id: any) {
  //   this._loading_ = true;
  //   this.memberId = id;
  //   if (this.memberId !== undefined) {
  //     this.givingService.fetchGiving(id).subscribe(
  //       (res) => {
  //         this._loading_ = false;
  //         const { data } = res;
  //         this.itemDetails = data;
  //       },
  //       (msg) => {
  //         this._loading_ = false;
  //       }
  //     );
  //   }
  // }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.queryAccount();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        transactions_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        transactions_id: this.selectedItem,
      };
    }
    this.givingService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      // this.router.navigate(['/portal/online-giving/trash']);
      this.closebtn._elementRef.nativeElement.click();
      this.queryAccount();
    });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'Income' }, // title
        {
          A: '#',
          B: 'Title',
          C: 'Type',
          D: 'Account Type',
          E: 'Amount Received',
        }, // table header
      ],
      skipHeader: true,
    };
    this.itemList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.title,
        C: data.type,
        D: data.account_type,
        E: data.amount,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
