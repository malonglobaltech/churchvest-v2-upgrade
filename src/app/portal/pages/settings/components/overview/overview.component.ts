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
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  uploadAvatar: TemplateRef<any>;
  uploadedAvatar: TemplateRef<any>;
  userData: any;
  churchData: any;
  profileImg: any;
  fullname: any;
  email: any;
  isEditing: boolean = false;
  isBusy: boolean = false;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    public imgUp: ImageuploadComponent
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserData();
    this.fullname = `${this.userData.first_name} ${this.userData.last_name}`;
    this.email = `${this.userData.email}`;
    this.churchData = JSON.parse(localStorage.getItem('user_church'));
    this.profileImg = this.userData.memberships[0]?.profile;
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  onUpdate() {
    this.isBusy = true;
    let payload = {
      name: this.fullname,
    };
    if (payload == null) {
      this.isBusy = false;
      return;
    }
    const formData = new FormData();
    formData.append('name', this.fullname);
    formData.append('email', this.email);

    this.authService.updateProfile(formData).subscribe(
      ({ message, data }) => {
        this.toastr.success(message, 'Message');
        this.isBusy = false;
        this.isEditing = !this.isEditing;
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
}

@Component({
  template: '',
})
export class ImageuploadComponent implements OnInit {
  @Input() setImageFile: any;
  fileImage: any;
  isBusy: boolean = false;
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {}
  changeImageUploadListener(event: any, rf): void {
    this.fileImage = event.target.files[0];
    if (this.fileImage) {
      var reader = new FileReader();
      reader.onloadend = (e) => {
        if (event.target.files[0].size / 1024 / 1024 > 5) {
          this.toastr.info('File size should be less than 5MB', 'Message');
          return;
        }
        if (
          this.fileImage.type == 'image/jpeg' ||
          this.fileImage.type == 'image/png'
        ) {
          this.renderer.setStyle(rf, 'background', `url(${e.target.result})`);
          this.toastr.success('File successfully added', 'Message');
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

  updateProfileImg() {
    this.isBusy = true;

    if (this.fileImage == null) {
      this.isBusy = false;
      return;
    }
    const formData = new FormData();
    formData.append('profile', this.fileImage);

    this.authService.updateProfile(formData).subscribe(
      ({ message, data }) => {
        this.toastr.success(message, 'Message');
        this.isBusy = false;
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
  addAvatar(ref) {
    ref.click();
  }
}
