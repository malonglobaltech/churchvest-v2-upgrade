import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { 
  concatColumnString,
  printElement 
} from 'src/app/shared';
import { DepartmentService } from '../../services/department.service';
import { ExportServiceService } from '../../services/export-service.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit  {


  constructor( ) { }

  ngOnInit(): void {
  }
}
