import { LiveStreamingComponent } from './components/live-streaming/live-streaming.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGivingComponent } from './components/add-giving/add-giving.component';
import { AddMediaComponent } from './components/add-media/add-media.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { GroupsComponent } from './components/groups/groups.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { OnlineGivingComponent } from './components/online-giving/online-giving.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { TrashGivingsComponent } from './components/trash-givings/trash-givings.component';
import { TrashMediaComponent } from './components/trash-media/trash-media.component';
import { TrashMessagesComponent } from './components/trash-messages/trash-messages.component';
import { TrashedGroupComponent } from './components/trashed-group/trashed-group.component';
import { MoreComponent } from './more.component';

const routes: Routes = [
  {
    path: '',
    component: MoreComponent,
    children: [
      {
        path: 'group',
        component: GroupsComponent,
      },
      {
        path: 'media',
        component: MediaComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'online-giving',
        component: OnlineGivingComponent,
      },
      {
        path: 'group/trash',
        component: TrashedGroupComponent,
      },
      {
        path: 'online-giving/trash',
        component: TrashGivingsComponent,
      },
      {
        path: 'media/trash',
        component: TrashMediaComponent,
      },
      {
        path: 'messages/trash',
        component: TrashMessagesComponent,
      },
      {
        path: 'live-streaming',
        component: LiveStreamingComponent,
      },
      {
        path: 'group/:query',
        component: CreateGroupComponent,
      },
      {
        path: 'media/:query',
        component: AddMediaComponent,
      },
      {
        path: 'messages/:query',
        component: SendMessageComponent,
      },
      {
        path: 'online-giving/:query',
        component: AddGivingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreRoutingModule {}
