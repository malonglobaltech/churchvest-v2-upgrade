import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Angular4PaystackModule } from 'angular4-paystack';
@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidenavComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularMaterialModule,
    GuidedTourModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    Angular4PaystackModule.forRoot('pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'),
  ],
  exports: [LayoutComponent],
  providers: [GuidedTourService, { provide: ToastrService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
