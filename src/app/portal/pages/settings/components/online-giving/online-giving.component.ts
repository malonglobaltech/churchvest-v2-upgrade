import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GivingService } from 'src/app/portal/services/giving.service';
import { maxLengthCheck } from 'src/app/shared';

@Component({
  selector: 'app-online-giving',
  templateUrl: './online-giving.component.html',
  styleUrls: ['./online-giving.component.scss'],
})
export class OnlineGivingComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  _loading_: boolean = false;
  bankObj: any;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  bankList: any[] = [];
  accountList: any[] = [];
  accountName: string = '';
  public newAccountForm: FormGroup = new FormGroup({});
  _maxLengthCheck = maxLengthCheck;
  constructor(
    private givingService: GivingService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.newAccountForm = this.fb.group({
      title: [null, Validators.required],
      bank_code: [null],
      number: [null, Validators.required],
      bank_slug: [null, Validators.required],
      name: new FormControl({ value: null, disabled: true }),
    });
  }

  ngOnInit(): void {
    this.getAccounts();
    this.getBanks();
  }
  get accountFormValue(): any {
    return this.newAccountForm.getRawValue();
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
  handleBankChange(evt: any) {
    this.bankObj = evt.value;
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
          this.newAccountForm.reset();
          this.isBusy = false;
          this.closebtn._elementRef.nativeElement.click();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.newAccountForm.reset();
        }
      );
    }
  }
  toggleIsActive(evt, id) {
    this.isBusy_ = true;
    let value: number;
    if (evt.checked == true) {
      value = 1;
    } else {
      value = 0;
    }
    let payload = {
      is_active: value,
    };
    this.givingService.updateAccount(payload, id).subscribe(
      (res: any) => {
        this.isBusy_ = false;
        const { message } = res;
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
