import { Compte } from './Compte';
import { Trajet } from './Trajet';

export class Reservation {
	ref: any;
	demandeur: Compte;
	etat: string;
	trajet: Trajet;
}