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

@Component({
  selector: 'app-add-evangelism',
  templateUrl: './add-evangelism.component.html',
  styleUrls: ['./add-evangelism.component.scss'],
})
export class AddEvangelismComponent implements OnInit {
  @ViewChild('membersAll') membersAll: any;
  @ViewChild('membersSelect') membersSelect: any;
  @ViewChild('membersAll_') membersAll_: any;
  @ViewChild('membersSelect_') membersSelect_: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  evangelismList: any[] = [];
  _memberList: any[] = [];
  memberItems: any[] = [];
  memberItems_: any[] = [];
  filteredMembers: any[] = [];
  _evangelismId: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  validate: boolean = false;
  _pathStatus = getCompletedStatus;
  compareFunc = compareObjects;
  _formateDate = formatDate;
  _daysOfWeek = getDays;

  public evangelismForm: FormGroup = new FormGroup({});
  public updateEvangelismForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.evangelismForm = this.fb.group({
      name: [null, Validators.required],
      start_date: [null],
      end_date: [null],
      organizer: [null],
      location: [null],
      address: [null],
      city: [null],
      comment: [null],
      members_to_add: [[]],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getMembers();
  }

  gotoBack() {
    this._location.back();
  }

  get evangelismFormValue(): any {
    return this.evangelismForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateEvangelismForm.getRawValue();
  }

  get startDateVal() {
    if (this.queryString !== 'edit') {
      return this.evangelismForm.get('start_date').value;
    }
    return this.updateEvangelismForm.get('start_date').value;
  }
  get endDateVal() {
    if (this.queryString !== 'edit') {
      return this.evangelismForm.get('end_date').value;
    }
    return this.updateEvangelismForm.get('end_date').value;
  }

  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x?.user?.first_name);
    }
  }
  get stripedObjValue_() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems_.slice(0, 5).map((x: any) => x?.user?.first_name);
    }
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
  handleMembersChange(event: any, source: string) {
    switch (event.source._value !== null && source) {
      case (source = 'members_to_add'):
        return (this.memberItems = event.source._value.filter((t) => t));
      case (source = 'members_to_remove'):
        return (this.memberItems_ = event.source._value.filter((t) => t));
      default:
        return;
    }
  }
  toggleOne(allSlc: any, slc: any) {
    if (allSlc.selected) {
      allSlc.deselect();
      return false;
    }
    switch (slc.value !== null) {
      case slc == this.membersSelect &&
        slc.value.length == this._memberList.length:
        return allSlc.select();
      case slc == this.membersSelect_ &&
        slc.value.length == this._memberList.length:
        return allSlc.select();
      default:
        return;
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
        this._evangelismId = params.id;
        this.getEvangelismDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/people/evangelism']);
    }
  }
  getEvangelismDetails() {
    if (this._evangelismId !== undefined) {
      this.peopleServ
        .fetchDetails(this._evangelismId, 'evangelism', 'show')
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data;
          if (this.itemDetails.members !== undefined) {
            this.filteredMembers = this.itemDetails.members.map(
              (x: any) => x.member
            );
            this.memberItems = this.filteredMembers;
          } else {
            this.memberItems = this._memberList;
          }

          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._evangelismId !== undefined) {
      this.updateEvangelismForm = this.fb.group({
        name: [this.itemDetails.name, Validators.required],
        start_date: [this.itemDetails.start_date],
        end_date: [this.itemDetails.end_date],
        organizer: [this.itemDetails.organizer],
        location: [this.itemDetails.location],
        address: [this.itemDetails.address],
        city: [this.itemDetails.city],
        comment: [this.itemDetails.comment],
        members_to_add: [this.filteredMembers],
        members_to_remove: [[]],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.evangelismForm.controls['members_to_add'].value !== null) {
      ids = this.evangelismForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.evangelismForm.patchValue({
      members_to_add: ids,
    });

    if (this.evangelismForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.evangelismForm.valid) {
      //Make api call here...
      this.peopleServ.addEvangelism(this.evangelismFormValue).subscribe(
        ({ message, data }) => {
          this._evangelismId = data.id;
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/people/evangelism']);
          this.evangelismForm.reset();
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
          this.evangelismForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    let ids: any;
    let ids_: any;
    if (this.updateEvangelismForm.controls['members_to_add'].value !== null) {
      ids = this.updateEvangelismForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    if (
      this.updateEvangelismForm.controls['members_to_remove'].value !== null
    ) {
      ids_ = this.updateEvangelismForm.controls['members_to_remove'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.updateEvangelismForm.patchValue({
      members_to_add: ids,
      members_to_remove: ids_,
    });
    if (this.updateEvangelismForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updateEvangelismForm.valid) {
      //Make api call here...
      this.peopleServ
        .updateEvangelism(this.updatedFormValue, this._evangelismId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.updateEvangelismForm.reset();
            this.router.navigate(['/portal/people/evangelism']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.updateEvangelismForm.reset();
          }
        );
    }
  }
}
