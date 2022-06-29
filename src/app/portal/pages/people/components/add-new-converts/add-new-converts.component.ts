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
  selector: 'app-add-new-converts',
  templateUrl: './add-new-converts.component.html',
  styleUrls: ['./add-new-converts.component.scss'],
})
export class AddNewConvertsComponent implements OnInit {
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
  _convertId: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  _val: boolean = false;
  validate: boolean = false;
  compareFunc = compareObjects;

  public convertForm: FormGroup = new FormGroup({});
  public updateConvertForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.convertForm = this.fb.group({
      name: [null, Validators.required],
      email: [null],
      phone: [null],
      is_member: [false],
      is_rededication: [false],
      service_day: [null],
      prayer_requests: [[]],
      follow_up_team: [[null]],
      members_id: [null],
      event_id: [],
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

  get convertFormValue(): any {
    return this.convertForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateConvertForm.getRawValue();
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
        this._convertId = params.id;
        this.getConvertDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/people/new-convert']);
    }
  }
  getConvertDetails() {
    if (this._convertId !== undefined) {
      this.peopleServ
        .fetchDetails(this._convertId, 'members/member', '')
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
    this.updateConvertForm = this.fb.group({
      name: [
        `${this.itemDetails.user.first_name} ${this.itemDetails.user.last_name}`,
        Validators.required,
      ],

      email: [this.itemDetails.user.email],
      phone: [this.itemDetails.user.phone],
      service_day: [this.itemDetails.details.convert?.service_day],

      event_id: [],
    });
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;

    if (this.convertForm.controls['follow_up_team'].value[0] !== null) {
      ids = this.convertForm.controls['follow_up_team'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }

    this.convertForm.patchValue({
      follow_up_team: ids,
      prayer_requests: this._prayers,
    });

    if (this.convertForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.convertForm.valid) {
      //Make api call here...
      this.peopleServ.addConvert(this.convertFormValue).subscribe(
        ({ message, data }) => {
          this._convertId = data.id;
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/people/new-convert']);
          this.convertForm.reset();
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
          this.convertForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updateConvertForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateConvertForm.valid) {
      //Make api call here...
      this.peopleServ
        .updateConvert(this.updatedFormValue, this._convertId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.updateConvertForm.reset();
            this.router.navigate(['/portal/people/new-convert']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.updateConvertForm.reset();
          }
        );
    }
  }
  onPrayerChange(val) {
    this._prayer = val.target.value;
  }
  onAddPrayer() {
    this._prayers.push(this._prayer);
    this._prayer = '';

    if (this.queryString !== 'edit') {
      this.convertForm.controls['prayer_requests'].setValue('');
    } else {
      this.updateConvertForm.controls['prayer_requests'].setValue('');
    }
  }
  removeItem(item: string) {
    var index = this._prayers.indexOf(item);
    if (index > -1) {
      this._prayers.splice(index, 1);
    }
    return this._prayers;
  }
}
