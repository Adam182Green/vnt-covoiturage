import { Injectable } from '@angular/core';

@Injectable()
export class DateHelperProvider {

    constructor() {}

    public getDisplayDate(date: Date) : string {
        var dayString : string;
        var monthString : string;
        var dayOfWeek = date.getDay();
        var day = date.getDate();     
        const year = date.getFullYear().toString();

		if(dayOfWeek == 1) dayString = "Lundi";
		else if(dayOfWeek == 2) dayString = "Mardi";
		else if(dayOfWeek == 3) dayString = "Mercredi";
		else if(dayOfWeek == 4) dayString = "Jeudi";
		else if(dayOfWeek == 5) dayString = "Vendredi";
		else if(dayOfWeek == 6) dayString = "Samedi";
		else if(dayOfWeek == 0) dayString = "Dimanche";
		
		const month = date.getMonth();
        if(month === 0) monthString = "Janvier";
        else if(month === 1) monthString = "Février";
        else if(month === 2) monthString = "Mars";
        else if(month === 3) monthString = "Avril";
        else if(month === 4) monthString = "Mai";
        else if(month === 5) monthString = "Juin";
        else if(month === 6) monthString = "Juillet";
        else if(month === 7) monthString = "Août";
        else if(month === 8) monthString = "Septembre";
        else if(month === 9) monthString = "Octobre";
        else if(month === 10) monthString = "Novembre";
        else if(month === 11) monthString = "Decembre";

		return dayString + ' ' + day + ' ' + monthString + ' ' + year;
	}

    public getDisplayDateOfTimestamp(timestamp: any): string {
       return this.getDisplayDate(timestamp.toDate());
    }
}