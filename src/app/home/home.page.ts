import { Component } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { environment } from '../../environments/environment';

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

  appV: any = '0.0.0';
  appCode: any = '00000';

  constructor(
    private platform: Platform,
    private msAdal: MSAdal,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private appVersion: AppVersion,
    private storage: Storage
  ) {
    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then((res)=>{
        this.appV = res;
        this.appVersion.getVersionCode().then((res2)=>{
          this.appCode = res2;
        });
      });
    });
  }

  ngOnInit(){
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Ocorreu um erro ao realizar o login, tente novamente. Se o problema insistir contate o administrador local.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async signIn(): Promise<void>{

    const loading = await this.loadingCtrl.create({
      message: 'Autenticando'
    });

    const loading2 = await this.loadingCtrl.create({
      message: 'Carregando'
    });

    this.storage.get('token').then((val) => {
      if(val){
        console.log("storage token",val);
        loading2.present();

        this.http.get("https://graph.microsoft.com/beta/me/findRooms",{
            headers: new HttpHeaders({"Authorization": "Bearer "+ val,"Content-Type":"application/json"})
        }).subscribe(res => {
          loading2.dismiss();
          let navigationExtras: NavigationExtras = {
            state: {
              rooms: res["value"],
              token: val
            }
          }
          this.router.navigate(['/rooms-list'],navigationExtras);
        },async err => {
          loading2.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Ops!',
            message: 'Sua sessão expirou. Por favor faça novamente o login',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  loading.present();
      
                  let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    
                  authContext.acquireTokenAsync('https://graph.microsoft.com', environment.AZURE_CLIENT_ID, 'com.nvstec.app.nvsmeeting://home','','')
                  .then((authResponse: AuthenticationResult) => {
                    loading2.dismiss();
                    this.storage.set('token',authResponse.accessToken);
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
                  .catch((e: any) => {
                    loading.dismiss();
                    console.log('Authentication failed', e);
                    this.presentErrorAlert();
                  });
                }
              }
            ]
          });
          alert.present();
        })
      }
      else{
        loading.present();
    
        let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    
        authContext.acquireTokenAsync('https://graph.microsoft.com', environment.AZURE_CLIENT_ID, 'com.nvstec.app.nvsmeeting://home','','')
        .then((authResponse: AuthenticationResult) => {
          this.storage.set('token',authResponse.accessToken);
          this.token = authResponse.accessToken;
          console.log("authResponse",authResponse);
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
        .catch((e: any) => {
          loading.dismiss();
          console.log('Authentication failed', e);
          this.presentErrorAlert();
        });
      }
    });
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
