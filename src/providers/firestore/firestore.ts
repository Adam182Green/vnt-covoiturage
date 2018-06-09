import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';

import { Compte } from '../../model/Compte';
import { Reservation } from '../../model/Reservation';
import { Trajet } from '../../model/Trajet';

@Injectable()
export class FirestoreProvider {

  constructor(private afDB: AngularFirestore) { }

  public getAccountReservations(account: Compte){
  	return Observable.create(observer => {
	  	account.reservations = [];
		this.afDB.firestore.collection('reservations')
			.where('demandeur', '==', account.ref)
			.where('etat', '==', 'en cours')
			.get().then((doc) => {
	          if(doc.empty){
	             observer.next(false);
	             observer.complete();
	          } else {
	            doc.forEach(item => {
	              var reservation = item.data() as Reservation;
	              reservation.ref = item.ref;
	              this.getTrajetByReference(reservation.trajet).subscribe(trajet => {
	              	reservation.trajet = trajet;
	              	account.reservations.push(reservation);
	              });
	            });
	          }
	          observer.next(true);
	          observer.complete();
	        });
    });
  }

  public getReservationByReference(reference: any) {
	return Observable.create(observer => {
		var docRef = this.afDB.firestore.doc(reference.path);
		docRef.get().then((doc) => {
              var reservation = doc.data() as Reservation;
              reservation.ref = doc.ref;
              observer.next(reservation);
          	  observer.complete();
            });
    });
  }

  public getTrajetByReference(reference: any){
	return Observable.create(observer => {
	this.afDB.firestore.doc(reference.path)
		.get().then((doc) => {
              var trajet = doc.data() as Trajet;
              trajet.ref = doc.ref;
              observer.next(trajet);
          	  observer.complete();
            });
    });
  }
}
