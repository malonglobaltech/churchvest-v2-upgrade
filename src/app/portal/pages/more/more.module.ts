import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoreRoutingModule } from './more-routing.module';
import { MoreComponent } from './more.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { ImageuploadModule } from '../../components/imageupload/imageupload.module';
import { EmptyStateModule } from '../../components/empty-state/empty-state.module';
import { AddMediaComponent } from './components/add-media/add-media.component';
import { MultifileUploadModule } from '../../components/multifile-upload/multifile-upload.module';
import { MediaUploadModule } from '../../components/media-upload/media-upload.module';
import { DocumentUploadModule } from '../../components/document-upload/document-upload.module';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { TrashMessagesComponent } from './components/trash-messages/trash-messages.component';
import { TrashMediaComponent } from './components/trash-media/trash-media.component';
import { OnlineGivingComponent } from './components/online-giving/online-giving.component';
import { AddGivingComponent } from './components/add-giving/add-giving.component';
import { GroupsComponent } from './components/groups/groups.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { TrashedGroupComponent } from './components/trashed-group/trashed-group.component';
import { TrashGivingsComponent } from './components/trash-givings/trash-givings.component';

@NgModule({
  declarations: [
    MoreComponent,
    MediaComponent,
    MessagesComponent,
    AddMediaComponent,
    SendMessageComponent,
    TrashMessagesComponent,
    TrashMediaComponent,
    OnlineGivingComponent,
    AddGivingComponent,
    GroupsComponent,
    CreateGroupComponent,
    TrashedGroupComponent,
    TrashGivingsComponent,
  ],
  imports: [
    CommonModule,
    MoreRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
    ImageuploadModule,
    MultifileUploadModule,
    MediaUploadModule,
    DocumentUploadModule,
    EmptyStateModule,
  ],
  exports: [MoreComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MoreModule {}
