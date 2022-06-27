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
  selector: 'app-fellowship',
  templateUrl: './fellowship.component.html',
  styleUrls: ['./fellowship.component.scss'],
})
export class FellowshipComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  fellowshipList: any[] = [];
  trashList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'fellowship_data';
  filterValue: string;
  searchedMemberDetails: any;
  memberId: number;
  selectedFellowship: any[] = [];
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
    this.getFellowships();
    this.getFromTrash();

    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'fellowship name',
    'fellowship leader',
    'fellowship area',
    'address',
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
  getFellowships() {
    this._loading = true;
    this.fellowshipList = [];
    this.peopleService
      .fetchAll('fellowships', this.currentPage + 1, this.pageSize)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.fellowshipList = data;
          this.dataSource = new MatTableDataSource(this.fellowshipList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = meta.total;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.fellowshipList = [];
          }
        }
      );
  }
  getFromTrash() {
    this.peopleService
      .fetchAllFromTrash('fellowships', this.currentPage + 1, this.pageSize)
      .subscribe((res: any) => {
        const { data } = res;
        this.trashList = data;
      });
  }
  getSelectedFellowship(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedFellowship = filter;
  }
  getFellowshipDetails(id: any) {
    this._loading_ = true;
    this.memberId = id;
    if (this.memberId !== undefined) {
      this.peopleService.fetchDetails(id, 'fellowships', 'show').subscribe(
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
    this.getFellowships();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        fellowships_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        fellowships_id: this.selectedFellowship,
      };
    }
    this.peopleService
      .moveToTrash(payload, 'fellowships')
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/people/house-fellowship/trash']);
        this.closebtn._elementRef.nativeElement.click();
        this.getFellowships();
      });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'HOUSE FELLOWSHIP DATA' }, // title
        {
          A: '#',
          B: 'Fellowship Name',
          C: 'Fellowship Leader',
          D: 'Fellowship Area',
          E: 'Address',
        }, // table header
      ],
      skipHeader: true,
    };
    this.fellowshipList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.leader.member.user.first_name,
        D: data.nearest_bus_stop,
        E: data.address,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
