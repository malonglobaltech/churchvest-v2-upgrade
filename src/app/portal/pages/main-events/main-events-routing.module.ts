import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventwComponent } from './components/add-eventw/add-eventw.component';
import { EventOverviewComponent } from './components/event-overview/event-overview.component';
import { TrashEventsComponent } from './components/trash-events/trash-events.component';
import { MainEventsComponent } from './main-events.component';

const routes: Routes = [
  {
    path: '',
    component: MainEventsComponent,
    children: [
      {
        path: '',
        component: EventOverviewComponent
      },
      {
        path: 'all',
        component: AddEventwComponent
      },
      {
        path: 'trash',
        component: TrashEventsComponent
      },
      {
        path: 'all/:query',
        component: AddEventwComponent
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
export class MainEventsRoutingModule { }
