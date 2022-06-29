import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';
import { Router } from '@angular/router';
import { MediaService } from 'src/app/portal/services/media.service';

@Component({
  selector: 'app-trash-media',
  templateUrl: './trash-media.component.html',
  styleUrls: ['./trash-media.component.scss'],
})
export class TrashMediaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  mediaList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  mediaType: string = 'album';
  _loading: boolean = false;
  _loading_: boolean = false;
  searchMedia: any;
  selectedMedia: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private mediaService: MediaService,
    private toastr: ToastrService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getMedia();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['media title', 'media owner', 'type', 'date created', 'action'];
  mediaTypeList = ['all', 'album', 'book', 'message', 'track'];

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
  handleFilterChange(val: any) {
    this.queryAllMedia(val.value);
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
  getMedia() {
    this._loading = true;
    this.mediaList = [];
    this.mediaService.fetchAllFromTrash(this.mediaType).subscribe(
      (res: any) => {
        this._loading = false;
        const { data } = res;
        this.mediaList = data;
        this.dataSource = new MatTableDataSource(this.mediaList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.mediaList.length;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.mediaList = [];
        }
      }
    );
  }
  gotoBack() {
    this._location.back();
  }
  getMediaDetails(id: any) {
    if (id !== undefined) {
      this.mediaService.fetchAllFromTrash(this.mediaType).subscribe((res) => {
        const { data } = res;
        this.itemDetails = data.filter((x) => x.id == id);
        console.log(this.itemDetails);
      });
    }
  }
  queryAllMedia(query?: string) {
    if (query) {
      this.mediaType = query;
    }
    this._loading = true;
    this.mediaList = [];
    this.mediaService
      .fetchAllFromTrash(this.mediaType, this.currentPage + 1)
      .subscribe(
        (res: any) => {
          this._loading = false;
          const { data } = res;
          this.mediaList = data;
          this.dataSource = new MatTableDataSource(this.mediaList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.mediaList.length;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.mediaList = [];
          }
        }
      );
  }
  getSelectedMedia(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMedia = filter;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMedia();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isAllSelected) {
      payload = {
        media_id: this.selectedMedia,
      };
    }
    if (this._isSingleSelected) {
      console.log('true', this.itemDetails[0].id);

      payload = {
        media_id: [parseInt(this.itemDetails[0].id)],
      };
    }
    this.mediaService.deleteFromTrash(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.selection.clear();
        this.closebtn._elementRef.nativeElement.click();
        this.getMedia();
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
        media_id: this.selectedMedia,
      };
    }
    if (this._isSingleSelected) {
      payload = {
        media_id: [this.itemDetails[0].id],
      };
    }

    this.mediaService.restore(payload).subscribe(
      ({ message }) => {
        this.isBusy = false;
        this.toastr.success(message, 'Success');
        this.router.navigate(['/portal/more/media']);
        this.closebtn_._elementRef.nativeElement.click();
        this.getMedia();
      },
      (msg) => {
        this.isBusy = false;
        this.toastr.error(msg, 'Message');
      }
    );
  }
}
