import { LoadingRollerModule } from './../loading-roller/loading-roller.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartGraphComponent } from './chart-graph.component';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';

@NgModule({
  declarations: [ChartGraphComponent],
  imports: [
    CommonModule,
    ChartsModule,
    WavesModule,
    AngularMaterialModule,
    LoadingRollerModule,
  ],
  exports: [ChartGraphComponent],
})
export class ChartGraphModule {}
