import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';

@NgModule({
  declarations: [PeopleComponent, SummaryComponent],
  imports: [CommonModule, PeopleRoutingModule, AngularMaterialModule],
  exports: [PeopleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PeopleModule {}
