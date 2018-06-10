import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { LoadingProvider } from '../../providers/loading/loading';

import { JourneyPage } from '../../pages/journey/journey';

import { Reservation } from '../../model/Reservation';

@IonicPage()
@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {

	reservation: Reservation;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public firestore: FirestoreProvider, public auth: AuthServiceProvider, public loading: LoadingProvider) {
	  	this.loading.show('Veuillez patienter...');
	  	this.reservation = navParams.get('reservation');
	  	this.firestore.getReservationInformation(this.reservation).subscribe(found => {
	  		this.loading.hide();
	  	});
  	}

  	onClickJourneyInformationButton(){
	  	this.navCtrl.push(JourneyPage, {
	  		journey: this.reservation.trajet
		});
  	}
}
