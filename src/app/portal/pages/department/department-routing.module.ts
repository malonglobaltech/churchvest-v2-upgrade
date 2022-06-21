import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDepartmentComponent } from './components/add-department/add-department.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TrashedDepartmentsComponent } from './components/trashed-departments/trashed-departments.component';
import { DepartmentComponent } from './department.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent,
    children: [ 
    {
      path: 'all',
      component: OverviewComponent,
    },
    {
      path: 'all/trash',
      component: TrashedDepartmentsComponent,
    },
    {
      path: 'all/:query',
      component: AddDepartmentComponent,
    },
    {
      path: '**',
      redirectTo: 'all'
    }
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
