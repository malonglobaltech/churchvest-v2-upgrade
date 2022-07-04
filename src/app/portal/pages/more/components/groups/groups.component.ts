import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { GroupsService } from 'src/app/portal/services/groups.service';
import { concatColumnString, printElement } from 'src/app/shared';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  itemList: any[] = [];
  trashList: any[] = [];
  isBusy: boolean = false;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'group_data';
  filterValue: string;
  groupId: number;
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
    private groupService: GroupsService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getAllGroups();
    this.getFromTrash();
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
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  _getAllGroups() {
    this._loading = true;
    this.itemList = [];
    this.groupService.fetchAllGroups(this.currentPage + 1).subscribe(
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
    this.groupService
      .fetchAllFromTrash(this.currentPage + 1)
      .subscribe((res: any) => {
        const { data } = res;
        this.trashList = data;
      });
  }
  getSelectedItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedItem = filter;
  }
  getDetails(id: any) {
    this._loading_ = true;
    this.groupId = id;
    if (this.groupId !== undefined) {
      this.groupService.fetchAllGroups(this.currentPage + 1).subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;

          this.itemDetails = data.filter((x) => x.id == this.groupId);
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
    this._getAllGroups();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        groups_id: [this.itemDetails[0].id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        groups_id: this.selectedItem,
      };
    }
    this.groupService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.router.navigate(['/portal/more/group/trash']);
      this.closebtn._elementRef.nativeElement.click();
      this._getAllGroups();
    });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'GROUP DATA' }, // title
        {
          A: '#',
          B: 'Group Name',
          C: 'Description',
          D: 'Member Count',
        }, // table header
      ],
      skipHeader: true,
    };
    this.itemList.forEach((data) => {
      let count = data.members.length;
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.description,
        D: count,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
