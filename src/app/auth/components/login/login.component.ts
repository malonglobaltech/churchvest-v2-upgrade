import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { IAuth } from 'src/app/shared/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  show: boolean = false;
  isBusy: boolean = false;
  validate: boolean = false;
  recordFound: boolean = false;
  recordData: any;
  recordMsg: any;
  selectedChurch: any;
  isChecked: boolean = true;
  public form: FormGroup = new FormGroup({});
  constructor(
    private authServ: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  get value(): IAuth {
    return this.form.getRawValue();
  }
  get emailCtrInstance(): FormControl {
    return this.form.get('email') as FormControl;
  }
  password() {
    this.show = !this.show;
  }
  onChurchSelect(evt: any) {
    this.selectedChurch = evt.value;
  }
  clearStorage() {
    localStorage.clear();
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
          this.toastr.error(message, 'Message', {
            timeOut: 3000,
          });
        } else {
          this.recordFound = true;
          this.recordData = data;
          this.recordMsg = message;
          if (this.recordData.memberships.length !== 0) {
            this.toastr.info(message, 'Message', {
              timeOut: 3000,
            });
          }
        }
      },
      () => {
        this.isBusy = false;
        this.recordFound = false;
      }
    );
  }
  navigate(data: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        query: data,
      },
    };
    this.router.navigate(['/onboarding/verify-email'], navigationExtras);
  }
  onSubmit() {
    this.isBusy = true;
    if (this.recordData == null) {
      return;
    }
    if (this.form.valid) {
      this.authServ.login(this.value).subscribe(
        (res) => {
          const { data, status, access_token } = res;
          if (status === 'success') {
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_details', JSON.stringify(data));
            if (data.memberships.length !== 0 && !this.selectedChurch) {
              this.toastr.info('Please select a church', 'Message');
              this.isBusy = false;
              return;
            }
            if (data.memberships.length !== 0) {
              this.recordFound = false;
              this.form.reset();
              this.toastr.success('Login successful', 'Message');
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem(
                'user_church',
                JSON.stringify(this.selectedChurch)
              );
              this.router.navigate(['/portal/activity']);
            }
            if (data.email_verified_at === null || !data.email_verified_at) {
              this.navigate(data.email);
            }
            if (data.email_verified_at !== null && !this.selectedChurch) {
              this.router.navigateByUrl('/onboarding/church-setup');
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
  }
}
