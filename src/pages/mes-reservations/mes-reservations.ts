import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { LoadingProvider } from '../../providers/loading/loading';

import { ReservationPage } from '../../pages/reservation/reservation';

import { Compte } from '../../model/Compte';
import { Reservation } from '../../model/Reservation';

@IonicPage()
@Component({
  selector: 'page-mes-reservations',
  templateUrl: 'mes-reservations.html',
})
export class MesReservationsPage {

	currentAccount: Compte;
	reservations: Reservation[];

	constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private firestore: FirestoreProvider, public loading: LoadingProvider) {
		this.loading.show('Veuillez patienter...');
		this.currentAccount = this.auth.currentAccount;
		this.firestore.getAccountReservations(this.currentAccount).subscribe(queryResult => {
			if(queryResult.success){
				this.reservations = queryResult.result;
			} else {
				//show error
			}
			this.loading.hide();
		});
	}

	onReservationClick(event, reservation) {
		this.navCtrl.push(ReservationPage, {
  			reservation: reservation
		});
	}
}
