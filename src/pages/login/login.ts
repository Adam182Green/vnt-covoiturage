import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../../pages/register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }
 
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(found => {
      if (found) {        
        this.navCtrl.setRoot(HomePage);
      } else {
        this.showError("Compte introuvable");
      }
    },
      error => {
        this.showError(error);
      });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Echec',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
    //alert.present(prompt);
  }

}
