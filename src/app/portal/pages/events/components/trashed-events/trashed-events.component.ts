import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/portal/services/events.service';

@Component({
  selector: 'app-trashed-events',
  templateUrl: './trashed-events.component.html',
  styleUrls: ['./trashed-events.component.scss'],
})
export class TrashedEventsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  departmentList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  selectedEvent: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private evtsService: EventsService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getAllTrashedEvents();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'name of event',
    'type of event',
    'start date',
    'organizer',
    'location',
    'action',
  ];

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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllTrashedEvents() {
    this._loading = true;
    this.departmentList = [];
    this.evtsService.fetchAllFromTrash(this.currentPage + 1).subscribe(
      (res: any) => {
        this._loading = false;
        const { data, meta } = res;
        this.departmentList = data;
        this.dataSource = new MatTableDataSource(this.departmentList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = meta.total;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.departmentList = [];
        }
      }
    );
  }
  gotoBack() {
    this._location.back();
  }
  getTrashedEventDetails(id: number) {
    this.itemDetails = this.departmentList.find((i) => i.id === id);
    if (typeof this.itemDetails === 'undefined') {
      this.itemDetails = null;
      return this.itemDetails;
    } else {
      return this.itemDetails;
    }
  }
  getSelectedEvent(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedEvent = filter;
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllTrashedEvents();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        events_id: this.selectedEvent,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        events_id: [this.itemDetails.id],
      };
    }
    this.evtsService.deleteFromTrash(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.selection.clear();
        this.toastr.success(message, 'Success');
        this.closebtn._elementRef.nativeElement.click();
        this.getAllTrashedEvents();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
  confirmRestore() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        events_id: this.selectedEvent,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        events_id: [this.itemDetails.id],
      };
    }

    this.evtsService.restore(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/events']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getAllTrashedEvents();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
}
