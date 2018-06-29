import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirestoreProvider } from '../../providers/firestore/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Compte } from '../../model/Compte';
import { FIREBASE_CONFIG } from "../../app/firestore.config";
import { AngularFireAuth } from "angularfire2/auth";
import { Reservation } from '../../model/Reservation';
import { identity } from 'rxjs';
import { Voiture } from '../../model/Voiture';

@Injectable()
export class AuthServiceProvider {

  currentAccount = new Compte();

  constructor(public afDB: AngularFirestore, public firestore: FirestoreProvider, private afauth: AngularFireAuth){}

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      return Observable.create(async observer => {
        await this.afauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
          .catch((error) => {
            observer.next(false);
            observer.complete();
          })
          .then(() => {
            this.firestore.getAccount(credentials.email).subscribe((account) => {
              this.currentAccount = account;
              observer.next(true);
              observer.complete();
            });
          })
        });
    }
  }
 
  public register(credentials) {
    if (credentials.firstName === null || credentials.surname === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      return Observable.create(async observer => {
        await this.afauth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
          .catch((error) => {
            observer.next(false);
            observer.complete();
          })
          .then(() => {
            this.afDB.firestore.collection('comptes').add({
              email: credentials.email,
              nom: credentials.surname,
              prenom: credentials.firstName,
              dateDeNaissance: new Date(),
              notes: [],
              notesConducteur: [],
              notesPassager : [],
              reservations : [],
              trajetsConducteur : [],
              trajetsPassager : [], 
              voitures : []
            })
            .catch((error) => {
              observer.next(false);
              observer.complete();
            })
          });
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getAccount() : Compte {
    this.firestore.getAccount(this.currentAccount.email).subscribe((account) => {
      this.currentAccount = account;
      return this.currentAccount;
    });
    return new Compte();
  }
 
  public resetPassword(email: string) {
    var result = this.afauth.auth.sendPasswordResetEmail(email)
      .then(() => { console.log("email sent");console.log("res:"+result);})
      .catch((error) => {console.log(error);console.log("res:"+result);});
      console.log(result);
      return result;
}

  public logout() {
    return Observable.create(observer => {
      this.currentAccount = null;
      this.afauth.auth.signOut().then(() => {
        observer.next(true);
        observer.complete();
      })
      .catch(() => {
        observer.next(false);
        observer.complete();
      });      
    });
  }

}
