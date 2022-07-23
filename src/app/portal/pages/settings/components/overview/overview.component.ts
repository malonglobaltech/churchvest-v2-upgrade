import { ActivatedRoute, Router } from '@angular/router';
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
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import {
  checkForSpecialChars,
  hasNumber,
  validateCapital,
} from 'src/app/shared';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  uploadAvatar: TemplateRef<any>;
  uploadedAvatar: TemplateRef<any>;
  show: boolean = false;
  isBusy: boolean = false;
  userData: any;
  churchData: any;
  profileImg: any;
  fullname: any;
  email: any;
  churchName: string;
  churchLocation: string;
  churchAddress: string;
  isEditing: boolean = false;
  isEditing_: boolean = false;
  matcher = new MyErrorStateMatcher();
  upperCaseChar: any;
  numberChar: any;
  specialChar: any;
  validatePassword: any;
  recordFound: boolean = false;
  _loading_: boolean = false;
  _validateCaps = validateCapital;
  _hasNumber = hasNumber;
  _checkForSpecialChars = checkForSpecialChars;
  public passwordForm: FormGroup = new FormGroup({});
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    public imgUp: ImageuploadComponent,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.passwordForm = this.fb.group(
      {
        old_password: [null],
        password: [null, Validators.required],
        password_confirmation: [null],
      },
      { validators: this.checkPasswordMatch }
    );
  }

  ngOnInit(): void {
    this.getUserData();
    this.churchData = JSON.parse(localStorage.getItem('user_church'));
  }
  get passwordValue(): any {
    return this.passwordForm.controls['password'].value;
  }
  checkPasswordMatch: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('password_confirmation').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  password() {
    this.show = !this.show;
  }
  checkPassword(password) {
    this.validatePassword = password;
    this.upperCaseChar = this._validateCaps(password);
    this.numberChar = this._hasNumber(password);
    this.specialChar = this._checkForSpecialChars(password);
  }
  getUserData() {
    this._loading_ = true;
    this.authService.getLoggedInUser().subscribe(
      (res) => {
        this._loading_ = false;
        const { data } = res;
        this.userData = data;
        this.fullname = `${this.userData.user.first_name} ${this.userData.user.last_name}`;
        this.email = `${this.userData.user.email}`;
        this.profileImg = this.userData.profile;
      },
      (msg) => {
        this._loading_ = false;
      }
    );
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  toggleEdit(query?: string) {
    if (query == 'profile') {
      this.isEditing = !this.isEditing;
    } else {
      this.isEditing_ = !this.isEditing_;
    }
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
      (res) => {
        this.toastr.success('Profile updated sucessfully', 'Message', {
          timeOut: 1000,
        });
        this.isBusy = false;
        this.isEditing = !this.isEditing;
        this.getUserData();
        this.reloadComponent();
      },
      (error) => {
        this.isBusy = false;
        this.toastr.error(error, 'Message', {
          timeOut: 1000,
        });
      },
      () => {
        this.isBusy = false;
      }
    );
  }
  onUpdateChurch() {
    this.isBusy = true;
    let payload = {
      name: this.churchData.name,
      location: this.churchData.location,
      address: this.churchData.address,
    };

    if (payload == null) {
      this.isBusy = false;
      return;
    }

    this.authService.updateChurch(payload).subscribe(
      (res) => {
        this.toastr.success('Church updated sucessfully', 'Message');
        this.isBusy = false;
        this.isEditing_ = !this.isEditing_;
      },
      (error) => {
        this.isBusy = false;
        this.toastr.error(error, 'Message', {
          timeOut: 1000,
        });
      },
      () => {
        this.isBusy = false;
      }
    );
  }
  verifyPassword() {
    this.isBusy = true;
    const payload = {
      old_password: this.passwordForm.controls['old_password'].value,
    };
    this.authService.verifyOldPassword(payload).subscribe(
      ({ message, status }) => {
        if (status == 'error') {
          this.isBusy = false;
          this.recordFound = false;
          this.toastr.error(message, 'Message', {
            timeOut: 1000,
          });
        } else {
          this.isBusy = false;
          this.recordFound = true;
          this.toastr.info(message, 'Message', {
            timeOut: 1000,
          });
        }
      },
      ({ message }) => {
        this.isBusy = false;
        this.recordFound = false;
        this.toastr.error(message, 'Message');
      }
    );
  }
  passwordChange() {
    this.isBusy = true;

    if (!this.passwordForm.valid) {
      this.isBusy = false;
      return;
    }
    const formData = new FormData();
    formData.append('password', this.passwordForm.controls['password'].value);
    formData.append(
      'password_confirmation',
      this.passwordForm.controls['password_confirmation'].value
    );

    this.authService.updateProfile(formData).subscribe(
      ({ message }) => {
        this.toastr.success(message, 'Message');
        this.isBusy = false;
        this.isEditing = !this.isEditing;
        this.passwordForm.reset();
        this.recordFound = false;
        this.validatePassword = null;
      },
      (error) => {
        this.isBusy = false;
        this.toastr.error(error, 'Message', {
          timeOut: 1000,
        });
      },
      () => {
        this.isBusy = false;
        this.passwordForm.reset();
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
  _loading_: boolean = false;
  userData: any;
  profileImg: any;
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router
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
          this.toastr.success('File successfully added', 'Message', {
            timeOut: 1000,
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
        this.fileImage == null;
        this.toastr.success(message, 'Message', {
          timeOut: 1000,
        });
        this.isBusy = false;
        this.getUserData();
        this.reloadComponent();
      },
      (error) => {
        this.isBusy = false;
        this.fileImage == null;
        this.toastr.error(error, 'Message', {
          timeOut: 1000,
        });
      },
      () => {
        this.isBusy = false;
        this.fileImage == null;
      }
    );
  }
  getUserData() {
    this._loading_ = true;
    this.authService.getLoggedInUser().subscribe(
      (res) => {
        this._loading_ = false;
        const { data } = res;
        this.userData = data;

        this.profileImg = this.userData.profile;
      },
      (msg) => {
        this._loading_ = false;
      }
    );
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  addAvatar(ref) {
    ref.click();
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
