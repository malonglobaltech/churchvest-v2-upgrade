import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { DepartmentService } from 'src/app/portal/services/department.service';
import { GroupsService } from 'src/app/portal/services/groups.service';
import { MessagesService } from 'src/app/portal/services/messages.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
  @ViewChild('deptAll') deptAll: any;
  @ViewChild('convertAll') convertAll: any;
  @ViewChild('evangelismAll') evangelismAll: any;
  @ViewChild('fellowshipAll') fellowshipAll: any;
  @ViewChild('membersAll') membersAll: any;
  @ViewChild('firstTimerAll') firstTimerAll: any;
  @ViewChild('groupAll') groupAll: any;
  @ViewChild('convertSelect') convertSelect: any;
  @ViewChild('evangelismSelect') evangelismSelect: any;
  @ViewChild('fellowshipSelect') fellowshipSelect: any;
  @ViewChild('membersSelect') membersSelect: any;
  @ViewChild('firstTimerSelect') firstTimerSelect: any;
  @ViewChild('deptSelect') deptSelect: any;
  @ViewChild('groupSelect') groupSelect: any;
  @ViewChildren('_memsSelect') _memsSelect: QueryList<ElementRef>;

  pageSize: number = 50;
  currentPage = 0;
  _memberList: any[] = [];
  memberItems: any[] = [];
  _firstTimerList: any[] = [];
  firstTimerItems: any[] = [];
  _departmentList: any[] = [];
  departmentItems: any[] = [];
  _convertList: any[] = [];
  convertItems: any[] = [];
  _fellowshipList: any[] = [];
  fellowshipItems: any[] = [];
  _evangelismList: any[] = [];
  evangelismItems: any[] = [];
  _groupList: any[] = [];
  groupItems: any[] = [];
  _categoryItems: any[] = [];
  queryString: string;
  channel: string;
  isBusy: boolean = false;
  screen: number = 1;
  itemDetails: any;
  _id: number;
  _files: any[] = [];
  fileData: any;
  _isRegularSelected: boolean = true;
  compareFunc = compareObjects;

  public smsForm: FormGroup = new FormGroup({});
  public emailForm: FormGroup = new FormGroup({});
  constructor(
    private mediaService: MediaService,
    private peopleServ: PeopleService,
    private deptService: DepartmentService,
    private groupService: GroupsService,
    private messageService: MessagesService,
    private toastr: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.smsForm = this.fb.group({
      type: new FormControl({ value: 'sms', disabled: true }),
      from: new FormControl({ value: 'churchvest', disabled: true }),
      to: [[], [Validators.required]],
      subject: [null],
      regular_members: [[]],
      first_timer: [[]],
      department: [[]],
      new_convert: [[]],
      fellowship: [[]],
      evangelism: [[]],
      group: [[]],
      message: [null, Validators.required],
    });
    this.emailForm = this.fb.group({
      type: new FormControl({ value: 'email', disabled: true }),
      from: [null, [Validators.required, Validators.email]],
      to: [[], [Validators.required]],
      subject: [null, Validators.required],
      regular_members: [[]],
      first_timer: [[]],
      department: [[]],
      new_convert: [[]],
      fellowship: [[]],
      evangelism: [[]],
      group: [[]],
      message: [null, Validators.required],
    });
  }
  _categoryList = [
    'Regular Members',
    'First Timers',
    'Departments',
    'New Convert',
    'Fellowship',
    'Evangelism',
    'Groups',
  ];
  ngOnInit(): void {
    this.getRoutes();
    this.getRegularMembers();
    this.getAllByStatus('first_timer');
    this.getAllByStatus('convert');
    this.getAllDepartments();
    this.getFellowships();
    this.getEvangelism();
    this.getAlGroups();
  }
  ngAfterViewInit() {}
  gotoBack() {
    this._location.back();
  }

  get smsFormValue(): any {
    return this.smsForm.getRawValue();
  }
  get stripedDeptValue() {
    if (this._departmentList.length !== 0 && this._departmentList !== null) {
      return this.departmentItems.slice(0, 4).map((x: any) => x.name);
    }
  }
  get stripedDeptMembersValue() {
    if (this.departmentItems.length !== 0 && this.departmentItems !== null) {
      return this.departmentItems.map((x: any) =>
        x.members.map((y) => y.member.user.phone)
      );
    }
  }
  get stripedEvangelismValue() {
    if (this._evangelismList.length !== 0 && this._evangelismList !== null) {
      return this.evangelismItems.slice(0, 4).map((x: any) => x.name);
    }
  }
  get stripedFellowshipValue() {
    if (this._fellowshipList.length !== 0 && this._fellowshipList !== null) {
      return this.fellowshipItems.slice(0, 4).map((x: any) => x.name);
    }
  }
  get stripedGroupValue() {
    if (this._groupList.length !== 0 && this._groupList !== null) {
      return this.groupItems.slice(0, 4).map((x: any) => x.name);
    }
  }
  get stripedConvertValue() {
    if (this._convertList.length !== 0 && this._convertList !== null) {
      return this.convertItems.slice(0, 4).map((x: any) => x.user.first_name);
    }
  }
  get stripedObjValue() {
    if (this._memberList.length !== 0 && this._memberList !== null) {
      return this.memberItems.slice(0, 10).map((x: any) => x.user.first_name);
    }
  }
  get stripedFirstTimerValue() {
    if (this._firstTimerList.length !== 0 && this._firstTimerList !== null) {
      return this.firstTimerItems
        .slice(0, 5)
        .map((x: any) => x.user.first_name);
    }
  }
  get stripedCatItemsValue() {
    if (this._categoryList.length !== 0 && this._categoryList !== null) {
      return this._categoryItems.slice(0, 2).map((x: any) => x);
    }
  }
  checkStringsList(item: any) {
    switch (item) {
      case (item = 'Departments'):
        return true;
      case (item = 'Evangelism'):
        return true;
      case (item = 'Fellowship'):
        return true;
      case (item = 'Groups'):
        return true;
      default:
        return;
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
  toggleOne(allSlc: any, slc: any) {
    if (allSlc.selected) {
      allSlc.deselect();
      return false;
    }
    switch (slc.value !== null) {
      case slc == this.membersSelect &&
        slc.value.length == this._memberList.length:
        return allSlc.select();
      case slc == this.convertSelect &&
        slc.value.length == this._convertList.length:
        return allSlc.select();
      case slc == this.firstTimerSelect &&
        slc.value.length == this._firstTimerList.length:
        return allSlc.select();
      case slc == this.deptSelect &&
        slc.value.length == this._departmentList.length:
        return allSlc.select();
      case slc == this.evangelismSelect &&
        slc.value.length == this._evangelismList.length:
        return allSlc.select();
      case slc == this.fellowshipSelect &&
        slc.value.length == this._fellowshipList.length:
        return allSlc.select();
      case slc == this.groupSelect &&
        slc.value.length == this._groupList.length:
        return allSlc.select();
      default:
        return;
    }
  }

  handleCategoryChange(event: any) {
    this._categoryItems = event.value;
    if (
      this._categoryItems.includes('Regular Members') ||
      this._categoryItems.includes('First Timers') ||
      this._categoryItems.includes('New Convert')
    ) {
      this._isRegularSelected = false;
    } else {
      this._isRegularSelected = true;
    }
  }
  handleSelectionChange(event: any, source?: string) {
    switch (event.source._value !== null && source) {
      case (source = 'reg_member'):
        return (this.memberItems = event.source._value.filter((t) => t));
      case (source = 'first_timer'):
        return (this.firstTimerItems = event.source._value.filter((t) => t));
      case (source = 'department'):
        let res = (this.departmentItems = event.source._value.filter((t) => t));
        return res;
      case (source = 'evangelism'):
        return (this.evangelismItems = event.source._value.filter((t) => t));
      case (source = 'fellowship'):
        return (this.fellowshipItems = event.source._value.filter((t) => t));
      case (source = 'new_convert'):
        return (this.convertItems = event.source._value.filter((t) => t));
      case (source = 'group'):
        return (this.groupItems = event.source._value.filter((t) => t));
      default:
        return;
    }
  }
  getAllDepartments() {
    this._departmentList = [];
    this.deptService.fetchAllDepartment().subscribe(
      (res: any) => {
        const { data } = res;
        this._departmentList = data;
      },
      (errors) => {
        if (errors) {
          this._departmentList = [];
        }
      }
    );
  }
  getRegularMembers() {
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
  getAllByStatus(query?: string) {
    this._firstTimerList = [];
    this.peopleServ.fetchByStatus('members', query).subscribe(
      (res: any) => {
        const { data } = res;
        if (query == 'first_timer') {
          this._firstTimerList = data;
        }
        if (query == 'convert') {
          this._convertList = data;
        }
      },
      (errors) => {
        if (errors) {
          this._firstTimerList = [];
          this._convertList = [];
        }
      }
    );
  }
  getFellowships() {
    this._fellowshipList = [];
    this.peopleServ.fetchAll('fellowships', this.currentPage + 1).subscribe(
      (res: any) => {
        const { data } = res;
        this._fellowshipList = data;
      },
      (errors) => {
        if (errors) {
          this._fellowshipList = [];
        }
      }
    );
  }
  getEvangelism() {
    this._evangelismList = [];
    this.peopleServ.fetchAll('evangelism', this.currentPage + 1).subscribe(
      (res: any) => {
        const { data } = res;
        this._evangelismList = data;
      },
      (errors) => {
        if (errors) {
          this._evangelismList = [];
        }
      }
    );
  }
  getAlGroups() {
    this._groupList = [];
    this.groupService.fetchAllGroups(this.currentPage + 1).subscribe(
      (res: any) => {
        const { data } = res;
        this._groupList = data;
      },
      (errors) => {
        if (errors) {
          this._groupList = [];
        }
      }
    );
  }
  getChildValue(val?: any, _query?: any) {
    this.addToFormControl(val, _query);
  }
  addToFormControl(val: any, identifier?: any) {
    switch (val !== null && identifier) {
      case (identifier = 'doc'):
        var docUpload = this.smsForm.get('upload') as FormControl;
        return docUpload.setValue(val);

      default:
        return;
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.channel = params.query;
        this._id = params.id;
        this.getDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/more/media']);
    }
  }
  getDetails() {
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
        });
    }
  }

  getCell(identifier) {
    let res: any;
    switch (identifier) {
      case (identifier = 'reg_member'):
        return (res = this.smsForm.controls['regular_members'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'first_timer'):
        return (res = this.smsForm.controls['first_timer'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'new_convert'):
        return (res = this.smsForm.controls['new_convert'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'department'):
        return (res = this.smsForm.controls['department'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'fellowship'):
        return (res = this.smsForm.controls['fellowship'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'evangelism'):
        return (res = this.smsForm.controls['evangelism'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'group'):
        return (res = this.smsForm.controls['group'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));

      default:
        return;
    }
  }
  getEmail(identifier) {
    let res: any;
    switch (identifier) {
      case (identifier = 'reg_member'):
        return (res = this.emailForm.controls['regular_members'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'first_timer'):
        return (res = this.emailForm.controls['first_timer'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'new_convert'):
        return (res = this.emailForm.controls['new_convert'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'department'):
        return (res = this.emailForm.controls['department'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'fellowship'):
        return (res = this.emailForm.controls['fellowship'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'evangelism'):
        return (res = this.emailForm.controls['evangelism'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));
      case (identifier = 'group'):
        return (res = this.emailForm.controls['group'].value
          .filter((x: any) => x !== 0)
          .map((a: any) => parseInt(a.id)));

      default:
        return;
    }
  }
  //Sending sms
  onSubmit() {
    this.isBusy = true;

    if (this.smsForm.invalid) {
      this.isBusy = false;
      return;
    }
    this.smsForm.patchValue({
      regular_members: this.getCell('reg_member'),
      first_timer: this.getCell('first_timer'),
      new_convert: this.getCell('new_convert'),
      department: this.getCell('department'),
      group: this.getCell('group'),
      evangelism: this.getCell('evangelism'),
      fellowship: this.getCell('fellowship'),
    });

    const formData = new FormData();
    formData.append('type', this.smsForm.get('type').value);
    formData.append('from', this.smsForm.get('from').value);
    formData.append('message', this.smsForm.get('message').value);
    for (let item of this.smsForm.get('regular_members').value) {
      formData.append('to[regular_members][]', item);
    }
    for (let item of this.smsForm.get('first_timer').value) {
      formData.append('to[first_timers][]', item);
    }
    for (let item of this.smsForm.get('new_convert').value) {
      formData.append('to[convert][]', item);
    }

    for (let item of this.smsForm.get('department').value) {
      formData.append('to[departments][]', item);
    }
    for (let item of this.smsForm.get('group').value) {
      formData.append('to[group][]', item);
    }
    for (let item of this.smsForm.get('evangelism').value) {
      formData.append('to[evangelism][]', item);
    }
    for (let item of this.smsForm.get('fellowship').value) {
      formData.append('to[fellowship][]', item);
    }

    if (this.smsForm.valid) {
      //Make api call here...
      this.messageService.sendMessage(formData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/more/messages']);
          this.smsForm.reset();
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
          this.smsForm.reset();
        }
      );
    }
  }
  //Sending email
  onSend() {
    this.isBusy = true;

    if (this.emailForm.invalid) {
      this.isBusy = false;
      return;
    }
    this.emailForm.patchValue({
      regular_members: this.getEmail('reg_member'),
      first_timer: this.getEmail('first_timer'),
      new_convert: this.getEmail('new_convert'),
      department: this.getEmail('department'),
      group: this.getEmail('group'),
      evangelism: this.getEmail('evangelism'),
      fellowship: this.getEmail('fellowship'),
    });
    const formData = new FormData();
    formData.append('type', this.emailForm.get('type').value);
    formData.append('from', this.emailForm.get('from').value);
    formData.append('subject', this.emailForm.get('subject').value);
    formData.append('message', this.emailForm.get('message').value);
    for (let item of this.emailForm.get('regular_members').value) {
      formData.append('to[regular_members][]', item);
    }
    for (let item of this.emailForm.get('department').value) {
      formData.append('to[departments][]', item);
    }
    for (let item of this.emailForm.get('group').value) {
      formData.append('to[group][]', item);
    }
    for (let item of this.emailForm.get('evangelism').value) {
      formData.append('to[evangelism][]', item);
    }
    for (let item of this.emailForm.get('fellowship').value) {
      formData.append('to[fellowship][]', item);
    }

    for (let item of this.emailForm.get('first_timer').value) {
      formData.append('to[first_timers][]', item);
    }
    for (let item of this.emailForm.get('new_convert').value) {
      formData.append('to[new_converts][]', item);
    }

    if (this.emailForm.valid) {
      //Make api call here...
      this.messageService.sendMessage(formData).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.router.navigate(['/portal/more/messages']);
          this.emailForm.reset();
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
          this.emailForm.reset();
        }
      );
    }
  }
}
