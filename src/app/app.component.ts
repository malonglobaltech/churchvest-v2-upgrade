import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NetworkService } from './services/network.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private networkServ: NetworkService
  ) {}

  ngOnInit(): void {
    this.checkConnection();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);
        rt.data.subscribe((data: any) => {
          this.titleService.setTitle(data.title);
          window.scrollTo(0, 0);
        });
      });
  }
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
  checkConnection() {
    this.networkServ.checkNetworkOnline().subscribe((res) => {
      if (!res) {
        Swal.fire('Network problem', 'No internet connection!', 'error');
      }
    });
  }
}
