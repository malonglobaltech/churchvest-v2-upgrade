import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import {
  BulkMemberUploadComponent,
  MembersComponent,
} from './components/members/members.component';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { ImageuploadModule } from '../../components/imageupload/imageupload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TrashedMembersComponent } from './components/trashed-members/trashed-members.component';
import { EmptyStateModule } from '../../components/empty-state/empty-state.module';
import { FellowshipComponent } from './components/fellowship/fellowship.component';
import { AddFellowshipComponent } from './components/add-fellowship/add-fellowship.component';
import { AddEvangelismComponent } from './components/add-evangelism/add-evangelism.component';
import { EvangelismComponent } from './components/evangelism/evangelism.component';
import { NewConvertsComponent } from './components/new-converts/new-converts.component';
import { AddNewConvertsComponent } from './components/add-new-converts/add-new-converts.component';
import { FirstTimersComponent } from './components/first-timers/first-timers.component';
import { AddFirstTimersComponent } from './components/add-first-timers/add-first-timers.component';
import { TrashedFellowshipsComponent } from './components/trashed-fellowships/trashed-fellowships.component';
import { TrashedEvangelismComponent } from './components/trashed-evangelism/trashed-evangelism.component';
@NgModule({
  declarations: [
    PeopleComponent,
    SummaryComponent,
    MembersComponent,
    AddMembersComponent,
    TrashedMembersComponent,
    FellowshipComponent,
    AddFellowshipComponent,
    AddEvangelismComponent,
    EvangelismComponent,
    NewConvertsComponent,
    AddNewConvertsComponent,
    FirstTimersComponent,
    AddFirstTimersComponent,
    TrashedFellowshipsComponent,
    TrashedEvangelismComponent,
  ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
    ImageuploadModule,
    NgxDropzoneModule,
    EmptyStateModule,
  ],
  providers: [BulkMemberUploadComponent],
  exports: [PeopleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PeopleModule {}
