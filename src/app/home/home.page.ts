import { Component } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user: any;
  events: any;
  isAuthenticated: boolean = false;
  token: any;

  constructor(
    private msAdal: MSAdal,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private router: Router
  ) {
  }

  async signIn(): Promise<void>{

    const loading = await this.loadingCtrl.create({
      message: 'Autenticando'
    });

    await loading.present();

    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

    authContext.acquireTokenAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f', 'com.nvstec.app.nvsmeeting://home','','')
    .then((authResponse: AuthenticationResult) => {
      this.token = authResponse.accessToken;
      console.log("token",this.token);
      this.http.get("https://graph.microsoft.com/beta/me/findRooms",{
        headers: new HttpHeaders({"Authorization": "Bearer "+ authResponse.accessToken,"Content-Type":"application/json"})
      }).subscribe(res => {
        loading.dismiss();
        let navigationExtras: NavigationExtras = {
          state: {
            rooms: res["value"],
            token: this.token
          }
        }
        this.router.navigate(['/rooms-list'],navigationExtras);
      })
    })
    .catch((e: any) => console.log('Authentication failed', e));
  }

  async getEvents(){

    const loading = await this.loadingCtrl.create({
      message: 'Buscando eventos'
    });

    await loading.present();
    
    this.http.get("https://graph.microsoft.com/v1.0/me/events",{
        headers: new HttpHeaders({"Authorization": "Bearer "+ this.token})
      }).subscribe(res => {
        loading.dismiss();
        console.log("events",res);
      })
  }
}
