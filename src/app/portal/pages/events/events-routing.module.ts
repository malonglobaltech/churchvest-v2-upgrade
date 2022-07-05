import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { OverviewComponent } from './components/overview/overview.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { TrashedEventsComponent } from './components/trashed-events/trashed-events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'add',
        component: AddEventComponent
      },
      {
        path: 'trash',
        component: TrashedEventsComponent
      },
      {
        path: 'add/:query',
        component: AddEventComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
