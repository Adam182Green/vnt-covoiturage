import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  	constructor(public navCtrl: NavController, public navParams: NavParams, public firestore: FirestoreProvider, public loading: LoadingProvider) {
  		this.loading.show("Veuillez patienter...");
  		this.journey = navParams.get('journey');
  		this.firestore.getJourneyInformation(this.journey).subscribe(queryResult => {
  			if(queryResult.success){
  				this.journey = queryResult.result;
  			} else {
  				//TODO show error
  			}
  			this.loading.hide();
  		});
  	}

  	onClickButtonReserve(){
  		//TODO
  	}
}
