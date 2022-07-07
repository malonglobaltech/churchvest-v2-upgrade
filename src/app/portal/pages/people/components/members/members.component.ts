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
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
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
    private toastr: ToastrService,
    public bulkUpload: BulkMemberUploadComponent
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
    this.peopleService.fetchAll('members', this.currentPage + 1).subscribe(
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
    this.peopleService
      .moveToTrash(payload, 'members')
      .subscribe(({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/people/members/trash']);
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

@Component({
  template: '',
})
export class BulkMemberUploadComponent {
  @Input() _fileTitle: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('triggerDocFile') triggerDocFile: any;
  doc: any;
  _filesize: any;
  _filename: string;
  _isUploaded: boolean = false;
  isBusy: boolean = false;
  _loading: boolean = false;
  memberList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private peopleService: PeopleService
  ) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public addDoc(ref) {
    ref.click();
  }
  public changedocListener(event: any, rf): void {
    this.doc = event.target.files[0];
    if (this.doc) {
      var reader = new FileReader();
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastr.info('File size should be less than 10MB', 'Message');
        return;
      }
      reader.onloadend = () => {
        if (
          event.target.files[0].size / 1024 / 1024 < 10 &&
          this.doc.type ==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          this._isUploaded = true;
          this._filesize = Math.round(event.target.files[0].size / 1000);
          this._filename = this.doc.name;
          this.renderer.setStyle(rf, 'display', 'none');
          this.toastr.success('File successfully added', 'Message');
        } else {
          this.toastr.error(
            'File type not supported, only excel file is allowed',
            'Message'
          );
        }
      };
      reader.readAsDataURL(this.doc);
    }
  }
  uploadBulk(ref) {
    this.isBusy = true;
    if (this.doc == null) {
      this.toastr.info('No file added! Please upload a file', 'Message');
      this.isBusy = false;
      return;
    }
    const formData = new FormData();
    formData.append('file', this.doc);

    this.peopleService.bulkUpload(formData).subscribe(
      ({ message, data }) => {
        this.toastr.success(message, 'Message');
        this.isBusy = false;
        ref._elementRef.nativeElement.click();
        // window.location.reload();
      },
      (error) => {
        this.isBusy = false;
        this.toastr.error(error, 'Message', {
          timeOut: 3000,
        });
      },
      () => {
        this.isBusy = false;
      }
    );
  }
  parseValue(value) {
    return Math.round(value);
  }
  get getFileName() {
    if (this._filename) {
      return this._filename;
    } else {
      return;
    }
  }
  get getFileSize() {
    if (this._filesize && this._filesize > 1000) {
      return [`${this.parseValue(this._filesize / 1024 / 1024)}mb`];
    } else {
      return [`${this.parseValue(this._filesize)}kb`];
    }
  }
}
