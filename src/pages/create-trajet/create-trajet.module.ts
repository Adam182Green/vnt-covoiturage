import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateTrajetPage } from './create-trajet';

@NgModule({
  declarations: [
    CreateTrajetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateTrajetPage),
  ],
})
export class CreateTrajetPageModule {}
