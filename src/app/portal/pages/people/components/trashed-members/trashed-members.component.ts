import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { PeopleService } from 'src/app/portal/services/people.service';
import { Location } from '@angular/common';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trashed-members',
  templateUrl: './trashed-members.component.html',
  styleUrls: ['./trashed-members.component.scss'],
})
export class TrashedMembersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  memberList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  file_name = 'members_data';
  searchedMemberDetails: any;
  selectedMembers: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private peopleService: PeopleService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getMembers();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['first name', 'last name', 'phone', 'email', 'action'];

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
  getMembers() {
    this._loading = true;
    this.memberList = [];
    this.peopleService.fetchAllMembersFromTrash().subscribe(
      (res: any) => {
        this._loading = false;
        const { data } = res;
        this.memberList = data;
        this.dataSource = new MatTableDataSource(this.memberList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.memberList.length;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.memberList = [];
        }
      }
    );
  }
  gotoBack() {
    this._location.back();
  }
  getMemberDetails(id: number) {
    this.itemDetails = this.memberList.find((i) => i.user.id === id);
    if (typeof this.itemDetails === 'undefined') {
      this.itemDetails = null;
      return this.itemDetails;
    } else {
      return this.itemDetails;
    }
  }
  getSelectedMemberItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMembers = filter;
  }
  searchMember(query: string) {
    this.peopleService.searchMember(query).subscribe((res: any) => {
      this._loading = false;
      const { data } = res;
      this.searchedMemberDetails = data;
      if (this.searchedMemberDetails.length == 0) {
        this.toastr.error('No record found for search query', 'Message');
      }
    });
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMembers();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        members_id: this.selectedMembers,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        members_id: [this.itemDetails.id],
      };
    }
    this.peopleService.deleteMember(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.closebtn._elementRef.nativeElement.click();
        this.getMembers();
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
        members_id: this.selectedMembers,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        members_id: [this.itemDetails.id],
      };
    }

    this.peopleService.restoreMember(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/people/members']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getMembers();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'REGULAR MEMBERS DATA' }, // title
        {
          A: '#',
          B: 'First Name',
          C: 'Last Name',
          D: 'Phone',
          E: 'Email',
        }, // table header
      ],
      skipHeader: true,
    };
    this.memberList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.user.first_name,
        C: data.user.last_name,
        D: data.user.phone,
        E: data.user.email,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
