import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profileName: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.profileName = this.authService.getUserData();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
