import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  isBusy: boolean = false;
  screen: number = 1;
  public memberProfileForm: FormGroup = new FormGroup({});
  public updateMemberProfileForm: FormGroup = new FormGroup({});
  constructor(private _location: Location, private fb: FormBuilder) {
    this.memberProfileForm = this.fb.group({
      profile: [''],
    });
  }

  ngOnInit(): void {}
  gotoBack() {
    this._location.back();
  }
  stepperPath = [
    {
      title: 'Personal Information',
      isActive: true,
    },
    {
      title: 'Membership Information',
      isActive: false,
    },
    {
      title: 'Service Information',
      isActive: false,
    },
    {
      title: 'Other Information',
      isActive: false,
    },
  ];

  gotoView(screenType?: string, screenIndex?: number) {
    if (screenType === 'next') {
      this.screen = this.screen + 1;
    }
    if (screenType === 'prev') {
      this.screen = this.screen - 1;
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
        var imgUrl = this.updateMemberProfileForm.get('profile') as FormControl;
        return imgUrl.setValue(val);

      default:
        return;
    }
  }
}
