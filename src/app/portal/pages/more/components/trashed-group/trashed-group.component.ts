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
import { GroupsService } from 'src/app/portal/services/groups.service';

@Component({
  selector: 'app-trashed-group',
  templateUrl: './trashed-group.component.html',
  styleUrls: ['./trashed-group.component.scss'],
})
export class TrashedGroupComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  itemList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  selectedItem: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private groupService: GroupsService,
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

  column = ['group name', 'description', 'member count', 'action'];

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
    this.itemList = [];
    this.groupService.fetchAllFromTrash(this.currentPage + 1).subscribe(
      (res: any) => {
        this._loading = false;
        const { data, meta } = res;
        this.itemList = data;
        this.dataSource = new MatTableDataSource(this.itemList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.itemList.length;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.itemList = [];
        }
      }
    );
  }
  gotoBack() {
    this._location.back();
  }
  getDetails(id: any) {
    this._loading_ = true;
    if (id !== undefined) {
      this.groupService.fetchAllGroups(this.currentPage + 1).subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data.filter((x) => x.id == id);
        },
        (msg) => {
          this._loading_ = false;
        }
      );
    }
  }
  getSelectedItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedItem = filter;
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
        groups_id: this.selectedItem,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        groups_id: [this.itemDetails[0].id],
      };
    }
    this.groupService.deleteFromTrash(payload).subscribe(
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
        groups_id: this.selectedItem,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        groups_id: [this.itemDetails[0].id],
      };
    }

    this.groupService.restore(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/more/group']);
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
