import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { compareObjects, setMaxDate } from 'src/app/shared/_helperFunctions';
import { PeopleService } from 'src/app/portal/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { ObservableInput, throwError } from 'rxjs';
import { GroupsService } from 'src/app/portal/services/groups.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('membersAll') membersAll: any;
  @ViewChild('membersSelect') membersSelect: any;
  @ViewChild('membersAll_') membersAll_: any;
  @ViewChild('membersSelect_') membersSelect_: any;
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  _memberList: any[] = [];
  memberItems: any[] = [];
  memberItems_: any[] = [];
  filteredMembers: any[] = [];
  _groupId: any;
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  validate: boolean = false;
  maxDate: any;
  compareFunc = compareObjects;
  _setMaxDate = setMaxDate;

  public groupForm: FormGroup = new FormGroup({});
  public groupFormUpdate: FormGroup = new FormGroup({});
  constructor(
    private groupService: GroupsService,
    private peopleService: PeopleService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.groupForm = this.fb.group({
      name: [null, Validators.required],
      date_created: [null],
      date_dissolved: [null],
      roles: this.fb.group({
        leader: [null, Validators.required],
      }),
      description: [null],
      comment: [null],
      members_to_add: [[]],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getMembers();
    this.maxDate = this._setMaxDate();
  }
  ngAfterViewInit() {}
  gotoBack() {
    this._location.back();
  }

  get groupFormValue(): any {
    return this.groupForm.getRawValue();
  }
  get updatedFormValue(): any {
    return this.groupFormUpdate.getRawValue();
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x.user.first_name);
    }
  }
  get stripedObjValue_() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 5).map((x: any) => x?.user?.first_name);
    }
  }
  get dateCreatedValue() {
    if (this.queryString !== 'edit') {
      return this.groupForm.get('date_created').value;
    }
    return this.groupFormUpdate.get('date_created').value;
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

  getMembers() {
    this._memberList = [];
    this.peopleService.fetchAll('members', this.currentPage + 1).subscribe(
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
        this._groupId = params.id;
        this.getDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/more/group']);
    }
  }
  getDetails() {
    if (this._groupId !== undefined) {
      this.groupService
        .fetchAllGroups(this.currentPage + 1)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { data } = res;
          this.itemDetails = data.filter((x) => x.id == this._groupId);
          if (this.itemDetails[0].members.length !== 0) {
            this.filteredMembers = this.itemDetails[0].members
              .filter((x: any) => x.member !== null)
              .map((a: any) => a.member);
            this.memberItems = this.filteredMembers;
          } else {
            this.memberItems = this._memberList;
          }

          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    if (this.queryString == 'edit' && this._groupId !== undefined) {
      this.groupFormUpdate = this.fb.group({
        name: [this.itemDetails[0]?.name, Validators.required],
        date_created: [this.itemDetails[0]?.date_created, Validators.required],
        date_dissolved: [this.itemDetails[0]?.date_created],
        roles: this.fb.group({
          leader: [this.itemDetails[0].roles?.leader?.member?.id],
        }),
        description: [this.itemDetails[0]?.description],
        comment: [this.itemDetails[0]?.comment],
        members_to_add: [this.filteredMembers],
        members_to_remove: [[]],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.groupForm.controls['members_to_add'].value !== null) {
      ids = this.groupForm.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.groupForm.patchValue({
      members_to_add: ids,
    });

    if (this.groupForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.groupForm.valid) {
      //Make api call here...
      this.groupService.addGroup(this.groupFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/more/group']);
          this.groupForm.reset();
          this.isBusy = false;
        },
        (error) => {
          this.isBusy = false;
          error.split(',').map((x: any) => {
            this.toastr.error(x, 'Message', {
              timeOut: 5000,
            });
          });
        },
        () => {
          this.isBusy = false;
          this.groupForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    let ids: any;
    let ids_: any;
    if (this.groupFormUpdate.controls['members_to_add'].value !== null) {
      ids = this.groupFormUpdate.controls['members_to_add'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    if (this.groupFormUpdate.controls['members_to_remove'].value !== null) {
      ids_ = this.groupFormUpdate.controls['members_to_remove'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.groupFormUpdate.patchValue({
      members_to_add: ids,
      members_to_remove: ids_,
    });
    if (this.groupFormUpdate.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.groupFormUpdate.valid) {
      //Make api call here...
      this.groupService
        .updateGroup(this.updatedFormValue, this._groupId)
        .subscribe(
          ({ message, data }) => {
            this.toastr.success(message, 'Message');
            this.isBusy = false;
            this.groupFormUpdate.reset();
            this.router.navigate(['/portal/more/group']);
          },
          (error) => {
            this.isBusy = false;
            error.split(',').map((x: any) => {
              this.toastr.error(x, 'Message', {
                timeOut: 5000,
              });
            });
          },
          () => {
            this.isBusy = false;
            this.groupFormUpdate.reset();
          }
        );
    }
  }
}
