import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  ActivatedRoute,
  NavigationExtras,
  ParamMap,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import {
  checkForSpecialChars,
  hasNumber,
  validateCapital,
} from 'src/app/shared/_helperFunctions';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { MyErrorStateMatcher } from '../register/register.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  showContentType: boolean = false;
  queryString: string;
  token: string;
  reset_email: string;
  show: boolean = false;
  isBusy: boolean = false;
  upperCaseChar: any;
  numberChar: any;
  specialChar: any;
  validatePassword: any;

  matcher = new MyErrorStateMatcher();
  _validateCaps = validateCapital;
  _hasNumber = hasNumber;
  _checkForSpecialChars = checkForSpecialChars;
  public resetEmailForm: FormGroup = new FormGroup({});
  public resetPasswordForm: FormGroup = new FormGroup({});
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.resetEmailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.fb.group(
      {
        email: [null],
        password: ['', Validators.required],
        password_confirmation: [],
        token: [null],
      },
      { validators: this.checkPasswordMatch }
    );
  }

  ngOnInit(): void {
    this.getRoutes();
  }
  checkPasswordMatch: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('password_confirmation').value;
    return pass === confirmPass ? null : { notSame: true };
  };
  get emailValue() {
    return this.resetEmailForm.getRawValue();
  }
  get emailTrueValue() {
    return this.resetEmailForm.controls['email'].value;
  }

  get passwordValue() {
    return this.resetPasswordForm.getRawValue();
  }
  get passwordTrueValue() {
    return this.resetPasswordForm.controls['password'].value;
  }
  password() {
    this.show = !this.show;
  }

  checkPassword(password: any) {
    this.validatePassword = password;
    this.upperCaseChar = this._validateCaps(password);
    this.numberChar = this._hasNumber(password);
    this.specialChar = this._checkForSpecialChars(password);
  }
  getRoutes() {
    if (this.router.url.includes('reset-password')) {
      this.showContentType = true;
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.token = params.get('token');
      });
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        this.reset_email = params.get('email');
      });
    } else {
      this.showContentType = false;
    }
  }
  navigate(data: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        query: data,
      },
    };
    this.router.navigate(['/onboarding/verify-email'], navigationExtras);
  }
  onResetEmail() {
    this.isBusy = true;
    if (this.resetEmailForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.resetEmailForm.valid) {
      this.authService.resetEmail(this.emailValue).subscribe(
        (res) => {
          this.isBusy = false;
          this.toastr.success(res.message, 'Message');
          this.openBottomSheet(this.emailTrueValue);
          this.resetEmailForm.reset();
        },
        (err) => {
          this.isBusy = false;
          this.toastr.error(err, 'Message');
        },
        () => {
          this.isBusy = false;
          this.resetEmailForm.reset();
        }
      );
    }
  }
  onResetPassword() {
    this.isBusy = true;
    if (this.resetPasswordForm.invalid) {
      this.isBusy = false;
      return;
    }
    this.resetPasswordForm.patchValue({
      email: this.reset_email,
      token: this.token,
    });
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.passwordValue).subscribe(
        (res) => {
          this.isBusy = false;
          this.toastr.success(res.message, 'Message');
          this.autoLogUserIn();
        },
        (message) => {
          this.isBusy = false;
          this.toastr.error(message, 'Message');
        }
      );
    }
  }
  autoLogUserIn() {
    let payload = {
      email: this.reset_email,
      password: this.passwordTrueValue,
    };
    this.authService.login(payload).subscribe(
      (res) => {
        const { data } = res;
        if (res.status === 'success') {
          this.toastr.success('Login successful', 'Message');
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user_details', JSON.stringify(data));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem(
            'user_church',
            JSON.stringify(res.data.memberships[0])
          );
          if (
            res.data.email_verified_at === null ||
            !res.data.email_verified_at
          ) {
            this.navigate(res.data.email);
          } else {
            this.router.navigate(['/portal/activity']);
          }
        }
      },
      (err) => {
        this.toastr.error(err, 'Message');
        this.isBusy = false;
      },
      () => {
        this.isBusy = false;
      }
    );
  }
  openBottomSheet(email: string): void {
    this._bottomSheet.open(BottomSheetComponent, {
      data: {
        data: email,
        type: 'reset_link',
      },
    });
  }
}
