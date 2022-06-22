import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent {
  @Input() _fileTitle: any;
  @Input() _form: FormGroup;
  @Input() _query;

  @ViewChild('_progressbarMultiple1') _progressbarMultiple1: any;
  @ViewChild('_marker1') _marker1: any;
  @ViewChild('_marker2') _marker2: any;
  @ViewChild('triggerDocFile') triggerDocFile: any;
  @Output() outToParent = new EventEmitter<any>();
  doc: any;
  _filesize: any;
  _filename: string;
  _isUploaded: boolean = false;
  constructor(private renderer: Renderer2, private toastr: ToastrService) {}
  ngAfterViewInit() {}

  public addDoc() {
    this.triggerDocFile.nativeElement.click();
  }
  public changedocListener(event: any): void {
    this.doc = event.target.files[0];
    if (this.doc) {
      var reader = new FileReader();
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastr.info('File size should be less than 10MB', 'Message');
        return;
      }
      reader.onloadend = () => {
        if (
          (event.target.files[0].size / 1024 / 1024 < 10 &&
            this.doc.type == 'application/pdf') ||
          this.doc.type == 'application/docx'
        ) {
          this._isUploaded = true;
          this._filesize = Math.round(event.target.files[0].size / 1000);
          this._filename = this.doc.name;
          this.outToParent.emit(this.doc);
          this.renderer.setStyle(
            this._marker2.nativeElement,
            'display',
            'none'
          );

          this.toastr.success('File successfully added', 'Message');
        } else {
          this.toastr.error(
            'File type not supported, only pdf and doc file is allowed',
            'Message'
          );
        }
      };
      reader.readAsDataURL(this.doc);
    }
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
