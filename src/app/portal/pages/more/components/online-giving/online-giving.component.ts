import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { GivingService } from 'src/app/portal/services/giving.service';
import { concatColumnString, printElement } from 'src/app/shared';

@Component({
  selector: 'app-online-giving',
  templateUrl: './online-giving.component.html',
  styleUrls: ['./online-giving.component.scss'],
})
export class OnlineGivingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  itemList: any[] = [];
  trashList: any[] = [];
  isBusy: boolean = false;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'giving_data';
  filterValue: string;
  memberId: number;
  selectedItem: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  pageSize: number = 50;
  currentPage = 0;
  itemDetails: any;
  payload: any[] = [];
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private givingService: GivingService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getAllGivingAccount();
    // this.getFromTrash();
    this.displayedColumns = this.column;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['giving type', 'currency', 'receiving accont', 'action'];

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

  _getAllGivingAccount() {
    this._loading = true;
    this.itemList = [];
    this.givingService.fetchAllGivingAccount().subscribe(
      (res: any) => {
        this._loading = false;
        const { data, meta } = res;
        this.itemList = data;
        this.dataSource = new MatTableDataSource(this.itemList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = meta.total;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.itemList = [];
        }
      }
    );
  }
  getFromTrash() {
    this.givingService
      .fetchAllFromTrash(this.currentPage + 1)
      .subscribe((res: any) => {
        const { data } = res;
        this.trashList = data;
      });
  }
  getselectedItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedItem = filter;
  }
  getDetails(id: any) {
    this._loading_ = true;
    this.memberId = id;
    if (this.memberId !== undefined) {
      this.givingService.fetchGiving(id).subscribe(
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
    this._getAllGivingAccount();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        givings_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        givings_id: this.selectedItem,
      };
    }
    this.givingService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.router.navigate(['/portal/online-giving/trash']);
      this.closebtn._elementRef.nativeElement.click();
      this._getAllGivingAccount();
    });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'ONLINE GIVING DATA' }, // title
        {
          A: '#',
          B: 'Giving Type',
          C: 'Currency',
          D: 'Receiving Account',
        }, // table header
      ],
      skipHeader: true,
    };
    this.itemList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.roles.leader.member.user.first_name,
        D: data.meeting_days,
        E: data.start_time,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
