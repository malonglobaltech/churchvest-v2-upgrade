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
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
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
  _pathStatus = getCompletedStatus;
  compareFunc = compareObjects;
  _formateDate = formatDate;
  _daysOfWeek = getDays;
  notificationChannel: string[] = ['email', 'phone'];
  notificationUnit: string[] = ['seconds', 'minutes', 'hours', 'week'];
  notificationPeriod: string[] = ['10', '20'];
  

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
      notify_periods: [[], Validators.required],
      notify_unit: [null, ],
      notify_channel: [null, Validators.required],
      date_formed: [null, Validators.required],
      description: [null],
      members_id: [[]],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getMembers();
  }
  ngAfterViewInit() {
    this.setDateFunc();
  }
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
      return this.memberItems.slice(0, 5).map((x: any) => x.user.first_name);
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
        .fetchDepartmentDetails(this._departmentId,  'show')
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data;
          console.log('itemDetails', data)
          // if (this.itemDetails.members.member !== undefined) {
          //   this.filteredMembers = this.itemDetails.members.map(
          //     (x: any) => x.member
          //   );
          //   this.memberItems = this.filteredMembers;
          // } else {
          //   this.memberItems = this._memberList;
          // }

          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._departmentId !== undefined) {
      this.updateDepartmentForm = this.fb.group({
        name: [this.itemDetails.name, Validators.required],
        start_time: [this.itemDetails.start_time],
        end_time: [this.itemDetails.end_time],
        roles: this.fb.group({
          leader: [this.itemDetails.leader],
        }),
        meeting_days: [this.itemDetails.meeting_days],
        notify_periods: [this.itemDetails.notify_periods],
        notify_unit: [this.itemDetails.notify_unit],
        notify_channel: [this.itemDetails.notify_channel],
        date_formed: [this.itemDetails.date_formed],
        description: [this.itemDetails.description],
        members_id: [this.filteredMembers],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.departmentForm.controls['members_id'].value !== null) {
      ids = this.departmentForm.controls['members_id'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.departmentForm.patchValue({
      members_id: ids,
    });
    
    if (this.departmentForm.controls['start_time'].value) {
    }

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
    console.log('this.updateDepartmentForm', this.updateDepartmentForm)
    this.isBusy = true;
    let ids: any;
    // if (this.updateDepartmentForm.controls['members'] !== null) {
    //   ids = this.updateDepartmentForm.controls['members']
    //     .filter((x: any) => x !== 0)
    //     .map((a: any) => a.id);
    // }
    this.updateDepartmentForm.patchValue({
      members_id: ids,
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
  setDateFunc() {
    var dtToday = new Date();
    var month: any = dtToday.getMonth() + 1;
    var day: any = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    if (this.queryString !== 'edit') {
      this.renderer.setAttribute(this.txtDate.nativeElement, 'min', maxDate);
    }
  }
}
