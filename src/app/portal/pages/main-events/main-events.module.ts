import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainEventsRoutingModule } from './main-events-routing.module';
import { MainEventsComponent } from './main-events.component';
import { EventOverviewComponent } from './components/event-overview/event-overview.component';
import { AddEventwComponent } from './components/add-eventw/add-eventw.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { ImageuploadModule } from '../../components/imageupload/imageupload.module';
import { TrashEventsComponent } from './components/trash-events/trash-events.component';


@NgModule({
  declarations: [
    AddEventwComponent,
    EventOverviewComponent,
    MainEventsComponent,
    TrashEventsComponent,

  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ImageuploadModule,
    MainEventsRoutingModule,
    FormsModule,
    LoadingRollerModule,
    ReactiveFormsModule
  ],
  exports: [MainEventsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainEventsModule { }
