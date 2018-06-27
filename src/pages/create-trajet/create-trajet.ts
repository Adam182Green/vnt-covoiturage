import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';

import { Voiture } from '../../model/Voiture';

/**
 * Generated class for the CreateTrajetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-trajet',
  templateUrl: 'create-trajet.html',
})
export class CreateTrajetPage {

  villeDepart: string;
  villeArrivee: string;
  dateDepart: Date;
  nombreDePlaces: number;
  voitures: Voiture[];
  voitureSelected: Voiture;

  constructor(public navCtrl: NavController, public firestore: FirestoreProvider, public auth: AuthServiceProvider, public loading: LoadingProvider) {
    this.voitures = auth.currentAccount.voitures;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTrajetPage');
  }

}
