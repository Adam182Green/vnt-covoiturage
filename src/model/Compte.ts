import { Note } from './Note';
import { Reservation } from './Reservation';
import { Trajet } from './Trajet';
import { Voiture } from './Voiture';

export class Compte {
	ref: any;
	dateDeNaissance: Date;
	email: string;
	motDePasse: string;
	nom: string;
	notes: Note[];
	notesConducteur: Note[];
	notesPassager: Note[];
	prenom: string;
	reservations: Reservation[];
	trajetsConducteur: Trajet[];
	voitures: Voiture[];
}