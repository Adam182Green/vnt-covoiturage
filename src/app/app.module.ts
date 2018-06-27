import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from './firestore.config';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { JourneyPage } from '../pages/journey/journey';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MesReservationsPage } from '../pages/mes-reservations/mes-reservations';
import { MesTrajetsPage } from '../pages/mes-trajets/mes-trajets';
import { RegisterPage } from '../pages/register/register';
import { ReservationPage } from '../pages/reservation/reservation';
import { CreateTrajetPage } from '../pages/create-trajet/create-trajet'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { DateHelperProvider } from '../providers/date-helper/date-helper';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { LoadingProvider } from '../providers/loading/loading';

import { ExpandableComponent } from '../components/expandable/expandable';

@NgModule({
  declarations: [
    MyApp,
    CreateTrajetPage,
    HomePage,
    JourneyPage,
    ListPage,
    LoginPage,
    MesReservationsPage,
    MesTrajetsPage,
    RegisterPage,
    ReservationPage,
    ExpandableComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CreateTrajetPage,
    HomePage,
    JourneyPage,
    ListPage,
    LoginPage,
    MesReservationsPage,
    MesTrajetsPage,
    RegisterPage,
    ReservationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    DateHelperProvider,
    FirestoreProvider,    
    LoadingProvider
  ]
})
export class AppModule {}
