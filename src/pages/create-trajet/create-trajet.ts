import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';
import { firestore } from 'firebase';

import { HomePage } from '../../pages/home/home';

import { Voiture } from '../../model/Voiture';
import { Compte } from '../../model/Compte';
import { Trajet } from '../../model/Trajet';
import { Timestamp } from 'rxjs';

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
  selectedVoiture: Voiture;

  constructor(public navCtrl: NavController, public firestore: FirestoreProvider, public auth: AuthServiceProvider, public loading: LoadingProvider) {
    this.loading.show('Veuillez patienter...');
    this.voitures = new Array<Voiture>();
    this.currentAccount = this.auth.currentAccount;
		this.firestore.getAccountVehicules(this.currentAccount).subscribe(queryResult => {
			if(queryResult.success){
        this.currentAccount.voitures = queryResult.result;
        this.voitures = queryResult.result;
        console.log(this.currentAccount);
        this.loading.hide();
      } else {
        this.loading.hide();
      }
    });
    
    /*var voiture1 = new Voiture();
    voiture1.marque = "def";
    voiture1.modele = "frefkp";
    this.voitures.push(voiture1); 
    console.log(this.auth.getAccount().voitures);*/
  }

  onClickVoiture($event, voiture){
    this.selectedVoiture = voiture;
  }

  onCreateClick(){
    this.loading.show("Veuillez attendre...");
    var journey = new Trajet();
    journey.dateDepart = new firestore.Timestamp(0,0);
    journey.nombreDePlaces = this.nombreDePlaces;
    journey.villeArrivee = this.villeArrivee;
    journey.villeDepart = this.villeDepart;
    journey.voiture = this.currentAccount.voitures[0];
    this.firestore.addJourney(this.currentAccount, journey).subscribe((result) => {
      this.loading.hide();
      this.navCtrl.setRoot(HomePage);
    });
  }

}
