import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

	loading: Loading;

  	constructor(public loadingCtrl: LoadingController) { }

  	public show(message: string) {
	    this.loading = this.loadingCtrl.create({
	      content: message,
	      dismissOnPageChange: true
	    });
	    this.loading.present();
  	}

  	public hide(){
  		this.loading.dismiss();
  	}
}
