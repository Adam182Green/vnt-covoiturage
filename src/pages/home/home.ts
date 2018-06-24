import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { FirestoreProvider } from '../../providers/firestore/firestore';

import { Compte } from '../../model/Compte';
import { Trajet } from '../../model/Trajet';

import { LoginPage } from '../../pages/login/login';
import { JourneyPage } from '../../pages/journey/journey';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  account: Compte;
  trajets: Trajet[];
  villeRecherche: string;

  constructor(private navCtrl: NavController, private auth: AuthServiceProvider, public loading: LoadingProvider, public firestore: FirestoreProvider) {
    this.account = this.auth.getAccount();
    this.villeRecherche = "";
    this.trajets = [];
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }

  onTrajetClick(trajet) {
		this.navCtrl.push(JourneyPage, {
  			trajet: trajet
		});
  }
  
  onJourneySearchClick() {
    console.log("jepasseparlà");
    if(this.villeRecherche != "")
    {
      this.loading.show('Veuillez patienter...');
      this.firestore.getJourneysAvecVilleArrivee(this.villeRecherche).subscribe(queryResult => {
        if(queryResult.success){
          this.trajets = queryResult.result as Trajet[];
          console.log(queryResult);
        } else {
          console.log("Aucun trajets trouvés");
        }
        this.loading.hide();
      });
    }
  }
}