import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreProvider } from '../../providers/firestore/firestore';

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

	constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private firestore: FirestoreProvider) { 
		this.currentAccount = this.auth.currentAccount;

		this.firestore.getAccountReservations(this.currentAccount).subscribe((found) => {
			if(found){
				console.log(this.currentAccount);
			}
		})
	}

	onReservationClick(event, item) {
		/*this.navCtrl.push(ReservationPage, {
  		item: item
		});*/
	}
}
