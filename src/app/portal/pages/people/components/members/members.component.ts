import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { PeopleService } from 'src/app/portal/services/people.service';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  memberList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'members_data';
  filterValue: string;
  searchedMemberDetails: any;
  memberId: number;
  selectedMembers: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  payload: any[] = [];
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private peopleService: PeopleService,
    private exportService: ExportServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getMembers();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['first name', 'last name', 'role', 'phone', 'email', 'action'];

  isAllSelected() {
    let filtered = this.dataSource.data.filter((x) => x.role !== 'admin');
    const numSelected = this.selection.selected.length;
    const numRows = filtered.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    let filtered = this.dataSource.data.filter((x) => x.role !== 'admin');
    this.selection.select(...filtered);
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
  getMembers() {
    this._loading = true;
    this.memberList = [];
    this.peopleService
      .fetchAllMembers(this.currentPage + 1, this.pageSize)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.memberList = data;
          this.dataSource = new MatTableDataSource(this.memberList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = meta.total;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.memberList = [];
          }
        }
      );
  }
  getSelectedMemberItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMembers = filter;
  }
  getMemberDetails(id: any) {
    this._loading_ = true;
    this.memberId = id;
    if (this.memberId !== undefined) {
      this.peopleService.fetchMemberDetails(id).subscribe(
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
    if (this._isSingleSelected) {
      payload = {
        members_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        members_id: this.selectedMembers,
      };
    }
    this.peopleService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.router.navigate(['/portal/people/trashed-members']);
      this.closebtn._elementRef.nativeElement.click();
      this.getMembers();
    });
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
