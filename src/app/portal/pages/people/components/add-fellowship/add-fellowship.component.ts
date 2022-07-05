import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-add-fellowship',
  templateUrl: './add-fellowship.component.html',
  styleUrls: ['./add-fellowship.component.scss'],
})
export class AddFellowshipComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  fellowshipList: any[] = [];
  _memberList: any[] = [];
  memberItems: any[] = [];
  filteredMembers: any[] = [];
  _fellowshipId: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;

  _pathStatus = getCompletedStatus;
  compareFunc = compareObjects;
  _formateDate = formatDate;
  _daysOfWeek = getDays;

  public fellowshipForm: FormGroup = new FormGroup({});
  public updatefellowshipForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.fellowshipForm = this.fb.group({
      name: [null, Validators.required],
      meeting_day: [null],
      address: [null],
      nearest_bus_stop: [null],
      leader_id: [null],
      assistant_id: [null],
      secretary_id: [null],
      treasurer_id: [null],
      comment: [null],
      members_to_add: [[]],
      date_of_creation: [null],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
  }
  ngAfterViewInit() {
    this.getMembers();
  }
  gotoBack() {
    this._location.back();
  }

  get fellowshipFormValue(): any {
    return this.fellowshipForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updatefellowshipForm.getRawValue();
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0) {
      return this.memberItems.slice(0, 5).map((x: any) => x?.user?.first_name);
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
  getChildValue(val?: any, _query?: any) {
    this.addToFormControl(val, _query);
  }
  addToFormControl(val: any, identifier?: any) {
    switch (val !== null && identifier) {
      case (identifier = 'fileUpdate'):
        var imgUrl = this.updatefellowshipForm.get('profile') as FormControl;
        return imgUrl.setValue(val);

      default:
        return;
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
        this._fellowshipId = params.id;
        this.getFellowshipDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/people/house-fellowship']);
    }
  }
  getFellowshipDetails() {
    if (this._fellowshipId !== undefined) {
      this.peopleServ
        .fetchDetails(this._fellowshipId, 'fellowships', 'show')
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data;
          this.filteredMembers = this.itemDetails['members'].map(
            (x: any) => x.member
          );
          this.memberItems = this.filteredMembers;
          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._fellowshipId !== undefined) {
      this.updatefellowshipForm = this.fb.group({
        name: [this.itemDetails.name, Validators.required],
        meeting_day: [this.itemDetails?.meeting_day],
        address: [this.itemDetails?.address],
        nearest_bus_stop: [this.itemDetails?.nearest_bus_stop],
        leader_id: [this.itemDetails?.leader?.member?.id],
        assistant_id: [this.itemDetails?.assistant?.member?.id],
        secretary_id: [this.itemDetails?.secretary?.member?.id],
        treasurer_id: [this.itemDetails?.treasurer?.member?.id],
        comment: [this.itemDetails?.comment],
        members_to_add: [this.filteredMembers],
        date_of_creation: [this.itemDetails?.date_of_creation],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.fellowshipForm.controls['members_to_add'].value !== null) {
      ids = this.fellowshipForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.fellowshipForm.patchValue({
      members_to_add: ids,
    });

    if (this.fellowshipForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.fellowshipForm.valid) {
      //Make api call here...
      this.peopleServ.addFellowship(this.fellowshipFormValue).subscribe(
        ({ message, data }) => {
          this._fellowshipId = data.id;
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/people/house-fellowship']);
          this.fellowshipForm.reset();
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
          this.fellowshipForm.reset();
        }
      );
    }
  }
  onUpdateFellowship() {
    this.isBusy = true;
    let ids: any;
    if (this.updatefellowshipForm.controls['members_to_add'].value !== null) {
      ids = this.updatefellowshipForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.updatefellowshipForm.patchValue({
      members_to_add: ids,
    });
    if (this.updatefellowshipForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updatefellowshipForm.valid) {
      //Make api call here...
      this.peopleServ
        .updateFellowship(this.updatedFormValue, this._fellowshipId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.fellowshipForm.reset();
            this.router.navigate(['/portal/people/house-fellowship']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.fellowshipForm.reset();
          }
        );
    }
  }
}
