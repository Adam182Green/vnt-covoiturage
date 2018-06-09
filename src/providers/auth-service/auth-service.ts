import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Compte } from '../../model/Compte';
import { Reservation } from '../../model/Reservation';

@Injectable()
export class AuthServiceProvider {

  currentAccount: Compte;

  constructor(public afDB: AngularFirestore){}

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      return Observable.create(observer => {

        var getAccountQuery = this.afDB.firestore.collection('comptes').where('email', '==', credentials.email).where('motDePasse', '==', credentials.password);

        getAccountQuery.get().then((doc) => {
          if(doc.empty){
             observer.next(false);
             observer.complete();
          } else {
            doc.forEach(item => {
              this.currentAccount = item.data() as Compte;
              this.currentAccount.ref = item.ref;
            });
          }
          observer.next(true);
          observer.complete();
        });
      });
    }
  }
 
  public register(credentials) {
    if (credentials.firstName === null || credentials.surname === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getAccount() : Compte {
    return this.currentAccount;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentAccount = null;
      observer.next(true);
      observer.complete();
    });
  }

}
