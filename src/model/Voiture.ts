import { Compte } from './Compte';

export class Voiture {
	immatriculation: string;
	marque: string;
	modele: string;
	proprietaires: Compte[];
}