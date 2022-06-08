import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDepartmentComponent } from './components/add-department/add-department.component';
import { TrashedDepartmentsComponent } from './components/trashed-departments/trashed-departments.component';
import { OverviewComponent } from './components/overview/overview.component';


@NgModule({
  declarations: [
    DepartmentComponent,
    AddDepartmentComponent,
    TrashedDepartmentsComponent,
    OverviewComponent
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
