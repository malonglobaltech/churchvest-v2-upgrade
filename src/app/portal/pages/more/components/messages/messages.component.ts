import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { MessagesService } from 'src/app/portal/services/messages.service';
import {
  concatColumnString,
  printElement,
  truncateString,
} from 'src/app/shared/_helperFunctions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  messageList: any[] = [];
  receiverList: any[] = [];
  attachmentList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'media_data';
  filterValue: string;
  _id: number;
  selectedMessage: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  payload: any[] = [];
  messageType: string = 'email';
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  _truncateString = truncateString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private messageService: MessagesService,
    private exportService: ExportServiceService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllMessages();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  column = [
    'from',
    'to',
    'message',
    'status',
    'type',
    'attachment',
    'created at',
    'action',
  ];
  messageTypeList = ['email', 'sms'];

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
  handleFilterChange(val: any) {
    this.getAllMessages(val.value);
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
  getAllMessages(query?: string) {
    if (query) {
      this.messageType = query;
    }
    this._loading = true;
    this.messageList = [];
    this.messageService
      .fetchAllMessages(this.messageType, this.currentPage + 1)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data, meta } = res;
          this.messageList = data;
          this.dataSource = new MatTableDataSource(this.messageList);
          this.receiverList = this.messageList.map((x) => x.to);
          this.attachmentList = this.messageList.map((x) => x.attachments);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = meta.total;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.messageList = [];
          }
        }
      );
  }

  getSelectedMessageItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMessage = filter;
  }
  getMessageDetails(id: any) {
    this._loading_ = true;
    this._id = id;
    if (this._id !== undefined) {
      this.messageService.fetchAllMessages(this.messageType).subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data.filter((x) => x.id == id);
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
    this.getAllMessages();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = [this.itemDetails[0].id];
    }
    if (this._isAllSelected) {
      payload = this.selectedMessage;
    }
    this.messageService.deleteMessage(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.selection.clear();
      this.closebtn._elementRef.nativeElement.click();
      this.getAllMessages();
    });
  }
  trash() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        messages_id: [this.itemDetails[0].id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        messages_id: this.selectedMessage,
      };
    }
    this.messageService.moveToTrash(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/more/messages/trash']);
        this.closebtn._elementRef.nativeElement.click();
        this.getAllMessages();
      },
      ({ error }) => {
        this.isBusy = false;
        this.toastr.error(error.message, 'Message');
      }
    );
  }

  exportToExcel(): void {
    const edata: Array<any> = [];

    const udt: any = {
      data: [
        { A: 'MEDIA DATA' }, // title
        {
          A: '#',
          B: 'From',
          C: 'To',
          D: 'Message',
        }, // table header
      ],
      skipHeader: true,
    };
    this.messageList.forEach((data) => {
      let res = data.to.map((x) => x);
      udt.data.push({
        A: data.id,
        B: data.from,
        C: res.toString(),
        D: data.message,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
