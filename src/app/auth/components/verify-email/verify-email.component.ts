import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  queryString: any;
  loading: boolean = false;
  token: any;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.getRoutes();
    this.token = JSON.parse(localStorage.getItem('token'));
    console.log(this.token);
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/onboarding/register']);
    }
  }
  resend() {
    this.loading = true;
    this.authService.resendVerification().subscribe(
      (res) => {
        this.loading = false;
        if (res.status === 'success') {
          this.openBottomSheet();
        }
      },
      () => {
        this.loading = false;
      }
    );
  }
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent, {
      data: this.queryString,
    });
  }
}
