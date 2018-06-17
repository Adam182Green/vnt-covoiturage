import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { LoadingProvider } from '../../providers/loading/loading';

import { JourneyPage } from '../../pages/journey/journey';

import { Compte } from '../../model/Compte';
import { Trajet } from '../../model/Trajet';

@IonicPage()
@Component({
  selector: 'page-mes-trajets',
  templateUrl: 'mes-trajets.html',
})
export class MesTrajetsPage {

	currentAccount: Compte;
	items: any = [{	expanded: false,
					name: 'En tant que conducteur',
					journeys: Array<Trajet>() },
				  {
					expanded: false,
					name: 'En tant que passager',
					journeys: Array<Trajet>()}];


  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, public firestore: FirestoreProvider, public loading: LoadingProvider, public dateHelper: DateHelperProvider) {
  	this.loading.show("Veuillez patienter...");
  	this.currentAccount = this.auth.currentAccount;
  	var counter = 0;

  	this.firestore.getAccountDriverJourneys(this.currentAccount).subscribe(queryResult => {
  		if(queryResult.success){
			this.items[0].journeys = queryResult.result;	
		} else {
			//show error
		}
		counter++;
		if(counter == 2){
			this.loading.hide();
		}
	});
	this.firestore.getAccountPassengerJourneys(this.currentAccount).subscribe(queryResult => {
  		if(queryResult.success){
			this.items[1].journeys = queryResult.result;				
		} else {
			//show error
		}
		counter++;
		if(counter == 2){
			this.loading.hide();
		}
	});
  }


  onClickJourney(event, journey){
  	this.navCtrl.push(JourneyPage, {
  			journey: journey
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
}
