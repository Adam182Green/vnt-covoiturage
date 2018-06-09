import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { JourneyPage } from '../../pages/journey/journey';

import { Reservation } from '../../model/Reservation';

@IonicPage()
@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {

	reservation: Reservation;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.reservation = navParams.get('reservation');
  }

  onClickJourneyInformationButton(){
  	this.navCtrl.push(JourneyPage, {
  			journey: this.reservation.trajet
		});
  }
}
