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
  selector: 'app-church-setup',
  templateUrl: './church-setup.component.html',
  styleUrls: ['./church-setup.component.scss'],
})
export class ChurchSetupComponent implements OnInit {
  show: boolean = false;
  isBusy: boolean = false;
  public form: FormGroup = new FormGroup({});
  constructor(
    private authServ: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: [''],
      address: [''],
    });
  }

  ngOnInit(): void {}
  get value(): IAuth {
    return this.form.getRawValue();
  }

  onSubmit() {
    this.isBusy = true;
    if (this.form.valid) {
      this.authServ.setupChurch(this.value).subscribe(
        (res) => {
          const { data } = res;
          if (data) {
            this.toastr.success('Login successful', 'Message');
            this.form.reset();
            localStorage.setItem('user_church', JSON.stringify(data));
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/portal/activity']);
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
