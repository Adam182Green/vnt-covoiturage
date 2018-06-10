import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';

import { Compte } from '../../model/Compte';
import { Note } from '../../model/Note';
import { Reservation } from '../../model/Reservation';
import { Trajet } from '../../model/Trajet';
import { Voiture } from '../../model/Voiture';
import { FirestoreQueryResult } from '../../model/FirestoreQueryResult';

@Injectable()
export class FirestoreProvider {

  constructor(private afDB: AngularFirestore) { }

  	public getAccountReservations(account: Compte): Observable<FirestoreQueryResult>{
	  	return Observable.create(observer => {
	  		var queryResult = new FirestoreQueryResult();
			queryResult.result = {currentReservations: [], validatedReservations: [], cancelledReservations: []};
			this.afDB.firestore.collection('reservations')
			.where('demandeur', '==', account.ref)
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
			              	switch(reservation.etat){
			              		case 'en cours':
			              			queryResult.result.currentReservations.push(reservation);
			              			break;
			              		case 'validee':
			              			queryResult.result.validatedReservations.push(reservation);
			              			break;
			              		case 'annulee':
			              			queryResult.result.cancelledReservations.push(reservation);
			              			break;
			              	}
			            });
			        });
			    }
		  		queryResult.success = true;
		        observer.next(queryResult);
		        observer.complete();
		    });
	    });
  	}

  public getJourneyInformation(journey: Trajet): Observable<FirestoreQueryResult>{
  	return Observable.create(observer => {
  		var queryResult = new FirestoreQueryResult();
  		this.getVehicleByReference(journey.voiture).subscribe(vehicle => {
  			this.getAccountByReference(journey.conducteur).subscribe(account => {
  				queryResult.result.voiture = vehicle;
  				queryResult.result.conducteur = account;
  				observer.next(queryResult);
  				observer.complete();
  			});
  		});
  	});
  }

  public getReservationInformation(reservation: Reservation): Observable<FirestoreQueryResult>{
  		return Observable.create(observer => {
  			this.getReservationByReference(reservation.ref).subscribe(resa => {
	  			this.getJourneyByReference(resa.trajet).subscribe(journey => {
	  				this.getAccountByReference(resa.demandeur).subscribe(asker => {
	  					this.getAccountByReference(journey.conducteur).subscribe(driver => {
	  						var queryResult = new FirestoreQueryResult();
	  						queryResult.success = true;
		  					queryResult.result = resa;
			  				queryResult.result.trajet = journey;
			  				queryResult.result.trajet.conducteur = driver;
			  				queryResult.result.demandeur = asker;
			  				observer.next(queryResult);
		  					observer.complete();
		  				});
	  				});
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

  public updateReservation(reservation: Reservation){
  	return Observable.create(observer => {
  		console.log(reservation.ref);
  		this.afDB.firestore.doc(reservation.ref.path)
  		.update({'etat': reservation.etat})
  		.then(() => {
  			observer.next(true);
          	observer.complete();
  		})
  		.catch((error) => {
  			observer.next(false);
          	observer.complete();
  		});
  	});
  }
}
