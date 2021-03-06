import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SmsService } from 'src/app/portal/services/sms.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  userData: any;
  currentDate = new Date();
  _loading_: boolean = false;
  isBusy_: boolean = false;
  data: any;
  _amount: number;
  _unit: number;
  _isValid: boolean = false;
  reference: any;
  paystack_key: any;
  profileImg: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sm: SmsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.paystack_key = environment.paystack;
    this.getUserData();
    this.getSmsBalance();
  }
  amountChange(event: any) {
    this._amount = event.target.value;
    this.reference = Math.random().toString(36).substr(2, 10);
    this.calcUnit(this._amount);
    if (event.target.value < 500) {
      this._isValid = false;
      this._unit = null;
    }
    if (event.target.value == '') {
      this._isValid = false;
      this._unit = null;
    }
  }
  getUserData() {
    this._loading_ = true;
    this.authService.getLoggedInUser().subscribe(
      (res) => {
        this._loading_ = false;
        const { data } = res;
        this.userData = data;
        this.profileImg = this.userData.profile;
      },
      (msg) => {
        this._loading_ = false;
      }
    );
  }
  calcUnit(amt: number) {
    if (amt !== null && amt >= 500) {
      this._isValid = true;
      this._unit = (1 * amt) / 4;
    }

    return this._unit !== undefined ? this._unit : '';
  }

  getSmsBalance() {
    this._loading_ = true;
    let reference = Math.random().toString(36).substring(2, 10);
    this.sm.fetchSmsBalance(reference).subscribe(
      (res) => {
        this._loading_ = false;
        this.data = res;
      },
      () => {
        this._loading_ = false;
      }
    );
  }

  paymentInit() {}

  paymentDone(event: any) {
    //Make api call here...
    let payload = {
      ref: event.reference,
    };
    this.sm.topSmsUnit(payload).subscribe(
      () => {
        this.isBusy_ = false;
        this._amount = null;
        this.closebtn._elementRef.nativeElement.click();
        this.getSmsBalance();
      },
      (error) => {
        this.isBusy_ = false;
        this.toastr.error(error, 'Message', {
          timeOut: 3000,
        });
      },
      () => {
        this.isBusy_ = false;
      }
    );
  }

  paymentCancel() {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
