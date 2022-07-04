import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { compareObjects } from 'src/app/shared/_helperFunctions';
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
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  _memberList: any[] = [];
  memberItems: any[] = [];
  filteredMembers: any[] = [];
  _groupId: any;
  fileData: any;
  pageSize: number = 50;
  currentPage = 0;
  validate: boolean = false;
  compareFunc = compareObjects;

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
      members_id: [[]],
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
            this.filteredMembers = this.itemDetails[0].members.map(
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
        members_id: [this.filteredMembers],
      });
    }
  }
  onSubmit() {
    this.isBusy = true;
    let ids: any;
    if (this.groupForm.controls['members_id'].value !== null) {
      ids = this.groupForm.controls['members_id'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.groupForm.patchValue({
      members_id: ids,
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
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
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
    if (this.groupFormUpdate.controls['members_id'].value !== null) {
      ids = this.groupFormUpdate.controls['members_id'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => a.id);
    }
    this.groupFormUpdate.patchValue({
      members_id: ids,
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
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
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
