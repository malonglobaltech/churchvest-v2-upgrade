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
import { TrashComponent } from './components/trash/trash.component';
import { MultifileUploadModule } from '../../components/multifile-upload/multifile-upload.module';
import { MediaUploadModule } from '../../components/media-upload/media-upload.module';
import { DocumentUploadModule } from '../../components/document-upload/document-upload.module';
import { SendMessageComponent } from './components/send-message/send-message.component';

@NgModule({
  declarations: [
    MoreComponent,
    MediaComponent,
    MessagesComponent,
    AddMediaComponent,
    TrashComponent,
    SendMessageComponent,
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
