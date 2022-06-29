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
import { catchError, filter } from 'rxjs/operators';
import { ObservableInput, throwError } from 'rxjs';
@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  queryString: string;
  pageSize: number = 50;
  currentPage = 0;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  memberList: any[] = [];
  _memberId: any;
  _files: any[] = [];
  fileData: any;
  _pathStatus = getCompletedStatus;
  public personalInfoForm: FormGroup = new FormGroup({});
  public updatePersonalInfoForm: FormGroup = new FormGroup({});
  public updateProfileImage: FormGroup = new FormGroup({});
  public updateServiceInfo: FormGroup = new FormGroup({});
  public updateOtherInfo: FormGroup = new FormGroup({});
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
    this.updateProfileImage = this.fb.group({
      member_id: [null],
      profile: [null, Validators.required],
    });
    this.updateServiceInfo = this.fb.group({
      member_id: [null],
      date_of_membership: [null, Validators.required],
    });
    this.updateOtherInfo = this.fb.group({
      member_id: [null],
      occupation: ['', Validators.required],
      comment: [''],
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
      case (identifier = 'fileUpdate'):
        var imgUrl = this.updateProfileImage.get('profile') as FormControl;

        return imgUrl.setValue(val);

      default:
        return;
    }
  }
  getMembers() {
    this.peopleServ.fetchAll('members', this.currentPage + 1).subscribe(
      (res: any) => {
        const { data, meta } = res;
        this.memberList = data;
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
        this.getMemberDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/people/members']);
    }
  }
  getMemberDetails() {
    if (this._memberId !== undefined) {
      this.peopleServ
        .fetchDetails(this._memberId, 'members/member', '')
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data;
          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._memberId !== undefined) {
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

      this.updateProfileImage = this.fb.group({
        member_id: [parseInt(this.itemDetails.id)],
        profile: [this.itemDetails?.profile],
      });
      this.updateServiceInfo = this.fb.group({
        member_id: [parseInt(this.itemDetails.id)],
        date_of_membership: [
          this.itemDetails['details']?.service?.date_of_membership,
          Validators.required,
        ],
      });
      this.updateOtherInfo = this.fb.group({
        member_id: [parseInt(this.itemDetails.id)],
        occupation: [
          this.itemDetails['details']?.other?.occupation,
          Validators.required,
        ],
        comment: [this.itemDetails['details']?.other?.comment],
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
          this.getMembers();
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
  onUpdateMemberInfo(query: string) {
    this.isBusy = true;

    if (query == 'profileImage') {
      if (this.queryString !== 'edit') {
        this.updateProfileImage.patchValue({
          member_id: parseInt(this._memberId),
        });
      }
      const formData = new FormData();
      formData.append('profile', this.updateProfileImage.get('profile').value);
      formData.append(
        'member_id',
        this.updateProfileImage.get('member_id').value
      );

      if (this.updateProfileImage.invalid) {
        this.isBusy = false;
        return;
      }
      if (this.updateProfileImage.valid) {
        //Make api call here...
        this.peopleServ.updateMember(formData, 'membership').subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.getMembers();
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
    if (query == 'serviceInfo') {
      if (this.queryString !== 'edit') {
        this.updateServiceInfo.patchValue({
          member_id: parseInt(this._memberId),
        });
      }
      if (this.updateServiceInfo.invalid) {
        this.isBusy = false;
        return;
      }
      if (this.updateServiceInfo.valid) {
        //Make api call here...
        this.peopleServ
          .updateMember(this.updateServiceInfo.getRawValue(), 'service')
          .subscribe(
            ({ message, data }) => {
              this.toastr.success(message, 'Message');
              this.isBusy = false;
              this.getMembers();
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
    if (query == 'otherInfo') {
      if (this.queryString !== 'edit') {
        this.updateOtherInfo.patchValue({
          member_id: parseInt(this._memberId),
        });
      }
      if (this.updateOtherInfo.invalid) {
        this.isBusy = false;
        return;
      }
      if (this.updateOtherInfo.valid) {
        //Make api call here...
        this.peopleServ
          .updateMember(this.updateOtherInfo.getRawValue(), 'other')
          .subscribe(
            ({ message, data }) => {
              this.toastr.success(message, 'Message');
              this.isBusy = false;
              this.getMembers();
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
}
