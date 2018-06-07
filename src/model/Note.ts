import { Compte } from './Compte';
import { Trajet } from './Trajet';

export class Note {
	concernant: Compte;
	ecritPar: Compte;
	message: string;
	note: number;
	trajet: Trajet;
	type: string;
}