import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMediaComponent } from './components/add-media/add-media.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { TrashComponent } from './components/trash/trash.component';
import { MoreComponent } from './more.component';

const routes: Routes = [
  {
    path: '',
    component: MoreComponent,
    children: [
      {
        path: 'media',
        component: MediaComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'media/trash',
        component: TrashComponent,
      },
      {
        path: 'media/:query',
        component: AddMediaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreRoutingModule {}
