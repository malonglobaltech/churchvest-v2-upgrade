import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { concatColumnString } from 'src/app/shared';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closeBtn') closeBtn: any;
  departmentList: any[] = [];
  isBusy: boolean = false;
  _loading: boolean = false;
  pageSize: number = 50;
  currentPage = 0;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  _concatColumnString = concatColumnString;


  constructor(private deptService: DepartmentService) { }

  ngOnInit(): void {
    this._getAllDepartments();
    this.displayedColumns = this.column;
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

  private _getAllDepartments() {
    this._loading = true;
    this.departmentList = [];
    this.deptService
      .getAllDepartment()
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

}
