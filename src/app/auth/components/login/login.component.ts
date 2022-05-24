import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
      this.authServ.login(this.value).subscribe(
        (res) => {
          const { data } = res;
          this.recordFound = false;
          this.toastr.success('Login successful', 'Message');
          this.form.reset();
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user_details', JSON.stringify(data));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem(
            'user_church',
            JSON.stringify(this.selectedChurch)
          );
          // this.router.navigate(['/portal/dashboard']);
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
}
