import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
  ],
  exports: [DepartmentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DepartmentModule { }
