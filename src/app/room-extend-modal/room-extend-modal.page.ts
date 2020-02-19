import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';

@Component({
  selector: 'app-room-extend-modal',
  templateUrl: './room-extend-modal.page.html',
  styleUrls: ['./room-extend-modal.page.scss'],
})
export class RoomExtendModalPage implements OnInit {

  @Input() token:any;
  @Input() roomName:any;
  @Input() roomEmail:any;
  @Input() eventName: any;
  @Input() eventId: any;
  @Input() eventEnd: any;
  @Input() idCalendar: any;

  extendDuration: any;
  isExtendBtnDisabled: boolean = true;

  constructor(
    private http: HttpClient,
    private msAdal: MSAdal,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  checkBtnEnabled(value){
    if(this.extendDuration){
      this.isExtendBtnDisabled = false;
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Ocorreu um erro ao extender a reunião, tente novamente. Se o problema insistir contate o Administrador.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async extendClicked(){

    const loading = await this.loadingCtrl.create({
      message: 'Extendendo reunião'
    });

    loading.present();

    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

    authContext.acquireTokenSilentAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f','').then((authResponse: AuthenticationResult) => {
      console.log("responseSilentToken",authResponse);

      let url = "https://graph.microsoft.com/v1.0/users/marine@nvstec.com/calendars/"+this.idCalendar+"/events/"+this.eventId;

      let meetingEnd = moment(this.eventEnd).add(this.extendDuration,'m').format();

      let body = {
        end: {
          dateTime: meetingEnd,
          timeZone: "America/Sao_Paulo"
        }
      }

      this.http.patch(url, body, {
        headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
      }).subscribe(res => {
        loading.dismiss();

        let dateStartParsed = new Date(res["start"].dateTime);
        let dateEndParsed = new Date(res["end"].dateTime);

        let formattedStartHour;
        let formattedStartMinute;
        let formattedEndHour;
        let formattedEndMinute;

        if(dateStartParsed.getHours()-3 == 0){
          formattedStartHour = "00";
        }
        else{
          formattedStartHour = dateStartParsed.getHours()-3;
        }
        if(dateEndParsed.getHours()-3 == 0){
          formattedEndHour = "00";
        }
        else{
          formattedEndHour = dateEndParsed.getHours()-3;
        }
        if(dateStartParsed.getMinutes() == 0){
          formattedStartMinute = "00";
        }
        else{
          formattedStartMinute = dateStartParsed.getMinutes();
        }
        if(dateEndParsed.getMinutes() == 0){
          formattedEndMinute = "00";
        }
        else{
          formattedEndMinute = dateEndParsed.getMinutes()
        }

        let event = {
          subject: this.eventName,
          formattedStartHour: formattedStartHour,
          formattedStartMinutes: formattedStartMinute,
          formattedEndHour: formattedEndHour,
          formattedEndMinutes: formattedEndMinute,
          eventId: res["id"],
          idCalendar: this.idCalendar
        }

        this.modalCtrl.dismiss(event);
      }, err =>{
        loading.dismiss();
        console.log("erro", err);
        this.presentErrorAlert();
      })
      }
  ).catch((e: any) => {
    loading.dismiss();
    this.presentErrorAlert();
    console.log('Authentication failed', e);
  });
  }
}
