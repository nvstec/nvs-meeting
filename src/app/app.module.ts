import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { MsalModule } from '@azure/msal-angular';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClientModule } from '@angular/common/http'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';

import { RoomEventsModalPageModule } from './room-events-modal/room-events-modal.module';
import { RoomExtendModalPageModule } from './room-extend-modal/room-extend-modal.module';

import { OAuthSettings } from '../oauth';
import {LOCALE_ID} from '@angular/core';
import localePt from '@angular/common/locales/pt'

import { registerLocaleData } from '@angular/common';
registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    RoomEventsModalPageModule,
    RoomExtendModalPageModule,
    MsalModule.forRoot({
      clientID: OAuthSettings.appId
    })
  ],
  providers: [
    StatusBar,
    MSAdal,
    SplashScreen,
    ScreenOrientation,
    NavigationBar,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
