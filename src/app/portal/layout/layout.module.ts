import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidenavComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularMaterialModule,
    GuidedTourModule,
  ],
  exports: [LayoutComponent],
  providers: [GuidedTourService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
