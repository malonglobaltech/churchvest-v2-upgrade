import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-multifile-upload',
  templateUrl: './multifile-upload.component.html',
  styleUrls: ['./multifile-upload.component.scss'],
})
export class MultifileUploadComponent implements OnInit {
  @ViewChild('triggerFile') triggerFile: any;
  @Input() _fileTitle: any;
  @ViewChild('_marker1') _marker1: any;
  @ViewChild('_marker2') _marker2: any;
  @Output() outToParent = new EventEmitter<any>();
  @Input() setImageFile: any;
  @Input() _form: FormGroup;
  file: FileList;
  fileImage: any;
  _filename: string;
  _filesize: number;

  mediaList: any = [];
  constructor(private toastr: ToastrService, private renderer: Renderer2) {}

  ngOnInit(): void {}
  ngAfterViewInit() {}

  public changeUploadListener(event: any): void {
    this.file = event.target.files;

    if (this.file) {
      for (let i = 0; i < this.file.length; i++) {
        var reader = new FileReader();
        reader.onloadend = () => {
          this._filesize = event.target.files[0].size;

          if (this._filesize / 1024 / 1024 > 15) {
            this.toastr.info('File size should be less than 15MB', 'Message');
            return;
          }

          if (this.file[i].type == 'audio/mpeg') {
            this._filename = this.file[i].name;
            this.mediaList.push(this.file[i]);
            this.outToParent.emit(
              new File([this.file[i]], this._filename, { type: 'mp3' })
            );
            this.renderer.setStyle(
              this._marker2.nativeElement,
              'display',
              'none'
            );
            this.renderer.setProperty(
              this._marker1.nativeElement,
              'innerHTML',
              `<div  class="mt-3 d-flex align-items-center">
                 <span class="text-grey f12 cursor">Add More Files...</span>
                </div>`
            );
          } else {
            this.toastr.error(
              'File type not supported, only mp3 file is allowed',
              'Message'
            );
          }
        };
        reader.readAsDataURL(this.file[i]);
      }
    }
  }

  public addFile() {
    this.triggerFile.nativeElement.click();
  }
  public removeFile(index: number, _query?: string) {
    const mediaItem = this._form.get('resources') as FormArray;

    if (_query == 'mp3' && mediaItem !== null) {
      let keyindex: any = mediaItem.at(index).value;
      this.mediaList.splice(index, 1);
      mediaItem.removeAt(keyindex);
    }
  }
}
