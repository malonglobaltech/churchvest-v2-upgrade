import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from 'src/app/portal/services/people.service';
import { Location } from '@angular/common';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trashed-evangelism',
  templateUrl: './trashed-evangelism.component.html',
  styleUrls: ['./trashed-evangelism.component.scss'],
})
export class TrashedEvangelismComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  evangelismList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  selectedEvangelism: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private peopleService: PeopleService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getEvangelism();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['name', 'start date', 'end date', 'organizer', 'address', 'action'];

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
  getEvangelism() {
    this._loading = true;
    this.evangelismList = [];
    this.peopleService
      .fetchAllFromTrash('evangelism', this.currentPage + 1)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.evangelismList = data;
          this.dataSource = new MatTableDataSource(this.evangelismList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = meta.total;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.evangelismList = [];
          }
        }
      );
  }
  gotoBack() {
    this._location.back();
  }
  getEvangelismDetails(id: number) {
    this.itemDetails = this.evangelismList.find((i) => i.id === id);
    if (typeof this.itemDetails === 'undefined') {
      this.itemDetails = null;
      return this.itemDetails;
    } else {
      return this.itemDetails;
    }
  }
  getSelectedEvangelism(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedEvangelism = filter;
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getEvangelism();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        evangelism_id: this.selectedEvangelism,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        evangelism_id: [this.itemDetails.id],
      };
    }
    this.peopleService.deleteFromTrash(payload, 'evangelism').subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.selection.clear();
        this.toastr.success(message, 'Success');
        this.closebtn._elementRef.nativeElement.click();
        this.getEvangelism();
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
        evangelism_id: this.selectedEvangelism,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        evangelism_id: [this.itemDetails.id],
      };
    }

    this.peopleService.restore(payload, 'evangelism').subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/people/evangelism']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getEvangelism();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
}
