import { Compte } from './Compte';

export class Voiture {
	ref: any;
	immatriculation: string;
	marque: string;
	modele: string;
	proprietaires: Compte[];
}