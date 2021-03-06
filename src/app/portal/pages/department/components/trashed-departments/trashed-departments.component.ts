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
import { DepartmentService } from 'src/app/portal/services/department.service';

@Component({
  selector: 'app-trashed-departments',
  templateUrl: './trashed-departments.component.html',
  styleUrls: ['./trashed-departments.component.scss'],
})
export class TrashedDepartmentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  departmentList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  selectedDepartment: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private deptService: DepartmentService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getDepartment();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'name',
    'department leader',
    'meeting days',
    'meeting time',
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
  getDepartment() {
    this._loading = true;
    this.departmentList = [];
    this.deptService.fetchAllFromTrash(this.currentPage + 1).subscribe(
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
  getDepartmentDetails(id: number) {
    this.itemDetails = this.departmentList.find((i) => i.id === id);
    if (typeof this.itemDetails === 'undefined') {
      this.itemDetails = null;
      return this.itemDetails;
    } else {
      return this.itemDetails;
    }
  }
  getSelectedDepartment(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedDepartment = filter;
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getDepartment();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        departments_id: this.selectedDepartment,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        departments_id: [this.itemDetails.id],
      };
    }
    this.deptService.deleteFromTrash(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.selection.clear();
        this.toastr.success(message, 'Success');
        this.closebtn._elementRef.nativeElement.click();
        this.getDepartment();
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
        departments_id: this.selectedDepartment,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        departments_id: [this.itemDetails.id],
      };
    }

    this.deptService.restore(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/department/all']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getDepartment();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
}
