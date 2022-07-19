import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { FeaturesComponent } from './components/features/features.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ContactPageComponent,
    FooterComponent,
    SubscribeComponent,
    TutorialComponent,
    HeaderComponent,
    LearnMoreComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
