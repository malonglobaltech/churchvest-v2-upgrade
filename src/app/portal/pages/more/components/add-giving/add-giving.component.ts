import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  compareObjects,
  formatDate,
  getCompletedStatus,
  getDays,
  maxLengthCheck,
  truncateString,
} from 'src/app/shared/_helperFunctions';
import { PeopleService } from 'src/app/portal/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { ObservableInput, throwError } from 'rxjs';
import { GivingService } from 'src/app/portal/services/giving.service';

@Component({
  selector: 'app-add-giving',
  templateUrl: './add-giving.component.html',
  styleUrls: ['./add-giving.component.scss'],
})
export class AddGivingComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  queryString: string;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  itemDetails: any;
  accountList: any[] = [];
  bankList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  _loading_: boolean = false;
  accountName: string = '';
  bankObj: any;
  _id: any;

  compareFunc = compareObjects;
  _maxLengthCheck = maxLengthCheck;
  _truncateString = truncateString;
  public givingForm: FormGroup = new FormGroup({});
  public newAccountForm: FormGroup = new FormGroup({});
  public updateGivingForm: FormGroup = new FormGroup({});
  constructor(
    private givingService: GivingService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.givingForm = this.fb.group({
      type: [null, Validators.required],
      account_id: [null],
      currency: [null],
      amount: [null],
      request_name: [false],
      request_email: [false],
      request_phone: [false],
    });
    this.newAccountForm = this.fb.group({
      title: [null, Validators.required],
      bank_code: [null],
      number: [null, Validators.required],
      bank_slug: [null, Validators.required],
      name: new FormControl({ value: null, disabled: true }),
    });
  }
  accTypeList = ['asset', 'liability', 'income', 'expense'];
  ngOnInit(): void {
    this.getRoutes();
    this.getAccounts();
    this.getBanks();
  }
  ngAfterViewInit() {}
  gotoBack() {
    this._location.back();
  }
  get givingFormValue(): any {
    return this.givingForm.getRawValue();
  }
  get accountFormValue(): any {
    return this.newAccountForm.getRawValue();
  }
  get updatedGivingValue(): any {
    return this.updateGivingForm.getRawValue();
  }
  handleBankChange(evt: any) {
    this.bankObj = evt.value;
  }

  getAccounts() {
    this.accountList = [];
    this.givingService.fetchAccounts().subscribe(
      (res: any) => {
        const { data } = res;
        this.accountList = data;
      },
      (errors) => {
        if (errors) {
          this.accountList = [];
        }
      }
    );
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
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._id = params.id;
        this.getDetails(this._id);
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/more/online-giving']);
    }
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
  getDetails(id: any) {
    this._loading_ = true;
    this.givingService.fetchGiving(id).subscribe(
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
  addAccount() {
    this.isBusy_ = true;
    this.newAccountForm.patchValue({
      bank_code: this.bankObj.code,
      bank_slug: this.bankObj.slug,
    });
    if (this.newAccountForm.invalid) {
      this.isBusy_ = false;
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
          this.isBusy_ = false;
          this.closebtn._elementRef.nativeElement.click();
          this.getAccounts();
        },
        (error) => {
          this.isBusy_ = false;
          this.toastr.error(error, 'Message', {
            timeOut: 1000,
          });
        },
        () => {
          this.isBusy_ = false;
          this.newAccountForm.reset();
        }
      );
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._id !== undefined) {
      this.updateGivingForm = this.fb.group({
        type: [this.itemDetails?.type, Validators.required],
        account_id: [this.itemDetails?.account?.id],
        currency: [this.itemDetails?.currency],
        amount: [this.itemDetails?.amount],
        request_name: [this.itemDetails?.request_name],
        request_email: [this.itemDetails?.request_email],
        request_phone: [this.itemDetails?.request_phone],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    if (this.givingForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.givingForm.valid) {
      //Make api call here...
      this.givingService.addGiving(this.givingFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/more/online-giving']);
          this.givingForm.reset();
          this.isBusy = false;
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.givingForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updateGivingForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateGivingForm.valid) {
      //Make api call here...
      this.givingService
        .updateGivings(this.updatedGivingValue, this._id)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.updateGivingForm.reset();
            this.router.navigate(['/portal/more/online-giving']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.updateGivingForm.reset();
          }
        );
    }
  }
}
