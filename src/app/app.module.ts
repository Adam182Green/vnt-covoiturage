import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { FirestoreProvider } from '../providers/firestore/firestore';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    JourneyPage,
    ListPage,
    LoginPage,
    MesReservationsPage,
    MesTrajetsPage,
    RegisterPage,
    ReservationPage
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
    FirestoreProvider
  ]
})
export class AppModule {}
