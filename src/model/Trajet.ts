import { Compte } from './Compte';
import { Reservation } from './Reservation';
import { Voiture } from './Voiture';
import { firestore } from 'firebase';

export class Trajet {
	ref: any;
	conducteur: Compte;
	dateDepart: firestore.Timestamp;
	nombreDePlaces: number;
	passagers: Compte[];
	reservations: Reservation[];
	villeArrivee: string;
	villeDepart: string;
	voiture: Voiture;
}