import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

	loading: Loading;

  	constructor(public loadingCtrl: LoadingController) { }

  	public show(message: string) {
  		if(!this.loading){
		    this.loading = this.loadingCtrl.create({
		      content: message
		    });
		    this.loading.present();
		}
  	}

  	public hide(){
  		if(this.loading){
  			this.loading.dismiss();
  			this.loading = null;
  		}
  	}
}
