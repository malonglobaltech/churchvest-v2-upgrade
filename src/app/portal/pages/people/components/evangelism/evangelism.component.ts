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
  selector: 'app-evangelism',
  templateUrl: './evangelism.component.html',
  styleUrls: ['./evangelism.component.scss'],
})
export class EvangelismComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  evangelismList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'evangelism_data';
  filterValue: string;
  _id: number;
  selectedEvangelism: any[] = [];
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
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  getEvangelism() {
    this._loading = true;
    this.evangelismList = [];
    this.peopleService
      .fetchAll('evangelism', this.currentPage + 1, this.pageSize)
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
  getSelectedEvangelism(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedEvangelism = filter;
  }
  getEvangelismDetails(id: any) {
    this._loading_ = true;
    this._id = id;
    if (this._id !== undefined) {
      this.peopleService.fetchDetails(id, 'evangelism', 'show').subscribe(
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
    this.getEvangelism();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        evangelism_id: [this.itemDetails.id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        evangelism_id: this.selectedEvangelism,
      };
    }
    this.peopleService
      .moveToTrash(payload, 'evangelism')
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/people/evangelism/trash']);
        this.closebtn._elementRef.nativeElement.click();
        this.getEvangelism();
      });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'EVANGELISM DATA' }, // title
        {
          A: '#',
          B: 'Evangelism Name',
          C: 'Organizer',
          D: 'Start Date',
          E: 'End Date',
          F: 'Address',
        }, // table header
      ],
      skipHeader: true,
    };
    this.evangelismList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.organizer,
        D: data.start_date,
        E: data.end_date,
        F: data.address,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
