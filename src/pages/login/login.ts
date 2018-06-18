import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';

import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../../pages/register/register';
import { firestore } from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = { email: '', password: '' };

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loading: LoadingProvider) { }

  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }
 
  public login() {
    this.loading.show('Veuillez patienter...');
    this.auth.login(this.credentials).subscribe(found => {
      if (found) {        
        this.loading.hide();
        this.navCtrl.setRoot(HomePage);
      } else {
        this.showError("Compte introuvable");
      }
    },
      error => {
        this.showError(error);
      });
  }

  public resetPassword() {

    var text = "";
    if(this.credentials.email != "") {
      this.auth.resetPassword(this.credentials.email);
      text = 'Un email vient de vous être envoyé'
    } else {
      text = 'Veuillez entrer votre email';
    }

    let alert = this.alertCtrl.create({
      title: 'Mot de passe oublié',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  showError(text) {
    this.loading.hide();
 
    let alert = this.alertCtrl.create({
      title: 'Echec',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
    //alert.present(prompt);
  }

}
