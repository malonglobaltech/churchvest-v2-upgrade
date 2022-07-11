import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.scss'],
})
export class ModuleAccessComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  closebtn_: TemplateRef<any>;
  uploadFile: TemplateRef<any>;
  uploadedFile: TemplateRef<any>;
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
  roleList = [
    {
      type: 'admin',
      label: 'Admin',
    },
    {
      type: 'reporting',
      label: 'Viewer(Reporting)',
    },
    {
      type: 'fellowship',
      label: 'Viewer(Fellowship)',
    },
    {
      type: 'evangelism',
      label: 'Viewer(Evangelism)',
    },
    {
      type: 'financials',
      label: 'Viewer(Financials)',
    },
    {
      type: 'member_connect',
      label: 'Viewer(Member Connect)',
    },
    {
      type: 'member',
      label: 'Member',
    },
  ];
  getMembers() {
    this._loading = true;
    this.memberList = [];
    this.peopleService.fetchMembersRole(this.currentPage + 1).subscribe(
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

  getMemberDetails(id: any) {
    this._loading_ = true;
    this.memberId = id;
    if (this.memberId !== undefined) {
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
  changeRole(val, id) {
    this.isBusy = true;
    let payload = {
      role: val,
    };
    this.peopleService.assignMemberRole(payload, id).subscribe(
      (res: any) => {
        this.isBusy = false;
        const { message } = res;
        this.toastr.success(message, 'Message', {
          timeOut: 3000,
        });
        this.getMembers();
        this.closebtn._elementRef.nativeElement.click();
      },
      (errors) => {
        this.isBusy = false;
        this.toastr.error(errors, 'Message', {
          timeOut: 3000,
        });
        this.getMembers();
        this.closebtn._elementRef.nativeElement.click();
      }
    );
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMembers();
  }
}
