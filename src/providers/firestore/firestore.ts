import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';

import { Compte } from '../../model/Compte';
import { Reservation } from '../../model/Reservation';

@Injectable()
export class FirestoreProvider {

  constructor(private afDB: AngularFirestore) {
    
  }

  public getAccountReservations(account: Compte){
	var ids = [];
	account.reservations.forEach((res) => {
		console.log(res);
		ids.concat(res._key.path.segments[6]);
	})

	//doesn't work because reservations is undefined

	return this.getReservationsById(ids);
  }

  private getReservationsById(ids: string[]){
  	var reservations = [];
  	var nbIds = ids.length;

  	console.log("Start of getReservations, nbIds: " + nbIds);

  	return Observable.create(observer => {
  		console.log("Start of Observable.create");
	  	for(var id in ids){
	  		var reservationDoc = this.afDB.doc<Reservation>('reservations/' + id);
	  		var reservation = reservationDoc.valueChanges();
	  		console.log(reservation);
	  		reservation.subscribe((res) => {
	  			reservations.concat(res);
	  			console.log("res n°" + reservations.length)
	  			if(reservations.length == nbIds) {
	  				observer.next(reservations);
	  				observer.complete();
	  			}
	  		});
	  	}
	});
  }
}
