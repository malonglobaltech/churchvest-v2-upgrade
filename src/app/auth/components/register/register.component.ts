import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { IAuth } from 'src/app/shared/model';
import {
  checkForSpecialChars,
  hasNumber,
  validateCapital,
} from 'src/app/shared/_helperFunctions';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  show: boolean = false;
  isBusy: boolean = false;
  validate: boolean = false;
  recordFound: boolean = false;
  recordData: any;
  recordMsg: any;
  selectedChurch: any;
  isChecked: boolean = true;
  matcher = new MyErrorStateMatcher();
  upperCaseChar: any;
  numberChar: any;
  specialChar: any;
  validatePassword: any;
  _validateCaps = validateCapital;
  _hasNumber = hasNumber;
  _checkForSpecialChars = checkForSpecialChars;

  public form: FormGroup = new FormGroup({});
  constructor(
    private authServ: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        name: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: [''],
      },
      { validators: this.checkPasswordMatch }
    );
  }

  ngOnInit(): void {}
  get value(): IAuth {
    return this.form.getRawValue();
  }
  get passwordValue(): IAuth {
    return this.form.controls['password'].value;
  }
  checkPasswordMatch: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  checkPassword(password) {
    this.validatePassword = password;
    this.upperCaseChar = this._validateCaps(password);
    this.numberChar = this._hasNumber(password);
    this.specialChar = this._checkForSpecialChars(password);
  }

  get emailCtrInstance(): FormControl {
    return this.form.get('email') as FormControl;
  }
  password() {
    this.show = !this.show;
  }
  resetControl() {
    if (this.emailCtrInstance.status == 'INVALID') {
      this.recordFound = false;
    }
  }
  validateEmail() {
    this.isBusy = true;
    const payload = {
      email: this.emailCtrInstance.value,
    };
    this.authServ.resolveUser(payload).subscribe(
      ({ message, data }) => {
        this.isBusy = false;
        if (data.length == 0) {
          this.recordData = data;
          this.recordFound = true;
        } else {
          this.recordFound = true;
          this.recordData = data;
          this.recordMsg = message;
          this.toastr.info(message, 'Message', {
            timeOut: 3000,
          });
        }
      },
      () => {
        this.isBusy = false;
        this.recordFound = false;
      }
    );
  }

  onSubmit() {
    this.isBusy = true;

    if (this.form.valid) {
      this.authServ.register(this.value).subscribe(
        (res) => {
          const { data } = res;
          this.recordFound = false;
          this.toastr.success('Registration successful', 'Message');
          this.form.reset();
          localStorage.setItem('token', res.access_token);
          this.navigate(data.email);
        },
        (err) => {
          this.toastr.error(err, 'Message');
          this.isBusy = false;
        },
        () => {
          this.isBusy = false;
          this.form.reset();
        }
      );
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
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
