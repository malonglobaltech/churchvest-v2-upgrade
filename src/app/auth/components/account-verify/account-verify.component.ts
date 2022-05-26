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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-verify',
  templateUrl: './account-verify.component.html',
  styleUrls: ['./account-verify.component.scss'],
})
export class AccountVerifyComponent implements OnInit {
  show: boolean = false;
  isBusy: boolean = false;
  url: any;
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

  password() {
    this.show = !this.show;
  }

  onSubmit() {
    this.isBusy = true;
    if (this.form.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.form.valid) {
      this.authServ.login(this.value).subscribe(
        (res) => {
          const { data } = res;
          this.form.reset();
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user_details', JSON.stringify(data));
          localStorage.setItem('isLoggedIn', 'true');
          this.getLink();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong', 'Message');
          this.isBusy = false;
        },
        () => {
          this.isBusy = false;
          this.form.reset();
        }
      );
    }
  }
  getLink() {
    this.url = `${environment.managementbaseUrl}`;
    let baseOrigin = window.location.origin;
    let link = window.location.href;
    let newlink: string;
    newlink = link.replace(`${baseOrigin}/onboarding/api`, this.url);
    this.verifyUser(newlink);
  }
  verifyUser(link: string) {
    this.authServ.verify(link).subscribe(
      (res: any) => {
        this.isBusy = false;

        if (res.status === 'success') {
          this.toastr.success('Email Verification Successful', 'Message');
          localStorage.setItem('user_details', JSON.stringify(res.data));
          localStorage.setItem('isLoggedIn', 'true');
          let current_user = JSON.parse(localStorage.getItem('user_details'));
          if (current_user.memberships.length === 0) {
            // this.router.navigateByUrl('get-started/pricing');
          } else {
            let churches = current_user.memberships.filter(
              (church: any) => church.role === 'admin'
            );
            if (churches.length === 1) {
              localStorage.setItem('user_details', JSON.stringify(res.data));
              localStorage.setItem('user_church', JSON.stringify(churches[0]));
              this.router.navigate(['/admin/activity']);
            } else {
              this.toastr.info(
                'You are an admin in multiple churches. Kindly select a church to continue',
                'Message'
              );
              this.router.navigate(['/onboarding/login']);
            }
          }
        }
      },
      (error) => {
        error
          ? this.toastr.error(
              'Oops! Email verification not successful',
              'Message'
            )
          : null;
      }
    );
  }
}
