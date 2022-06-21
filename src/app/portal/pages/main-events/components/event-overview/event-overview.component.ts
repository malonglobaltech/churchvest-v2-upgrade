import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'src/app/portal/services/events.service';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { PeopleService } from 'src/app/portal/services/people.service';
import {
  concatColumnString,
  printElement,
  truncateString,
} from 'src/app/shared/_helperFunctions';

@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  eventList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'event_data';
  filterValue: string;
  _id: number;
  selectedEvent: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  payload: any[] = [];
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  _truncateString = truncateString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private peopleService: PeopleService,
    private eventsService: EventsService,
    private exportService: ExportServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getEvent();

    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['name of event', 'type of event', 'start date',  'organizer', 'location', 'action'];

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  getEvent() {
    this._loading = true;
    this.eventList = [];
    this.eventsService
      .fetchAllEvents(this.currentPage + 1, this.pageSize)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.eventList = data;
          this.dataSource = new MatTableDataSource(this.eventList);
          // this.paginator.pageIndex = this.currentPage;
          // this.paginator.length = meta.total;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.eventList = [];
          }
        }
      );
  }
  getSelectedEvent(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedEvent = filter;
  }
  getEventDetails(id: any) {
    this._loading_ = true;
    this._id = id;
    if (this._id !== undefined) {
      this.peopleService.fetchDetails(id, 'evangelism', 'show').subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data;
        },
        (msg) => {
          this._loading_ = false;
        }
      );
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getEvent();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        event_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        event_id: this.selectedEvent,
      };
    }
    this.peopleService
      .moveToTrash(payload, 'evangelism')
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/events']);
        this.closebtn._elementRef.nativeElement.click();
        this.getEvent();
      });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'EVENT DATA' }, // title
        {
          A: '#',
          B: 'Event Name',
          C: 'Organizer',
          D: 'Start Date',
          E: 'End Date',
          F: 'Address',
        }, // table header
      ],
      skipHeader: true,
    };
    this.eventList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.organizer,
        D: data.start_date,
        E: data.end_date,
        F: data.address,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }

}
