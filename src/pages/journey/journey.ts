import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Trajet } from '../../model/Trajet';

@IonicPage()
@Component({
  selector: 'page-journey',
  templateUrl: 'journey.html',
})
export class JourneyPage {

	journey: Trajet;
	leaveDate = "";

  	constructor(public navCtrl: NavController, public navParams: NavParams) {
  		this.journey = navParams.get('journey');
  		this.leaveDate = this.journey.dateDapart.toDateString();
  	}

  	onClickButtonReserve(){
  		//TODO
  	}
}
