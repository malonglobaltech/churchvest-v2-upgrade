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
  truncateString,
} from 'src/app/shared/_helperFunctions';

@Component({
  selector: 'app-new-converts',
  templateUrl: './new-converts.component.html',
  styleUrls: ['./new-converts.component.scss'],
})
export class NewConvertsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  convertList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'evangelism_data';
  filterValue: string;
  _id: number;
  selectedConvert: any[] = [];
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
    private exportService: ExportServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getConverts();

    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'first name',
    'last name',
    'membership info',
    'convert status',
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
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  getConverts() {
    this._loading = true;
    this.convertList = [];
    this.peopleService
      .fetchAll('members', this.currentPage + 1, this.pageSize, 'convert')
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;

          this.convertList = data.filter((x: any) => x.details.convert);
          this.dataSource = new MatTableDataSource(this.convertList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.convertList.length;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.convertList = [];
          }
        }
      );
  }
  getselectedConvert(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedConvert = filter;
  }
  getConvertsDetails(id: any) {
    this._loading_ = true;
    this._id = id;
    if (this._id !== undefined) {
      this.peopleService.fetchDetails(id, 'members/member', '').subscribe(
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
    this.getConverts();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'CONVERTS DATA' }, // title
        {
          A: '#',
          B: 'First Name',
          C: 'Last Name',
          D: 'Membership Info',
          E: 'Convert Status',
        }, // table header
      ],
      skipHeader: true,
    };
    this.convertList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.first_name,
        C: data.last_name,
        D: data.membership_info,
        E: data.convert_status,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
