import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
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
import { DepartmentService } from 'src/app/portal/services/department.service';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  @ViewChild('membersAll') membersAll: any;
  @ViewChild('membersSelect') membersSelect: any;
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  evangelismList: any[] = [];
  _memberList: any[] = [];
  memberItems: any[] = [];
  filteredMembers: any[] = [];
  _departmentId: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  validate: boolean = false;
  compareFunc = compareObjects;
  _daysOfWeek = getDays;
  notificationChannel: string[] = ['email', 'phone'];
  notificationUnit: string[] = ['seconds', 'minutes', 'hours', 'week'];
  notificationPeriod: number[] = [10, 20];

  public departmentForm: FormGroup = new FormGroup({});
  public updateDepartmentForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private deptService: DepartmentService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.departmentForm = this.fb.group({
      name: [null, Validators.required],
      start_time: [null],
      end_time: [null],
      roles: this.fb.group({
        leader: [null, Validators.required],
        assistant: [null],
        secretary: [null],
      }),
      meeting_days: [[]],
      notify_period: [null, Validators.required],
      notify_unit: [null],
      notify_channel: [null, Validators.required],
      date_formed: [null, Validators.required],
      description: [null],
      members_to_add: [[]],
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

  get departmentFormValue(): any {
    return this.departmentForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateDepartmentForm.getRawValue();
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x?.user?.first_name);
    }
  }
  get startDateVal() {
    if (this.queryString !== 'edit') {
      return this.departmentForm.get('start_time').value;
    }
    return this.updateDepartmentForm.get('start_time').value;
  }
  get endDateVal() {
    if (this.queryString !== 'edit') {
      return this.departmentForm.get('end_time').value;
    }
    return this.updateDepartmentForm.get('end_time').value;
  }
  toggleAllSelection(allSlc: any, slc: any) {
    if (allSlc.selected) {
      slc.options._results.map((item) => {
        item.select();
      });
    } else {
      slc.options._results.map((item) => {
        item.deselect();
      });
    }
  }
  toggleOne(allSlc: any, slc: any) {
    if (allSlc.selected) {
      allSlc.deselect();
      return false;
    }
    if (
      slc == this.membersSelect &&
      slc.value.length == this._memberList.length
    ) {
      allSlc.select();
    }
  }

  handleMembersChange(event: any) {
    let result = event.source._value.filter((t) => t);
    this.memberItems = result;
  }
  onDateChange() {
    var endDate = new Date(this.endDateVal);
    var startDate = new Date(this.startDateVal);
    if (endDate.getTime() < startDate.getTime()) {
      this.validate = true;
    } else {
      this.validate = false;
    }
  }
  getMembers() {
    this._memberList = [];
    this.peopleServ.fetchAll('members', this.currentPage + 1).subscribe(
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
        this._departmentId = params.id;
        this.getDepartmentDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/department/all']);
    }
  }
  getDepartmentDetails() {
    if (this._departmentId !== undefined) {
      this.deptService
        .fetchAllDepartment()
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data.filter((x) => x.id == this._departmentId);

          if (this.itemDetails[0]?.members.length !== 0) {
            this.filteredMembers = this.itemDetails[0]?.members.map(
              (x: any) => x.member
            );
            console.log(this.filteredMembers);

            this.memberItems = this.filteredMembers;
          } else {
            this.memberItems = this._memberList;
          }

          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    this.updateDepartmentForm = this.fb.group({
      name: [this.itemDetails[0]?.name, Validators.required],
      start_time: [this.itemDetails[0]?.start_time],
      end_time: [this.itemDetails[0]?.end_time],
      roles: this.fb.group({
        leader: [this.itemDetails[0]?.roles?.leader?.member?.id],
        assistant: [this.itemDetails[0]?.roles?.assistant?.member?.id],
        secretary: [this.itemDetails[0]?.roles?.secretary?.member?.id],
      }),
      meeting_days: [this.itemDetails[0]?.meeting_days],
      notify_periods: [this.itemDetails[0]?.notify_periods],
      notify_unit: [this.itemDetails[0]?.notify_unit],
      notify_channel: [this.itemDetails[0]?.notify_channel],
      date_formed: [this.itemDetails[0]?.date_formed],
      description: [this.itemDetails[0]?.description],
      members_to_add: [this.filteredMembers],
    });
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.departmentForm.controls['members_to_add'].value !== null) {
      ids = this.departmentForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.departmentForm.patchValue({
      members_to_add: ids,
    });

    if (this.departmentForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.departmentForm.valid) {
      //Make api call here...
      this.deptService.addDepartment(this.departmentFormValue).subscribe(
        ({ message, data }) => {
          this._departmentId = data.id;
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/department/all']);
          this.departmentForm.reset();
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
          this.departmentForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    let ids: any;
    if (this.updateDepartmentForm.controls['members_to_add'].value !== null) {
      ids = this.updateDepartmentForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.updateDepartmentForm.patchValue({
      members_to_add: ids,
    });

    if (this.updateDepartmentForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateDepartmentForm.valid) {
      //Make api call here...
      this.deptService
        .updateDepartment(this.updatedFormValue, this._departmentId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.departmentForm.reset();
            this.router.navigate(['/portal/department/all']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.departmentForm.reset();
          }
        );
    }
  }
}
