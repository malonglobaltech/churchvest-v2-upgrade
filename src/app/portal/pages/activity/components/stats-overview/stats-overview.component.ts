import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss'],
})
export class StatsOverviewComponent implements OnInit {
  @ViewChild('scrollItems') scrollItems;
  constructor() {}

  ngOnInit(): void {}
  scrollRight(): void {
    this.scrollItems.nativeElement.scrollTo({
      left: this.scrollItems.nativeElement.scrollLeft + 400,
      behavior: 'smooth',
    });
  }
  scrollLeft(): void {
    this.scrollItems.nativeElement.scrollTo({
      left: this.scrollItems.nativeElement.scrollLeft - 400,
      behavior: 'smooth',
    });
  }
}
