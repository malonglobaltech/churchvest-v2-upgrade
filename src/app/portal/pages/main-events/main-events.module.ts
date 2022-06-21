import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainEventsRoutingModule } from './main-events-routing.module';
import { MainEventsComponent } from './main-events.component';
import { EventOverviewComponent } from './components/event-overview/event-overview.component';
import { AddEventwComponent } from './components/add-eventw/add-eventw.component';


@NgModule({
  declarations: [
    MainEventsComponent,
    EventOverviewComponent,
    AddEventwComponent
  ],
  imports: [
    CommonModule,
    MainEventsRoutingModule
  ]
})
export class MainEventsModule { }
