import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.scss'],
})
export class ImageuploadComponent implements OnInit {
  @ViewChild('uploadAvatar') uploadAvatar;
  @ViewChild('uploadedAvatar') uploadedAvatar;
  @Output() outToParent = new EventEmitter<any>();
  @Input() setImageFile: any;
  fileImage: any;
  _filename: string;
  _filesize: number;
  isLoading: boolean = false;
  constructor(private toastr: ToastrService, private renderer: Renderer2) {}

  ngOnInit(): void {}
  ngAfterViewInit() {}
  changeImageUploadListener(event: any): void {
    this.fileImage = event.target.files[0];
    if (this.fileImage) {
      var reader = new FileReader();
      reader.onloadend = (e) => {
        this.isLoading = true;
        this._filesize = event.target.files[0].size;

        if (this._filesize / 1024 / 1024 > 1) {
          this.toastr.info('File size should be less than 1MB', 'Message');
          return;
        }
        if (
          this.fileImage.type == 'image/jpeg' ||
          this.fileImage.type == 'image/png'
        ) {
          this.renderer.setStyle(
            this.uploadedAvatar.nativeElement,
            'background',
            `url(${e.target.result})`
          );
          this._filesize = Math.round(this._filesize / 1000);
          this._filename = this.fileImage.name;
          this.outToParent.emit(this.fileImage);
          this.toastr.success('File successfully added', 'Message');
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastr.error(
            'File type not supported, only jpeg and png file is allowed',
            'Message'
          );
        }
      };
      reader.readAsDataURL(this.fileImage);
    }
  }

  addAvatar() {
    this.uploadAvatar.nativeElement.click();
  }
}
