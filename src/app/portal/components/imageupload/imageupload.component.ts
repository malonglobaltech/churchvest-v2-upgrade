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
  @ViewChild('_progressbarMultiple1') _progressbarMultiple1: any;
  @ViewChild('uploadAvatar') uploadAvatar;
  @ViewChild('uploadedAvatar') uploadedAvatar;
  @Output() outToParent = new EventEmitter<any>();
  @Input() setImageFile: any;
  fileImage: any;
  fileName: string = 's3_image_upload_';
  _filename: string;
  progressValue: any;
  color = 'primary';
  mode = 'determinate';
  isLoading: boolean = false;
  constructor(private toastr: ToastrService, private renderer: Renderer2) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.renderer.setStyle(
      this._progressbarMultiple1.nativeElement,
      'visibility',
      'hidden'
    );
  }
  changeImageUploadListener(event: any): void {
    this.fileImage = event.target.files[0];

    if (this.fileImage) {
      var reader = new FileReader();
      reader.onloadend = (e) => {
        this.isLoading = true;
        let size = event.target.files[0].size;
        if (size / 1024 / 1024 > 1) {
          console.log(size);
          this.toastr.info('File size should be less than 1MB', 'Message');
          return;
        }
        if (
          this.fileImage.type == 'image/jpeg' ||
          this.fileImage.type == 'image/png'
        ) {
          const contentType = this.fileImage.type;
          const bucket = new S3({
            accessKeyId: environment.accessKeyId,
            secretAccessKey: environment.secretAccessKey,
            region: environment.region,
          });
          const params = {
            Bucket: environment.bucketName,
            Key: this.fileName + this.fileImage.name,
            Body: this.fileImage,
            ACL: 'public-read',
            ContentType: contentType,
          };
          bucket
            .upload(params)
            .on('httpUploadProgress', (event) => {
              this.progressValue = Math.round(
                (100 * event.loaded) / event.total
              );
              if (this.progressValue < 100) {
                this.renderer.setStyle(
                  this._progressbarMultiple1.nativeElement,
                  'visibility',
                  'visible'
                );
              }
              if (this.progressValue === 100) {
                this.progressValue = 0;
                this.renderer.setStyle(
                  this._progressbarMultiple1.nativeElement,
                  'visibility',
                  'hidden'
                );
              }
            })
            .send((err: any, data: any) => {
              this.isLoading = false;
              if (err) {
                return false;
              }
              this.renderer.setStyle(
                this.uploadedAvatar.nativeElement,
                'background',
                `url(${e.target.result})`
              );
              this._filename = this.fileImage.name;

              this.outToParent.emit(data.Location);
              this.toastr.success('File successfully uploaded', 'Message');

              return true;
            });
        } else {
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
