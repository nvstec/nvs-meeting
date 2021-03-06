import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-room-events-modal',
  templateUrl: './room-events-modal.page.html',
  styleUrls: ['./room-events-modal.page.scss'],
})
export class RoomEventsModalPage implements OnInit {

  @Input() token:any;
  @Input() roomName:any;
  @Input() roomEmail:any;
  @Input() idCalendar:any;
  @Input() nextEventStart: any;
  @Input() difference: any;

  eventName: any = "Reunião ";
  eventDuration: any;

  isBookBtnDisabled: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    private msAdal: MSAdal,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
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
      message: 'Ocorreu um erro ao agendar o evento, tente novamente. Se o problema insistir contate o administrador local.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async bookClicked(){
    let now = new Date();
    let nowFormatted = moment(now).format();
    let endFormattedFinal = '';

    if(this.eventDuration == 9999){
      this.eventDuration = this.difference;
      let endFormatted = moment(now).add(this.eventDuration,'m').format();
      endFormattedFinal = moment(endFormatted).subtract(30,'s').format();
    }
    else{
      endFormattedFinal = moment(now).add(this.eventDuration,'m').format();
    }

    const loading = await this.loadingCtrl.create({
      message: 'Criando evento'
    });

    loading.present();

    let url = "https://graph.microsoft.com/v1.0/users/"+this.roomEmail+"/calendars/"+this.idCalendar+"/events";

    let body = {
      subject: this.eventName,
      start: {
        dateTime: nowFormatted,
        timeZone: "America/Sao_Paulo"
      },
      end: {
        dateTime: endFormattedFinal,
        timeZone: "America/Sao_Paulo"
      },
      location: {
        displayName: this.roomName,
        locationEmailAddress: this.roomEmail
      },
      attendees: [
        {
          emailAddress: {
            address: this.roomEmail,
            name: this.roomName
          },
          type: "resource"
        }
      ]
    };

    this.storage.get('token').then((val) => {
      if(val){
        this.http.post(url, body, {
          headers: new HttpHeaders({"Authorization": "Bearer "+ val,"Content-Type":"application/json"})
        }).subscribe(res => {
          loading.dismiss();
          console.log("response: ", res);

          let dateStartParsed = new Date(nowFormatted);
          let dateEndParsed = new Date(endFormattedFinal);

          let formattedStartHour;
          let formattedStartMinute;
          let formattedEndHour;
          let formattedEndMinute;
          if(dateStartParsed.getHours() >= 0 && dateStartParsed.getHours() <= 9){
            formattedStartHour = "0"+dateStartParsed.getHours();
          }
          else{
            formattedStartHour = dateStartParsed.getHours();
          }
          if(dateEndParsed.getHours() >= 0 && dateEndParsed.getHours() <= 9){
            formattedEndHour = "0"+dateEndParsed.getHours();
          }
          else{
            formattedEndHour = dateEndParsed.getHours();
          }
          if(dateStartParsed.getMinutes() >= 0 && dateStartParsed.getMinutes() <= 9){
            formattedStartMinute = "0"+dateStartParsed.getMinutes();
          }
          else{
            formattedStartMinute = dateStartParsed.getMinutes();
          }
          if(dateEndParsed.getMinutes() >= 0 && dateEndParsed.getMinutes() <= 9){
            formattedEndMinute = "0"+dateEndParsed.getMinutes();
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
            eventEnd: dateEndParsed,
            eventId: res["id"],
            idCalendar: this.idCalendar
          }

          this.modalCtrl.dismiss(event);
        }, err =>{
          loading.dismiss();
          console.log("erro", err);
          this.presentErrorAlert();
        });
      }
      else{
        loading.dismiss();
        console.log("token undefined error");
        this.presentErrorAlert();
      }
    });
  }
}
