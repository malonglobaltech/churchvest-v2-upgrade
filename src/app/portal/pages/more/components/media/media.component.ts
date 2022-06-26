import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
import { MediaService } from 'src/app/portal/services/media.service';
import {
  concatColumnString,
  printElement,
} from 'src/app/shared/_helperFunctions';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  mediaList: any[] = [];
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  _loading_: boolean = false;
  file_name = 'media_data';
  filterValue: string;
  mediaId: number;
  selectedMedia: any[] = [];
  _isAllSelected: boolean = false;
  _isSingleSelected: boolean = false;
  payload: any[] = [];
  mediaType: string = 'message';
  _printElement = printElement;
  _concatColumnString = concatColumnString;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private mediaService: MediaService,
    private exportService: ExportServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMedia();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  column = ['media title', 'media owner', 'type', 'date created', 'action'];
  mediaTypeList = ['all', 'album', 'book', 'message', 'track'];
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
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  getAllMedia(query?: string) {
    if (query) {
      this.mediaType = query;
    }
    this._loading = true;
    this.mediaList = [];
    this.mediaService.fetchAllMedia().subscribe(
      (res: any) => {
        this._loading = false;
        const { data, meta } = res;
        this.mediaList = data;
        this.dataSource = new MatTableDataSource(this.mediaList);
        this.paginator.pageIndex = meta.current_page - 1;
        this.paginator.length = meta.total;
      },
      (errors) => {
        if (errors) {
          this._loading = false;
          this.mediaList = [];
        }
      }
    );
  }
  queryAllMedia(query?: string) {
    if (query) {
      this.mediaType = query;
    }
    this._loading = true;
    this.mediaList = [];
    this.mediaService.queryMediaWithType(query).subscribe(
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

  getSelectedMediaItem(arr: any) {
    let filter = arr.map((x: any) => x.id);
    this.selectedMedia = filter;
  }
  getMediaDetails(id: any) {
    this._loading_ = true;
    this.mediaId = id;
    if (this.mediaId !== undefined) {
      this.mediaService.fetchAllMedia().subscribe(
        (res) => {
          this._loading_ = false;
          const { data } = res;
          this.itemDetails = data.filter((x) => x.id == this.mediaId);
        },
        () => {
          this._loading_ = false;
        }
      );
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllMedia();
  }
  confirmDelete() {
    this.isBusy = true;
    let payload: any;
    if (this._isSingleSelected) {
      payload = {
        media_id: [this.itemDetails[0].id],
      };
    }
    if (this._isAllSelected) {
      payload = {
        media_id: this.selectedMedia,
      };
    }
    this.mediaService.moveToTrash(payload).subscribe(({ message }) => {
      this.isBusy = false;
      this.toastr.success(message, 'Success');
      this.router.navigate(['/portal/more/media/trash']);
      this.closebtn._elementRef.nativeElement.click();
      this.getAllMedia();
    });
  }
  downloadMedia(id) {
    this.isBusy = true;
    this.mediaService.downloadMedia(id).subscribe(
      (blob) => {
        let FileSaver = require('file-saver');
        let _blob = new File([blob], 'download', {
          type: blob.type,
        });
        FileSaver.saveAs(_blob);
        this.toastr.success('Media downloaded', 'Success');
        this.isBusy = false;
        this.closebtn_._elementRef.nativeElement.click();
      },
      (err) => {
        this.isBusy = false;
        this.toastr.info("Opps... Can't find file to download", 'Message');
        this.toastr.error(err, 'Message');
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
          B: 'Media Title',
          C: 'Media Owner',
          D: 'Media Type',
        }, // table header
      ],
      skipHeader: true,
    };
    this.mediaList.forEach((data) => {
      udt.data.push({
        A: data.id,
        B: data.title,
        C: data.owner_name,
        D: data.type,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
