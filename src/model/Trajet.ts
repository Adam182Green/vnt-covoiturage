import { Compte } from './Compte';
import { Reservation } from './Reservation';
import { Voiture } from './Voiture';

export class Trajet {
	ref: any;
	conducteur: Compte;
	dateDapart: Date;
	nombreDePlaces: number;
	passagers: Compte[];
	reservations: Reservation[];
	villeArrivee: string;
	villeDepart: string;
	voiture: Voiture;
}