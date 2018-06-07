import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesTrajetsPage } from './mes-trajets';

@NgModule({
  declarations: [
    MesTrajetsPage,
  ],
  imports: [
    IonicPageModule.forChild(MesTrajetsPage),
  ],
})
export class MesTrajetsPageModule {}
