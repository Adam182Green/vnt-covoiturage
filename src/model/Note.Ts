import { Compte } from './Compte';
import { Trajet } from './Trajet';

export class Note {
	ref: any;
	concernant: Compte;
	ecritPar: Compte;
	message: string;
	note: number;
	trajet: Trajet;
	type: string;
}