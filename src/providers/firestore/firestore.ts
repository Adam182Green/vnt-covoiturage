import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';

import { Compte } from '../../model/Compte';
import { Note } from '../../model/Note';
import { Reservation } from '../../model/Reservation';
import { Trajet } from '../../model/Trajet';
import { Voiture } from '../../model/Voiture';

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
	              this.getJourneyByReference(reservation.trajet).subscribe(trajet => {
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

  public getJourneyInformation(journey: Trajet){
  	return Observable.create(observer => {
  		this.getVehicleByReference(journey.voiture).subscribe(vehicle => {
  			this.getAccountByReference(journey.conducteur).subscribe(account => {
  				journey.voiture = vehicle;
  				journey.conducteur = account;
  				observer.next(true);
  				observer.complete();
  			});
  		});
  	});
  }

  public getReservationInformation(reservation: Reservation){
  		return Observable.create(observer => {
  			this.getReservationByReference(reservation).subscribe(reservation => {
	  			this.getJourneyByReference(reservation.trajet).subscribe(journey => {
	  				reservation = reservation;
	  				reservation.trajet = journey;
	  				observer.next(true);
  					observer.complete();
	  			});
	  		});
  		});
  }

  public getAccountByReference(reference: any){
  	return Observable.create(observer => {
		this.afDB.firestore.doc(reference.path)
		.get().then((doc) => {
            var account = doc.data() as Compte;
            account.ref = doc.ref;
            observer.next(account);
          	observer.complete();
        });
    });
  }

  public getJourneyByReference(reference: any){
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

  public getReservationByReference(reference: any) {
	return Observable.create(observer => {
		this.afDB.firestore.doc(reference.path)
		.get().then((doc) => {
            var reservation = doc.data() as Reservation;
            reservation.ref = doc.ref;
            observer.next(reservation);
          	observer.complete();
        });
    });
  }

  public getVehicleByReference(reference: any){
  	return Observable.create(observer => {
		this.afDB.firestore.doc(reference.path)
		.get().then((doc) => {
            var vehicle = doc.data() as Voiture;
            vehicle.ref = doc.ref;
            observer.next(vehicle);
          	observer.complete();
        });
    });
  }
}
