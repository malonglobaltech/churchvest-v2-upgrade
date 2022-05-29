import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { MembersComponent } from './components/members/members.component';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { ImageuploadModule } from '../../components/imageupload/imageupload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PeopleComponent,
    SummaryComponent,
    MembersComponent,
    AddMembersComponent,
  ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
    ImageuploadModule,
  ],
  exports: [PeopleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PeopleModule {}
