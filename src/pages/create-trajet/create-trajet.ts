import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';

import { Voiture } from '../../model/Voiture';
import { Compte } from '../../model/Compte';

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

  currentAccount: Compte;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: Date;
  nombreDePlaces: number;
  voitures: Array<Voiture>;
  voitureSelected: Voiture;

  constructor(public navCtrl: NavController, public firestore: FirestoreProvider, public auth: AuthServiceProvider, public loading: LoadingProvider) {
    this.loading.show('Veuillez patienter...');
    this.currentAccount = this.auth.currentAccount;
    this.voitures = new Array<Voiture>();
		this.firestore.getAccountVehicules(this.currentAccount).subscribe(queryResult => {
			if(queryResult.success){
        var arrayVoitures = queryResult.result as Array<Voiture>;
        arrayVoitures.forEach(voiture => {
          this.voitures.push(voiture);
        });
      }
    });
    this.loading.hide();
    /*var voiture1 = new Voiture();
    voiture1.marque = "def";
    voiture1.modele = "frefkp";
    this.voitures.push(voiture1); 
    console.log(this.auth.getAccount().voitures);*/
  }

  ionViewDidLoad() {
  }

}
