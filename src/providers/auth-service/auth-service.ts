import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Compte } from '../../model/Compte';

@Injectable()
export class AuthServiceProvider {

  currentAccount: Compte;
  comptesCollection: AngularFirestoreCollection<Compte>;
  comptes: Observable<Compte[]>;  

  constructor(public afDB: AngularFirestore){}

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        this.comptesCollection = this.afDB.collection('comptes', ref => ref.where('email', '==', credentials.email).where('motDePasse', '==', credentials.password));
        this.comptes = this.comptesCollection.valueChanges();

        this.comptes.subscribe((comptesData: Compte[]) => {
          if(comptesData.length == 0){
            observer.next(false);
            observer.complete();
          } else {
            comptesData.forEach((compte: Compte) => {
              this.currentAccount = compte;
              observer.next(true);
              observer.complete();
            });
          }
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
