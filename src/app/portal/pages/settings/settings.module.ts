import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import {
  ImageuploadComponent,
  OverviewComponent,
} from './components/overview/overview.component';

@NgModule({
  declarations: [SettingsComponent, OverviewComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
  ],
  providers: [ImageuploadComponent],
})
export class SettingsModule {}
