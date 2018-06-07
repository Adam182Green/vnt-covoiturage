import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { Compte } from '../../model/Compte';

import { LoginPage } from '../../pages/login/login';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  account: Compte;

  constructor(private navCtrl: NavController, private auth: AuthServiceProvider) {
    this.account = this.auth.getAccount();
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }
}