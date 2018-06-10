import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { LoadingProvider } from '../../providers/loading/loading';

import { Trajet } from '../../model/Trajet';

@IonicPage()
@Component({
  selector: 'page-journey',
  templateUrl: 'journey.html',
})
export class JourneyPage {

	journey: Trajet;
	journeyBelongsToCurrentUser = false;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, public firestore: FirestoreProvider, public loading: LoadingProvider) {
  		this.loading.show("Veuillez patienter...");
  		this.journey = navParams.get('journey');
  		this.firestore.getJourneyInformation(this.journey).subscribe(queryResult => {
  			if(queryResult.success){
  				this.journey = queryResult.result;
  				if(this.journey.conducteur.ref.path == this.auth.currentAccount.ref.path){
  					this.journeyBelongsToCurrentUser = true;
  				}
  			} else {
  				//TODO show error
  			}
  			this.loading.hide();
  		});
  	}

  	onClickButtonReserve(){
  		//TODO
  	}

  	onClickButtonCancel(){
  		//TODO
  	}
}
