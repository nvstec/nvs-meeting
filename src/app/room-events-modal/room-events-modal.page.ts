import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-room-events-modal',
  templateUrl: './room-events-modal.page.html',
  styleUrls: ['./room-events-modal.page.scss'],
})
export class RoomEventsModalPage implements OnInit {

  @Input() token:any;
  @Input() roomName:any;
  @Input() roomEmail:any;

  eventName: any;
  eventDuration: any;

  isBookBtnDisabled: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    private msAdal: MSAdal,
    private alertCtrl: AlertController,
    private http: HttpClient
    ) {

    }

  ngOnInit() {
  }

  checkBtnEnabled(value){
    if(this.eventName && this.eventDuration){
      this.isBookBtnDisabled = false;
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Ocorreu um erro ao agendar o evento, tente novamente. Se o problema insistir contate o Administrador.',
      buttons: ['OK']
    });

    await alert.present();
  }

  bookClicked(){
    let now = new Date();
    let nowFormatted = moment(now).add( 1,'h').format();
    let temp = moment(now).add( 1,'h');
    let endFormatted = temp.add(this.eventDuration,'m').format();

    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

    authContext.acquireTokenSilentAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f','').then((authResponse: AuthenticationResult) => {
      console.log("responseSilentToken",authResponse);
      this.token = authResponse.accessToken;
      let url = "https://graph.microsoft.com/v1.0/me/events";

      let body = {
        subject: this.eventName,
        start: {
          dateTime: nowFormatted,
          timeZone: "America/Sao_Paulo"
        },
        end: {
          dateTime: endFormatted,
          timeZone: "America/Sao_Paulo"
        },
        location: {
          displayName: this.roomName,
          locationEmailAddress: this.roomEmail
        },
        attendees: [
          {
            emailAddress: {
              address: authResponse.userInfo.uniqueId,
              name: authResponse.userInfo.displayableId
            },
            type: "required"
          },
          {
            emailAddress: {
              address: this.roomEmail,
              name: this.roomName
            },
            type: "resource"
          }
        ]
      }

      this.http.post(url, body, {
        headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
      }).subscribe(res => {
        console.log("response: ", res);
        this.modalCtrl.dismiss();
      }, err =>{
        console.log("erro", err);
        this.presentErrorAlert();
      })
      }
    ).catch((e: any) => {
      this.presentErrorAlert();
      console.log('Authentication failed', e);
    });
  }
}
