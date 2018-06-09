import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';

import { Trajet } from '../../model/Trajet';

@IonicPage()
@Component({
  selector: 'page-journey',
  templateUrl: 'journey.html',
})
export class JourneyPage {

	journey: Trajet;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public firestore: FirestoreProvider) {
  		this.journey = navParams.get('journey');
  		this.firestore.getJourneyInformation(this.journey).subscribe(found => {

  		});
  	}

  	onClickButtonReserve(){
  		//TODO
  	}
}
