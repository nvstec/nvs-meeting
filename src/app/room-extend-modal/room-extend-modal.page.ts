import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController, AlertController, Platform } from '@ionic/angular';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { Storage } from '@ionic/storage';

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
  @Input() nextEventStart: any;
  @Input() difference: any;

  extendDuration: any;
  isExtendBtnDisabled: boolean = true;

  constructor(
    private http: HttpClient,
    private msAdal: MSAdal,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private platform: Platform
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
      message: 'Ocorreu um erro ao extender a reunião, tente novamente. Se o problema insistir contate o administrador local.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async extendClicked(){

    const loading = await this.loadingCtrl.create({
      message: 'Extendendo reunião'
    });

    loading.present();

    let url = "https://graph.microsoft.com/v1.0/users/marine@nvstec.com/calendars/"+this.idCalendar+"/events/"+this.eventId;

    let meetingEnd = '';
    let meetingEndFinal = '';
    if(this.extendDuration == 9999){
      this.extendDuration = this.difference;
      meetingEnd = moment(this.eventEnd).add(this.extendDuration,'m').format();
      meetingEndFinal = moment(meetingEnd).subtract(30,'s').format();
    }
    else{
      meetingEndFinal = moment(this.eventEnd).add(this.extendDuration,'m').format();
    }

    let body = {
      end: {
        dateTime: meetingEndFinal,
        timeZone: "America/Sao_Paulo"
      }
    }

    this.storage.get('token').then((val) => {
      if(val){
        this.http.patch(url, body, {
          headers: new HttpHeaders({"Authorization": "Bearer "+ val,"Content-Type":"application/json"})
        }).subscribe(res => {
          loading.dismiss();

          let dateStartParsed = new Date(res["start"].dateTime);
          let dateEndParsed = new Date(res["end"].dateTime);

          let temp;
          let temp2;

          if(this.platform.is('ios')){
            temp = moment(dateStartParsed).format();
            temp2 = moment(dateEndParsed).format();
          }
          else{
            temp = moment(dateStartParsed).subtract(3,'h').format();
            temp2 = moment(dateEndParsed).subtract(3,'h').format();
          }

          dateStartParsed = new Date(temp);
          dateEndParsed = new Date(temp2);

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
            eventEnd: meetingEndFinal,
            eventId: res["id"],
            idCalendar: this.idCalendar
          };

          this.modalCtrl.dismiss(event);
        }, err =>{
          loading.dismiss();
          console.log("error api extend time", err);
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
