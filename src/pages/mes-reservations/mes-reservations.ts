import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';
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
	items: any = [];
	//itemExpandHeight: number = 100;

	constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private firestore: FirestoreProvider, public loading: LoadingProvider, public dateHelper: DateHelperProvider) {
		this.loading.show('Veuillez patienter...');
		this.currentAccount = this.auth.currentAccount;
		this.firestore.getAccountReservations(this.currentAccount).subscribe(queryResult => {
			if(queryResult.success){
				this.items.push({
					expanded: false,
					name: 'En cours',
					reservations: queryResult.result.currentReservations
				});
				this.items.push({
					expanded: false,
					name: 'Validées',
					reservations: queryResult.result.validatedReservations
				});
				this.items.push({
					expanded: false,
					name: 'Annulées',
					reservations: queryResult.result.cancelledReservations
				});
			} else {
				//show error
			}
			this.loading.hide();
		});
	}

	expandItem(item){
        this.items.map((listItem) => {
            if(item == listItem){
                listItem.expanded = !listItem.expanded;
            } else {
                listItem.expanded = false;
            }
            return listItem;
        });
    }

	onReservationClick(event, reservation) {
		this.navCtrl.push(ReservationPage, {
  			reservation: reservation
		});
	}
}
