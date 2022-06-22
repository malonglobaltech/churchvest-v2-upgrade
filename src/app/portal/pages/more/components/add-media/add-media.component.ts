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
import { MediaService } from 'src/app/portal/services/media.service';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss'],
})
export class AddMediaComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  _id: number;
  _files: any[] = [];
  fileData: any;
  _val: boolean = false;
  _selectedMediaType: string = 'message';

  compareFunc = compareObjects;

  public mediaForm: FormGroup = new FormGroup({});
  public updateConvertForm: FormGroup = new FormGroup({});
  constructor(
    private mediaService: MediaService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.mediaForm = this.fb.group({
      type: [this._selectedMediaType, Validators.required],
      title: [null, Validators.required],
      owner_name: [null],
      resources: this.fb.array([]),
      upload: [null],
      track: [null],
      tracks: [[]],
      price: [null],
      account_id: [null],
      display_web: ['1'],
      display_mobile: ['1'],
      comment: [null],
    });
  }
  mediaTypeList = ['album', 'book', 'message', 'track'];
  ngOnInit(): void {
    this.getRoutes();
  }
  ngAfterViewInit() {}
  gotoBack() {
    this._location.back();
  }

  get mediaFormValue(): any {
    return this.mediaForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.updateConvertForm.getRawValue();
  }
  get resourceValues(): FormArray {
    return this.mediaForm.get('resources') as FormArray;
  }
  handleMediaTypeChange(val: any) {
    this._selectedMediaType = val.value;
  }
  getChildValue(val?: any, _query?: any) {
    this.addToFormControl(val, _query);
  }

  addToFormControl(val: any, identifier?: any) {
    switch (val !== null && identifier) {
      case (identifier = 'file'):
        return this.resourceValues.push(new FormControl(val));
      case (identifier = 'doc'):
        var docUpload = this.mediaForm.get('upload') as FormControl;
        return docUpload.setValue(val);

      default:
        return;
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._id = params.id;
        this.getMediaDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/more/media']);
    }
  }
  getMediaDetails() {
    if (this._id !== undefined) {
      this.mediaService
        .fetchMediaDetails(this._id)
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

    if (this.mediaForm.invalid) {
      this.isBusy = false;
      return;
    }
    this.mediaForm.patchValue({
      display_web: parseInt(this.mediaForm.controls['display_web'].value),
      display_mobile: parseInt(this.mediaForm.controls['display_mobile'].value),
    });

    const formData = new FormData();
    formData.append('type', this.mediaForm.get('type').value);
    formData.append('title', this.mediaForm.get('title').value);
    formData.append('owner_name', this.mediaForm.get('owner_name').value);
    for (let file of this.mediaForm.get('resources').value) {
      formData.append('resources[]', file);
    }
    formData.append('upload', this.mediaForm.get('upload').value);
    formData.append('display_web', this.mediaForm.get('display_web').value);
    formData.append(
      'display_mobile',
      this.mediaForm.get('display_mobile').value
    );
    formData.append('comment', this.mediaForm.get('comment').value);
    if (this.mediaForm.valid) {
      //Make api call here...
      this.mediaService.uploadMedia(formData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/more/media']);
          this.mediaForm.reset();
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
          this.mediaForm.reset();
        }
      );
    }
  }
}
