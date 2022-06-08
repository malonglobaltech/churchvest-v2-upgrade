import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  compareObjects,
  formatDate,
  getCompletedStatus,
  getDays,
} from 'src/app/shared/_helperFunctions';
import { PeopleService } from 'src/app/portal/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { ObservableInput, throwError } from 'rxjs';

@Component({
  selector: 'app-add-first-timers',
  templateUrl: './add-first-timers.component.html',
  styleUrls: ['./add-first-timers.component.scss'],
})
export class AddFirstTimersComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  _memberList: any[] = [];
  memberItems: any[] = [];
  _prayers: any[] = [];
  _prayer: string = '';
  filteredMembers: any[] = [];
  _id: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  _val: boolean = false;
  validate: boolean = false;
  compareFunc = compareObjects;

  public form: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null],
      phone: [null],
      gender: [null],
      date_of_birth: [null],
      country: [null],
      residential_area: [null],
      address: [null],
      nearest_bus_stop: [null],
      relationship: [null],
      date_of_marriage: [null],
      occupation: [null],
      follow_up_team: [[null]],
    });
  }
  ngOnInit(): void {
    this.getRoutes();
    this.getMembers();
  }
  ngAfterViewInit() {}
  gotoBack() {
    this._location.back();
  }

  get formRawValue(): any {
    return this.form.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateForm.getRawValue();
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x.user.first_name);
    }
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.select.options._results.map((item) => {
        item.select();
      });
    } else {
      this.select.options._results.map((item) => {
        item.deselect();
      });
    }
  }
  handleMembersChange(event: any) {
    let result = event.source._value.filter((t) => t);
    this.memberItems = result;
  }
  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.select.value.length == this._memberList.length) {
      this.allSelected.select();
    }
  }

  getMembers() {
    this._memberList = [];
    this.peopleServ
      .fetchAll('members', this.currentPage + 1, this.pageSize)
      .subscribe(
        (res: any) => {
          const { data } = res;
          this._memberList = data;
        },
        (errors) => {
          if (errors) {
            this._memberList = [];
          }
        }
      );
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._id = params.id;
        this.getDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/people/first-timers']);
    }
  }
  getDetails() {
    if (this._id !== undefined) {
      this.peopleServ
        .fetchDetails(this._id, 'members/member', '')
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
    this.updateForm = this.fb.group({
      name: [
        `${this.itemDetails.user.first_name} ${this.itemDetails.user.last_name}`,
        Validators.required,
      ],
      first_name: [this.itemDetails?.user?.first_name, Validators.required],
      last_name: [this.itemDetails?.user?.last_name, Validators.required],
      email: [this.itemDetails?.user?.email],
      phone: [this.itemDetails?.user?.phone],
      date_of_birth: [this.itemDetails.user?.details?.personal?.date_of_birth],
      country: [this.itemDetails.user?.details?.personal.country],
      nearest_bus_stop: [
        this.itemDetails.user?.details?.personal.nearest_bus_stop,
      ],
      residential_area: [
        this.itemDetails.user?.details?.personal.residential_area,
      ],
      relationship: [this.itemDetails.user?.details?.personal.relationship],
      date_of_marriage: [
        this.itemDetails.user?.details?.personal.date_of_marriage,
      ],
      occupation: [this.itemDetails?.details?.other?.occupation],
      address: [this.itemDetails.user?.details?.personal.address],
      gender: [this.itemDetails.user?.details?.personal.gender],
      member_id: [parseInt(this.itemDetails.id)],
    });
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.form.controls['follow_up_team'].value[0] == null) {
      this.isBusy = false;
      this.toastr.error('Select follow up team', 'Message');
      return;
    }
    if (this.form.controls['follow_up_team'].value[0] !== null) {
      ids = this.form.controls['follow_up_team'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }

    this.form.patchValue({
      follow_up_team: ids,
    });

    if (this.form.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.form.valid) {
      //Make api call here...
      this.peopleServ.addFirstTimer(this.formRawValue).subscribe(
        ({ message, data }) => {
          this._id = data.id;
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/people/first-timers']);
          this.form.reset();
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
          this.form.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;

    if (this.updateForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateForm.valid) {
      //Make api call here...
      this.peopleServ.addPersonalInfo(this.updatedFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.isBusy = false;
          this.updateForm.reset();
          this.router.navigate(['/portal/people/first-timers']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updateForm.reset();
        }
      );
    }
  }
}
