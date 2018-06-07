import { Compte } from './Compte';
import { Trajet } from './Trajet';

export class Reservation{
	demandeur: Compte;
	etat: string;
	trajet: Trajet;
}