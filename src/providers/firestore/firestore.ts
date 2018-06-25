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

  	public getAccountDriverJourneys(account: Compte): Observable<FirestoreQueryResult>{
  		return Observable.create(observer => {
  			var queryResult = new FirestoreQueryResult();
  			queryResult.success = true;
  			var journeys = new Array<Trajet>();
  			var counter = 0;
  			var nbJourneys = account.trajetsConducteur.length;
  			if(nbJourneys > 0){
	  			account.trajetsConducteur.forEach(trajet => {
	  				this.getTrajetWithAllInformation(trajet).subscribe(result => {
	  					if(result.success){
	  						journeys.push(result.result);
	  					}
	  					counter++;
	  					if(counter == nbJourneys){
	  						queryResult.result = journeys;
	  						observer.next(queryResult);
	  						observer.complete();
	  					}
	  				});
	  			});
	  		} else {
	  			observer.next(queryResult);
	  			observer.complete();
	  		}
  		});
  	}

  	public getAccountPassengerJourneys(account: Compte): Observable<FirestoreQueryResult>{
  		return Observable.create(observer => {
  			var queryResult = new FirestoreQueryResult();
  			queryResult.success = true;
  			var journeys = new Array<Trajet>();
  			var counter = 0;
  			var nbJourneys = account.trajetsPassager.length;
  			if(nbJourneys > 0){
	  			account.trajetsPassager.forEach(trajet => {
	  				this.getTrajetWithAllInformation(trajet).subscribe(result => {
	  					if(result.success){
	  						journeys.push(result.result);
	  					}
	  					counter++;
	  					if(counter == nbJourneys){
	  						queryResult.result = journeys;
	  						observer.next(queryResult);
	  						observer.complete();
	  					}
	  				});
	  			});
	  		} else {
	  			observer.next(queryResult);
	  			observer.complete();
	  		}
  		});
  	}

  	public getTrajetWithAllInformation(reference: any): Observable<FirestoreQueryResult>{
  		var queryResult = new FirestoreQueryResult();
  		return Observable.create(observer => {
  			this.getJourneyByReference(reference).subscribe(journey => {
  				this.getAccountByReference(journey.conducteur).subscribe(driver => {
  					this.getVehicleByReference(journey.voiture).subscribe(vehicle => {
  						this.getAccountsByReferences(journey.passagers).subscribe(passengers => {
  							queryResult.success = true;
  							queryResult.result = journey;
  							queryResult.result.conducteur = driver;
  							queryResult.result.voiture = vehicle;
  							queryResult.result.passagers = passengers;
  							observer.next(queryResult);
  							observer.complete();
  						});
  					});
  				});
  			});
  		});
  	}

  public getJourneyInformation(journey: Trajet): Observable<FirestoreQueryResult>{
  	return Observable.create(observer => {
  		var queryResult = new FirestoreQueryResult();
  		var vehicleRef = journey.voiture.ref ? journey.voiture.ref : journey.voiture;
  		var driverRef = journey.conducteur.ref ? journey.conducteur.ref : journey.conducteur;

  		this.getVehicleByReference(vehicleRef).subscribe(vehicle => {
  			this.getAccountByReference(driverRef).subscribe(account => {
  				queryResult.success = true;
  				queryResult.result = journey;
  				queryResult.result.voiture = vehicle;
  				queryResult.result.conducteur = account;
  				observer.next(queryResult);
  				observer.complete();
  			});
  		});
  	});
  }

  
  public getJourneysAvecVilleArrivee(villeArrivee: string): Observable<FirestoreQueryResult>{
	return Observable.create(observer => {
		var queryResult = new FirestoreQueryResult();
		queryResult.success = true;
		this.afDB.firestore.collection('trajets')
			.where('villeArrivee', '==', villeArrivee)
			.get().then((doc) => {
	          	if(doc.empty){
		            observer.next(false);
		            observer.complete();
		        } else {
		            doc.forEach(item => {
		            	var trajet = item.data() as Trajet;
		            	trajet.ref = item.ref;
		              	this.getAccountByReference(trajet.conducteur).subscribe(conducteur => {
							this.getVehicleByReference(trajet.voiture).subscribe(voiture => {
								this.getAccountsByReferences(trajet.passagers).subscribe(passagers => {
									//this.getReservationsByReferences(trajet.reservations).subscribe(reservations => {
										trajet.conducteur = conducteur;
										trajet.voiture = voiture;
										trajet.passagers = passagers;
										trajet.reservations = [];
									//});
								});
							});
			            });
			        });
				}
				queryResult.result = doc;
				queryResult.success = true;
				observer.next(queryResult);
				observer.complete();
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

  public getAccountByReference(reference: any): Observable<Compte>{
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

  public getAccountsByReferences(references: any[]): Observable<Compte[]>{
  	var counter = 0;
  	var nbReferences = references.length;
  	var accounts = new Array<Compte>();
  	return Observable.create(observer => {
  		if(nbReferences > 0){
	  		references.forEach(reference => {
	  			this.afDB.firestore.doc(reference.path)
				.get().then((doc) => {
		            var account = doc.data() as Compte;
		            account.ref = doc.ref;
		            accounts.push(account);
		            counter++;
		            if(counter == nbReferences){
		            	observer.next(accounts)
		            	observer.complete();
		            }
	        	});
	  		});
	  	} else {
	  		observer.next(accounts)
		    observer.complete();
	  	}
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
