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

@Injectable()
export class AuthServiceProvider {

  currentAccount: Compte;

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
            this.afDB.firestore.collection('comptes')
            .where('email', '==', credentials.email)
            .get().then((doc) => {
              if(doc.empty){
                observer.next(false);
                observer.complete();
              } else {
                doc.forEach(item => {
                  this.currentAccount = item.data() as Compte;
                  this.currentAccount.ref = item.ref;
                  this.currentAccount.reservations.forEach(reservation => {
                  var res = this.firestore.getReservationByReference(reservation);
                  reservation = res;
                  });
                });
              }
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
    return this.currentAccount;
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
