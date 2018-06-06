import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Account } from '../../model/Account'

@Injectable()
export class AuthServiceProvider {

  currentAccount: Account;

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentAccount = new Account('test@test.com', 'test', 'TestFirstName', 'TestSurname');
        observer.next(access);
        observer.complete();
      });
    }
  }
 
  public register(credentials) {
    if (credentials.firstName === null || credentials.surname === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Veuillez saisir vos identifiants");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getAccount() : Account {
    return this.currentAccount;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentAccount = null;
      observer.next(true);
      observer.complete();
    });
  }

}
