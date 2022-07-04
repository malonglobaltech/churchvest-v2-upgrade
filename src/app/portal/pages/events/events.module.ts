import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { OverviewComponent } from './components/overview/overview.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { ImageuploadModule } from '../../components/imageupload/imageupload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { AddEventComponent } from './components/add-event/add-event.component';
import { TrashedEventsComponent } from './components/trashed-events/trashed-events.component';


@NgModule({
  declarations: [
    EventsComponent,
    OverviewComponent,
    AddEventComponent,
    TrashedEventsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    AngularMaterialModule,
    ImageuploadModule,
    FormsModule,
    LoadingRollerModule,
    ReactiveFormsModule
  ],
  exports: [EventsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsModule { }
