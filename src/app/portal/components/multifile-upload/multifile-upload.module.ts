import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultifileUploadComponent } from './multifile-upload.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MultifileUploadComponent],

  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [{ provide: ToastrService }],
  exports: [MultifileUploadComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultifileUploadModule {}
