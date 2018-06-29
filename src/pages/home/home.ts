import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { DateHelperProvider } from '../../providers/date-helper/date-helper';

import { Compte } from '../../model/Compte';
import { Trajet } from '../../model/Trajet';
import { Voiture } from '../../model/Voiture';

import { LoginPage } from '../../pages/login/login';
import { JourneyPage } from '../../pages/journey/journey';
import { CreateTrajetPage } from '../../pages/create-trajet/create-trajet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  account: Compte;
  trajets: Trajet[];
  villeDepart: string;
  villeArrivee: string;

  constructor(private navCtrl: NavController, private auth: AuthServiceProvider, public loading: LoadingProvider, public firestore: FirestoreProvider, public dateHelper: DateHelperProvider) {
    this.account = this.auth.getAccount();
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }

  onTrajetClick(trajet) {
		this.navCtrl.push(JourneyPage, {
  			journey: trajet
		});
  }
  
  onJourneySearchClick() {
    console.log(this.villeDepart);
    if(this.villeDepart != "" && this.villeArrivee != "")
    {
      this.loading.show('Veuillez patienter...');
      this.firestore.getJourneysAvecVilleDepartVilleArrivee(this.villeDepart, this.villeArrivee).subscribe(queryResult => {
        if(queryResult.success){
          this.trajets = queryResult.result;
          console.log(queryResult);
        } else {
          console.log("Aucun trajets trouvés");
        }
        this.loading.hide();
      });
    }
  }

  onCreateTrajetClick() {
    this.navCtrl.push(CreateTrajetPage, {});
  }
}