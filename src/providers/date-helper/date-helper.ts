import { Injectable } from '@angular/core';

@Injectable()
export class DateHelperProvider {

    constructor() {}

    public getDisplayDate(date: Date) : string {
        var dayString : string;
        var monthString : string;
        const day = date.getDay().toString();        
        const year = date.getFullYear().toString();

        const dateString = date.toDateString().toUpperCase();
		if(dateString.includes("MON")) dayString = "Lundi";
		else if(dateString.includes("TUE")) dayString = "Mardi";
		else if(dateString.includes("WED")) dayString = "Mercredi";
		else if(dateString.includes("THU")) dayString = "Jeudi";
		else if(dateString.includes("FRY")) dayString = "Vendredi";
		else if(dateString.includes("SAT")) dayString = "Samedi";
		else if(dateString.includes("SUN")) dayString = "Dimanche";
		
		const month = date.getMonth();
        if(month === 1) monthString = "Janvier";
        else if(month === 2) monthString = "Février";
        else if(month === 3) monthString = "Mars";
        else if(month === 4) monthString = "Avril";
        else if(month === 5) monthString = "Mai";
        else if(month === 6) monthString = "Juin";
        else if(month === 7) monthString = "Juillet";
        else if(month === 8) monthString = "Août";
        else if(month === 9) monthString = "Septembre";
        else if(month === 10) monthString = "Octobre";
        else if(month === 11) monthString = "Novembre";
        else if(month === 12) monthString = "Decembre";

		return dayString + ' ' + day + ' ' + monthString + ' ' + year;
	}
}