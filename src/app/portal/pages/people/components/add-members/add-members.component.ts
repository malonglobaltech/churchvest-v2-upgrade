import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { getCompletedStatus } from 'src/app/shared/_helperFunctions';
import { PeopleService } from 'src/app/portal/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  memberList: any[] = [];
  _memberId: any;
  _files: any[] = [];
  fileData: any;
  _pathStatus = getCompletedStatus;
  public memberProfileForm: FormGroup = new FormGroup({});
  public personalInfoForm: FormGroup = new FormGroup({});
  public updateProfileForm: FormGroup = new FormGroup({});
  public updatePersonalInfoForm: FormGroup = new FormGroup({});
  public updateServiceInfoForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.personalInfoForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      date_of_birth: [null, Validators.required],
      country: [null, Validators.required],
      nearest_bus_stop: [null, Validators.required],
      residential_area: [null, Validators.required],
      address: [null, Validators.required],
      gender: [null, Validators.required],
    });
    this.memberProfileForm = this.fb.group({
      member_id: [null],
      profile: ['', Validators.required],
    });
  }

  stepperPath = [
    {
      title: 'Personal Information',
      isActive: true,
      isCompleted: false,
    },
    {
      title: 'Membership Information',
      isActive: false,
      isCompleted: false,
    },
    {
      title: 'Service Information',
      isActive: false,
      isCompleted: false,
    },
    {
      title: 'Other Information',
      isActive: false,
      isCompleted: false,
    },
  ];
  ngOnInit(): void {
    this.getRoutes();
  }
  ngAfterViewInit() {
    this.getMembers();
  }
  gotoBack() {
    this._location.back();
  }
  onSelect(event: any) {
    this.fileData = event.addedFiles[0];
    this._files.push(...event.addedFiles);
    const file = event.addedFiles[0];
    this.queryString == 'edit'
      ? this.updateProfileForm.get('profile').setValue(file)
      : this.memberProfileForm.get('profile').setValue(file);
  }
  onRemove(event: any) {
    this._files.splice(this._files.indexOf(event), 1);
    this.queryString == 'edit'
      ? this.updateProfileForm.get('profile').setValue(null)
      : this.memberProfileForm.get('profile').setValue(null);
  }
  get personalInforValue(): any {
    return this.personalInfoForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updatePersonalInfoForm.getRawValue();
  }

  gotoView(screenType?: string, screenIndex?: number) {
    if (screenType === 'next') {
      this.screen = this.screen + 1;
      this._pathStatus(this.screen, this.stepperPath);
    }
    if (screenType === 'prev') {
      this.screen = this.screen - 1;
      this._pathStatus(this.screen, this.stepperPath);
    }
    if (screenIndex) {
      this.screen = screenIndex;
    }
  }
  getChildValue(val?: any, _query?: any) {
    this.addToFormControl(val, _query);
  }
  addToFormControl(val: any, identifier?: any) {
    switch (val !== null && identifier) {
      case (identifier = 'fileUpload'):
        var imgurl = this.memberProfileForm.get('profile') as FormControl;
        return imgurl.setValue(val);
      case (identifier = 'fileUpdate'):
        var imgUrl = this.updateProfileForm.get('profile') as FormControl;

        return imgUrl.setValue(val);

      default:
        return;
    }
  }
  getMembers() {
    this.peopleServ.fetchAllMembers().subscribe(
      (res: any) => {
        const { data } = res;
        this.memberList = data;
        this.getMemberDetails(parseInt(this._memberId));
        this.setFormControlElement();
      },
      (errors) => {
        if (errors) {
          this.memberList = [];
        }
      }
    );
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._memberId = params.id;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/jackpot-game']);
    }
  }
  getMemberDetails(id: number) {
    if (this.memberList.length !== 0) {
      this.itemDetails = this.memberList.find((i) => i.user.id === id);
      if (typeof this.itemDetails === 'undefined') {
        this.itemDetails = null;
        return this.itemDetails;
      } else {
        return this.itemDetails;
      }
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit') {
      this.updatePersonalInfoForm = this.fb.group({
        member_id: [parseInt(this.itemDetails.id)],
        first_name: [this.itemDetails['user'].first_name, Validators.required],
        last_name: [this.itemDetails['user'].last_name, Validators.required],
        email: [this.itemDetails['user'].email, Validators.required],
        phone: [this.itemDetails['user'].phone, Validators.required],
        date_of_birth: [
          this.itemDetails['user'].details.personal.date_of_birth,
          Validators.required,
        ],
        country: [
          this.itemDetails['user'].details.personal.country,
          Validators.required,
        ],
        nearest_bus_stop: [
          this.itemDetails['user'].details.personal.nearest_bus_stop,
          Validators.required,
        ],
        residential_area: [
          this.itemDetails['user'].details.personal.residential_area,
          Validators.required,
        ],
        address: [
          this.itemDetails['user'].details.personal.address,
          Validators.required,
        ],
        gender: [
          this.itemDetails['user'].details.personal.gender,
          Validators.required,
        ],
      });

      this.updateProfileForm = this.fb.group({
        member_id: [parseInt(this.itemDetails.id)],
        profile: [null],
      });
    }
  }
  onAddPersonalInfo() {
    this.isBusy = true;
    if (this.personalInfoForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.personalInfoForm.valid) {
      //Make api call here...
      this.peopleServ.addPersonalInfo(this.personalInforValue).subscribe(
        ({ message, data }) => {
          this._memberId = data.id;
          this.toastr.success(message, 'Message');
          this.personalInfoForm.reset();
          this.isBusy = false;
          this.gotoView('next');
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.personalInfoForm.reset();
        }
      );
    }
  }
  onAdddProfile() {
    this.isBusy = true;
    const formData = new FormData();
    this.memberProfileForm.patchValue({
      member_id: parseInt(this._memberId),
    });

    formData.append('member_id', this.memberProfileForm.get('member_id').value);
    formData.append('profile', this.memberProfileForm.get('profile').value);
    if (this.memberProfileForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.memberProfileForm.valid) {
      //Make api call here...
      this.peopleServ.updateProfileImage(formData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.memberProfileForm.reset();
          this.isBusy = false;
          this.gotoView('next');
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.memberProfileForm.reset();
        }
      );
    }
  }
  onUpdatePersonalInfo() {
    this.isBusy = true;
    if (this.updatePersonalInfoForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updatePersonalInfoForm.valid) {
      //Make api call here...
      this.peopleServ.addPersonalInfo(this.updatedFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          // this.updatePersonalInfoForm.reset();
          this.isBusy = false;
          this.gotoView('next');
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          // this.updatePersonalInfoForm.reset();
        }
      );
    }
  }
  onUpdateProfile() {
    this.isBusy = true;
    const formData = new FormData();
    formData.append('profile', this.updateProfileForm.get('profile').value);
    formData.append('member_id', this.updateProfileForm.get('member_id').value);

    if (this.updateProfileForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateProfileForm.valid) {
      //Make api call here...
      this.peopleServ.updateProfileImage(formData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.isBusy = false;
          this.gotoView('next');
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
}
