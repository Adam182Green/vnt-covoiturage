import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { LoadingProvider } from '../../providers/loading/loading';

import { HomePage } from '../../pages/home/home';
import { JourneyPage } from '../../pages/journey/journey';

import { Reservation } from '../../model/Reservation';
import { Trajet } from '../../model/Trajet';

@IonicPage()
@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {

	reservation: Reservation;
	reservationBelongsToCurrentUser = false;
	currentUserIsJourneyDriver = false;
  	constructor(public navCtrl: NavController, public navParams: NavParams, public firestore: FirestoreProvider, public auth: AuthServiceProvider, public loading: LoadingProvider, public dateHelper: DateHelperProvider) {
	  	this.loading.show('Veuillez patienter...');
	  	this.reservation = navParams.get('reservation');
	  	this.firestore.getReservationInformation(this.reservation).subscribe(queryResult => {
	  		this.reservation = queryResult.result;
	  		if(this.auth.currentAccount.ref.path == this.reservation.demandeur.ref.path){
	  			this.reservationBelongsToCurrentUser = true;
	  		}
	  		if(this.auth.currentAccount.ref.path == this.reservation.trajet.conducteur.ref.path){
	  			this.currentUserIsJourneyDriver = true;
	  		}
	  		this.loading.hide();
	  	});
  	}

  	onClickJourneyInformationButton(){
	  	this.navCtrl.push(JourneyPage, {
	  		journey: this.reservation.trajet
		});
  	}

  	onClickCancelReservation(){
  		this.reservation.etat = 'annulee';
  		this.loading.show('Veuillez patienter...');
  		this.firestore.updateReservation(this.reservation).subscribe(success => {
			  this.loading.hide();
			  this.navCtrl.setRoot(HomePage);
  		});
  	}

  	onClickValidateReservation(){
		this.reservation.etat = 'validee';
		this.loading.show('Veuillez patienter...');
  		this.firestore.updateReservation(this.reservation).subscribe(success => {
			  this.loading.hide();
			  this.navCtrl.setRoot(HomePage);
  		});
  	}
}
