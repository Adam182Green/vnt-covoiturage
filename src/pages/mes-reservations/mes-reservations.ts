import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

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

	loading: Loading;
	currentAccount: Compte;
	reservations: Reservation[];

	constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private firestore: FirestoreProvider, public loadingCtrl: LoadingController) {
		this.showLoading();
		this.currentAccount = this.auth.currentAccount;
		this.firestore.getAccountReservations(this.currentAccount).subscribe(success => {
			if(success){
				
			} else {
				//show error
			}
			this.loading.dismiss();
		});
	}

	onReservationClick(event, item) {
		/*this.navCtrl.push(ReservationPage, {
  		item: item
		});*/
	}

	showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...',
    });
    this.loading.present();
  }
}
