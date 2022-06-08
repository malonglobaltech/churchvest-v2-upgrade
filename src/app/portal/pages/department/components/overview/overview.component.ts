import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/portal/services/department.service';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { 
  concatColumnString,
  printElement 
} from 'src/app/shared';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  departmentList: any[] = [];
  isBusy: boolean = false;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'department_data';
  filterValue: string;
  memberId: number;
  selectedDepartment: any[] = [];
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
    private deptService: DepartmentService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._getAllDepartments();
    this.displayedColumns = this.column;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'department',
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
      return `${this.isAllSelected() ? 'deselect' : 'select' } all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`
  }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  private _getAllDepartments() {
    this._loading = true;
    this.departmentList = [];
    this.deptService
      .getAllDepartment(this.currentPage + 1, this.pageSize)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.departmentList = data;
          this.dataSource = new MatTableDataSource(this.departmentList);
          // this.paginator.pageIndex = this.currentPage;
          // this.paginator.length = meta.total;
          console.log('this.dataSource', this.dataSource)
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.departmentList = [];
          }
        }
      )

  }
  getSelectedDepartment(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedDepartment = filter;
  }
  getDepartmentDetails(id: any) {
    this._loading_ = true;
    this.memberId = id;
    if (this.memberId !== undefined) {
      this.deptService.fetchDepartmentDetails(id).subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data;
        },
        (msg)=> {
          this._loading_ = false;
        }
      )
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this._getAllDepartments();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        departments_id: [this.itemDetails.id],
      }
    }
    if (this._isAllSelected) {
      payload = {
        departments_id: this.selectedDepartment,
      };
    }
    this.deptService
      .moveToTrash(payload)
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/department/trash']);
        this.closebtn._elementRef.nativeElement.click();
        this._getAllDepartments();
      })
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'DEPARTMENT DATA' }, // title
        {
          A: '#',
          B: 'Department Name',
          C: 'Department Leader',
          D: 'Meeting Days',
          E: 'Meeting Time',
        }, // table header
      ],
      skipHeader: true,
    };
    this.departmentList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.name,
        C: data.roles.leader.member.user.first_name,
        D: data.meeting_days,
        E: data.start_time,
      });
    });
    edata.push(udt)
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }


}
