import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

	loading: Loading;

  	constructor(public loadingCtrl: LoadingController) { }

  	public showLoading(message: string) {
	    this.loading = this.loadingCtrl.create({
	      content: message
	    });
	    this.loading.present();
  	}

  	public hideLoading(){
  		this.loading.dismiss();
  	}
}
