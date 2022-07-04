import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
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
import { EventsService } from 'src/app/portal/services/events.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  evangelismList: any[] = [];
  _memberList: any[] = [];
  memberItems: any[] = [];
  filteredMembers: any[] = [];
  _eventId: any;
  _files: any[] = [];
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  validate: boolean = false;
  _pathStatus = getCompletedStatus;
  compareFunc = compareObjects;
  _formateDate = formatDate;
  _daysOfWeek = getDays;
  repeatMode: string[] = ['weekly', 'monthly', 'annually'];
  typeOfEvent: string[] = ['vigil', 'praise', 'conference', 'convention', 'wedding', 'others'];

  public eventForm: FormGroup = new FormGroup({});
  public updateEventForm: FormGroup = new FormGroup({});
  constructor(
    private peopleServ: PeopleService,
    private evtsService: EventsService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.eventForm = this.fb.group({
      name: [null, Validators.required],
      type: [null],
      organizer: [null],
      location_name: [null],
      location_address: [null],
      start_date: [null],
      end_date: [null],
      participant_size: [null],
      repeat: [null],
      comment: [null],
      image: [null],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getMembers();
  }

  gotoBack() {
    this._location.back();
  }

  get eventFormValue(): any {
    return this.eventForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateEventForm.getRawValue();
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x.user.first_name);
    }
  }
  get startDateVal() {
    if (this.queryString !== 'edit') {
      return this.eventForm.get('start_date').value;
    }
    return this.updateEventForm.get('start_date').value;
  }
  get endDateVal() {
    if (this.queryString !== 'edit') {
      return this.eventForm.get('end_date').value;
    }
    return this.updateEventForm.get('end_date').value;
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
        this._eventId = params.id;
        this.getEventDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/event/all']);
    }
  }
  getEventDetails() {
    if (this._eventId !== undefined) {
      this.evtsService
        .fetchAnEvents(this._eventId)
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
    if (this.queryString == 'edit' && this._eventId !== undefined) {
      this.updateEventForm = this.fb.group({
        name: [this.itemDetails.name, Validators.required],
        start_date: [this.itemDetails.start_date],
        end_date: [this.itemDetails.end_date],
        organizer: [this.itemDetails.organizer],
        location_name: [this.itemDetails.location_name],
        location_address: [this.itemDetails.location_address],
        address: [this.itemDetails.address],
        participant_size: [this.itemDetails.participant_size],
        repeat: [this.itemDetails.repeat],
        image: [this.itemDetails.image],
        comment: [this.itemDetails.comment],
        type: [this.itemDetails.type],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;

    if (this.eventForm.invalid) {
      this.isBusy = false;
      return;
    }
    const eventFormData = new FormData();
      eventFormData.append('name', this.eventForm.get('name').value);
      eventFormData.append('start_date', this.eventForm.get('start_date').value);
      eventFormData.append('end_date', this.eventForm.get('end_date').value);
      eventFormData.append('organizer', this.eventForm.get('organizer').value);
      eventFormData.append('location_name', this.eventForm.get('location_name').value);
      eventFormData.append('location_address', this.eventForm.get('location_address').value);
      eventFormData.append('participant_size', this.eventForm.get('participant_size').value);
      eventFormData.append('repeat', this.eventForm.get('repeat').value);
      eventFormData.append('image', this.eventForm.get('image').value);
      eventFormData.append('type', this.eventForm.get('type').value);
      eventFormData.append('comment', this.eventForm.get('comment').value);
      //Make api call here...
      this.evtsService.addEvent(eventFormData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/events']);
          this.eventForm.reset();
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
          this.eventForm.reset();
        }
      );
  }
  imageDisplay
  onImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.eventForm.patchValue({ image: file });
      this.eventForm.get('image').updateValueAndValidity();
    }
  }

  getChildValue(val?: any, _query?: any, formType?: any) {
    this.addToFormControl(val, _query);
    console.log(val, _query)
  }
  addToFormControl(val: any, identifier?: any, create?: any) {
    console.log(val, identifier)
    switch (val !== null && identifier) {
      case (identifier = 'fileUpdate'):
        var imgUrl;

        if (create && create == 'create') {
          imgUrl = this.eventForm.get('image') as FormControl
        } else {
          imgUrl = this.updateEventForm.get('image') as FormControl
        }
        return imgUrl.setValue(val);

      default:
        return;
    }
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updateEventForm.invalid) {
      this.isBusy = false;
      return;
    }

    const updateEventFormData = new FormData();
      updateEventFormData.append('name', this.updateEventForm.get('name').value);
      updateEventFormData.append('start_date', this.updateEventForm.get('start_date').value);
      updateEventFormData.append('end_date', this.updateEventForm.get('end_date').value);
      updateEventFormData.append('organizer', this.updateEventForm.get('organizer').value);
      updateEventFormData.append('location_name', this.updateEventForm.get('location_name').value);
      updateEventFormData.append('location_address', this.updateEventForm.get('location_address').value);
      updateEventFormData.append('participant_size', this.updateEventForm.get('participant_size').value);
      updateEventFormData.append('repeat', this.updateEventForm.get('repeat').value);
      updateEventFormData.append('image', this.updateEventForm.get('image').value);
      updateEventFormData.append('type', this.updateEventForm.get('type').value);
      updateEventFormData.append('comment', this.updateEventForm.get('comment').value);
      //Make api call here...
      this.evtsService
        .updateEvent(updateEventFormData, this._eventId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.updateEventForm.reset();
            this.router.navigate(['/portal/events']);
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
            this.updateEventForm.reset();
          }
        );
  }

}
