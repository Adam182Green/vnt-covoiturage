import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';

import { Compte } from '../../model/Compte';
import { Reservation } from '../../model/Reservation';
import { Trajet } from '../../model/Trajet';
import { Voiture } from '../../model/Voiture';
import { FirestoreQueryResult } from '../../model/FirestoreQueryResult';
import { observable } from 'rxjs';

@Injectable()
export class FirestoreProvider {

  constructor(private afDB: AngularFirestore) { }

	public getAccount(email: String){
		return Observable.create((observer) => {
			var account = new Compte();
			this.afDB.firestore.collection('comptes')
            .where('email', '==', email)
            .get().then((doc) => {
              if(doc.empty){
                observer.next(false);
                observer.complete();
              } else {
                doc.forEach(item => {
                  account = item.data() as Compte;
                  account.ref = item.ref;
                  observer.next(account);
                  observer.complete();
                });
              }
            });
		});
	}

	public addReservation(demandeur: Compte, trajet: Trajet) : Observable<FirestoreQueryResult>{
		return Observable.create(async observer => {
			this.afDB.firestore.collection('reservations').add({
				demandeur: demandeur.ref,
				etat: "en cours",
				trajet: trajet.ref
			})
			.catch((error) => {
				observer.next(false);
				observer.complete();
			})
			observer.next(true);
			observer.complete();
		});
	}

	public addJourney(conducteur: Compte, trajet: Trajet) : Observable<FirestoreQueryResult>{
		var trajets = new Array<any>();
		console.log(trajets);
		return Observable.create(async observer => {
			this.afDB.firestore.collection('trajets').add({
				conducteur: conducteur.ref,
				dateDepart: trajet.dateDepart,
				nombreDePlaces: trajet.nombreDePlaces,
				passagers: [],
				reservations: [],
				villeArrivee: trajet.villeArrivee,
				villeDepart: trajet.villeDepart,
				voiture: trajet.voiture.ref
			})
			.then(() => {
				this.afDB.firestore.collection('trajets')
				.where('conducteur', '==', conducteur.ref)
				.get().then((doc) => {
					doc.forEach((item) => {
						trajets.push(item.ref);
					});
				}).then(() => {
					this.afDB.firestore.doc(conducteur.ref.path)
					.update({'trajetsConducteur': trajets})
					.then(() => {
						observer.next(true);
						observer.complete();
					})
				})
			})
			.catch((error) => {
				observer.next(false);
				observer.complete();
			})
			
		});
	}

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

	public getAccountVehicules(account: Compte): Observable<FirestoreQueryResult>{
		return Observable.create(observer => {
			var counter = 0;
			var nbCars = account.voitures.length;
			var queryResult = new FirestoreQueryResult();
			queryResult.result = new Array<Voiture>();
			this.afDB.firestore.collection('voitures')
			.where('proprietaire', '==', account.ref)
			.get().then((doc) => {
				if(doc.empty){
					//console.log("emptyyyyyyyyyyyyyyyyyy	");
					observer.next(false);
					observer.complete();
				} else {
					doc.forEach(item => {
						//console.log("GNIAAAAAAAAAAAAAAAAAAAAAA");
						var voiture = item.data() as Voiture;
						voiture.ref = item.ref;
						queryResult.result.push(voiture);
						counter += 1;
						if(counter == nbCars){
							queryResult.success = true;
							observer.next(queryResult);
							observer.complete();
						}
					});
				}
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

  public getJourneysAvecVilleDepartVilleArrivee(villeDepart: string, villeArrivee: string): Observable<FirestoreQueryResult>{
	return Observable.create(observer => {
		var queryResult = new FirestoreQueryResult();
		queryResult.result = new Array<Trajet>();
		queryResult.success = true;
		this.afDB.firestore.collection('trajets')
			.where('villeArrivee', '==', villeArrivee)
			.where('villeDepart', '==', villeDepart)
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
								trajet.conducteur = conducteur;
								trajet.voiture = voiture;
								queryResult.result.push(trajet);
							});
			            });
			        });
				}
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

	public deleteJourney(account: Compte, journey: Trajet){
		return Observable.create(observer => {
			this.afDB.firestore.doc(journey.ref.path)
			.delete()
			.then(() => {
				this.afDB.firestore.collection('reservations')
				.where("trajet", "==", journey.ref)
				.get()
				.then((doc) => {
					if(doc.empty){
			            observer.next(false);
			            observer.complete();
		        	} else {
		            	doc.forEach(item => {
		            		this.afDB.firestore.doc(item.ref.path)
		            		.update({'etat': 'annulee'});
		            	});
		            }
				})
				.then(() => {
					var trajets = new Array<any>();
					this.afDB.firestore.collection('trajets')
					.where('conducteur', '==', account.ref)
					.get().then((doc) => {
						doc.forEach((item) => {
							trajets.push(item.ref);
						});
					}).then(() => {
						this.afDB.firestore.doc(account.ref.path)
						.update({'trajetsConducteur': trajets})
						.then(() => {
							observer.next(true);
							observer.complete();
						})
					})
				})
			});
		});
	}
}
