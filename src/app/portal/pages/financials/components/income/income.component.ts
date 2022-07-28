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
import {
  compareObjects,
  concatColumnString,
  maxLengthCheck,
  printElement,
  truncateString,
} from 'src/app/shared';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close: any;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('closebtn__') closebtn__: any;
  @ViewChild('_closebtn') _closebtn: any;
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
  bankList: any[] = [];
  bankObj: any;
  accountName: string = '';
  _status: string = '';
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  _truncateString = truncateString;
  compareFunc = compareObjects;
  _maxLengthCheck = maxLengthCheck;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public addIncomeForm: FormGroup = new FormGroup({});
  public editIncomeForm: FormGroup = new FormGroup({});
  public newAccountForm: FormGroup = new FormGroup({});
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
      type: ['income'],
      account_id: [null, Validators.required],
      account_type: [null],
      date: [null],
      amount: [null],
      description: [null],
    });
    this.newAccountForm = this.fb.group({
      title: [null, Validators.required],
      bank_code: [null],
      number: [null, Validators.required],
      bank_slug: [null, Validators.required],
      name: new FormControl({ value: null, disabled: true }),
    });
  }

  ngOnInit(): void {
    this.queryAccount();
    this.getAccounts();
    this.getBanks();
    this.displayedColumns = this.column;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['title', 'type', 'amount', 'account type', 'status', 'action'];
  accountTypeList = ['giving'];
  get incomeRawValue(): any {
    return this.addIncomeForm.getRawValue();
  }
  get accountFormValue(): any {
    return this.newAccountForm.getRawValue();
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
  handleBankChange(evt: any) {
    this.bankObj = evt.value;
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  setTransactionStatus(val: string) {
    this._status = val;
  }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  getBanks() {
    this.bankList = [];
    this.givingService.fetchBanks().subscribe(
      (res: any) => {
        const { data } = res;
        this.bankList = data;
      },
      (errors) => {
        if (errors) {
          this.bankList = [];
        }
      }
    );
  }
  blurHandler() {
    let payload: any;
    if (this.bankObj) {
      payload = {
        bank_code: this.bankObj.code,
        number: this.newAccountForm.get('number').value,
      };

      this.givingService.resolveAccount(payload).subscribe(
        (res: any) => {
          const { data, message } = res;
          this.accountName = data;
          this.newAccountForm.controls['name'].setValue(data.account_name);
          this.toastr.info(message, 'Message', {
            timeOut: 3000,
          });
        },
        (errors) => {
          this.toastr.error(
            'Could not resolve account name. Check parameters or try again.',
            'Message',
            {
              timeOut: 3000,
            }
          );
        }
      );
    }
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
  addAccount() {
    this.isBusy = true;
    this.newAccountForm.patchValue({
      bank_code: this.bankObj.code,
      bank_slug: this.bankObj.slug,
    });
    if (this.newAccountForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.newAccountForm.valid) {
      //Make api call here...
      this.givingService.createAccount(this.accountFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message', {
            timeOut: 1000,
          });
          this.newAccountForm.reset();
          this.isBusy = false;
          this.close._elementRef.nativeElement.click();
          this.getAccounts();
        },
        (error) => {
          this.isBusy = false;
          error.split(',').map((x: any) => {
            this.toastr.error(x, 'Message', {
              timeOut: 5000,
            });
          });
        },
        () => {
          this.isBusy = false;
          this.newAccountForm.reset();
        }
      );
    }
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
          this.toastr.success(message, 'Message', {
            timeOut: 1000,
          });
          this.addIncomeForm.reset();
          this.isBusy = false;
          this.closebtn._elementRef.nativeElement.click();
          this.queryAccount();
        },
        (error) => {
          this.isBusy = false;
          error.split(',').map((x: any) => {
            this.toastr.error(x, 'Message', {
              timeOut: 1000,
            });
          });
        },
        () => {
          this.isBusy = false;
          this.addIncomeForm.reset();
        }
      );
    }
  }

  onUpdate() {
    this.isBusy = true;

    if (this.editIncomeForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.editIncomeForm.valid) {
      //Make api call here...
      this.financialService
        .updateTransaction(
          this.editIncomeForm.getRawValue(),
          this.itemDetails.id
        )
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message', {
              timeOut: 1000,
            });
            this.editIncomeForm.reset();
            this.isBusy = false;
            this.closebtn__._elementRef.nativeElement.click();
            this.queryAccount();
          },
          (error) => {
            this.isBusy = false;
            error.split(',').map((x: any) => {
              this.toastr.error(x, 'Message', {
                timeOut: 1000,
              });
            });
          },
          () => {
            this.isBusy = false;
            this.editIncomeForm.reset();
          }
        );
    }
  }

  getDetails(id: any) {
    this._loading_ = true;
    if (id !== undefined) {
      this.financialService.fetchTransactionDetails(id).subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data;
          this.setFormControlElement();
        },
        (msg) => {
          this._loading_ = false;
        }
      );
    }
  }
  setFormControlElement() {
    this.editIncomeForm = this.fb.group({
      title: [this.itemDetails?.title, Validators.required],
      type: ['income'],
      account_id: [this.itemDetails?.account?.id],
      account_type: [this.itemDetails?.account_type],
      date: [this.itemDetails?.date],
      amount: [Math.round(this.itemDetails?.amount)],
      description: [this.itemDetails?.description],
    });
  }
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
    this.financialService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.router.navigate(['/portal/financials/trash']);
      this.closebtn_._elementRef.nativeElement.click();
      this.queryAccount();
    });
  }
  confirmValidation() {
    this.isBusy = true;
    let payload: any;
    payload = {
      status: this._status,
    };

    this.financialService
      .updateTransaction(payload, this.itemDetails.id)
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this._closebtn._elementRef.nativeElement.click();
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
          D: 'Amount',
          E: 'Account Type',
          F: 'Status',
        }, // table header
      ],
      skipHeader: true,
    };
    this.itemList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.title,
        C: data.type,
        D: data.amount,
        E: data.account_type,
        F: data.status,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
