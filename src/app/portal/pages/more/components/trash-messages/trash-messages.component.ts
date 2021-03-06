import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {
  concatColumnString,
  printElement,
  truncateString,
} from 'src/app/shared/_helperFunctions';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/portal/services/messages.service';

@Component({
  selector: 'app-trash-messages',
  templateUrl: './trash-messages.component.html',
  styleUrls: ['./trash-messages.component.scss'],
})
export class TrashMessagesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  messageList: any[] = [];
  receiverList: any[] = [];
  attachmentList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  msgType: string = 'sms';
  _loading: boolean = false;
  _loading_: boolean = false;
  selectedMessage: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  _truncateString = truncateString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private messageService: MessagesService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getMessages();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = [
    'from',
    'to',
    'message',
    'type',
    'attachment',
    'created at',
    'action',
  ];
  messageTypeList = ['email', 'sms'];

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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getMessages() {
    this._loading = true;
    this.messageList = [];
    this.messageService.fetchAllFromTrash(this.currentPage + 1).subscribe(
      (res: any) => {
        this._loading = false;
        const { data } = res;
        this.messageList = data;
        this.dataSource = new MatTableDataSource(this.messageList);
        this.receiverList = this.messageList.map((x) => x?.to);
        this.attachmentList = this.messageList.map((x) => x?.attachments);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.messageList.length;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.messageList = [];
        }
      }
    );
  }
  gotoBack() {
    this._location.back();
  }
  getMessageDetails(id: any) {
    if (id !== undefined) {
      this.messageService.fetchAllFromTrash().subscribe((res) => {
        const { data } = res;
        this.itemDetails = data.filter((x) => x.id == id);
      });
    }
  }

  getSelectedMessage(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMessage = filter;
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMessages();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        messages_id: this.selectedMessage,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        messages_id: [this.itemDetails.id],
      };
    }
    this.messageService.deleteFromTrash(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.selection.clear();
        this.closebtn._elementRef.nativeElement.click();
        this.getMessages();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
  confirmRestore() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        messages_id: this.selectedMessage,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        messages_id: [this.itemDetails[0].id],
      };
    }

    this.messageService.restore(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/more/messages']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getMessages();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
}
