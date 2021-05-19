import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { RoomEventsModalPage } from '../room-events-modal/room-events-modal.page';
import { RoomExtendModalPage } from '../room-extend-modal/room-extend-modal.page';
import { Storage } from '@ionic/storage';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-room-events',
  templateUrl: './room-events.page.html',
  styleUrls: ['./room-events.page.scss'],
})
export class RoomEventsPage implements OnInit {

  obj: any;
  token: any;
  roomName: any;
  roomEmail: any;
  idCalendar: any;

  clock: any = new Date();
  timer: any;
  timer2: any;
  todayEventsArray = [];
  currentMeeting: any = null;

  disabledExtendBtn: boolean = false;

  btnUsarCssClass = 'btn-usar-room-event'
  btnFinalizarCssClass = 'btn-finalizar-room-event'
  btnExtenderCssClass = 'btn-extender-room-event'

  constructor(
    private msAdal: MSAdal,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private http: HttpClient,
    public modalCtrl: ModalController,
    private storage: Storage,
    private navigationBar: NavigationBar,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.clock = moment(this.clock).format();
        this.obj = this.router.getCurrentNavigation().extras.state.roomEvents;
        this.token = this.router.getCurrentNavigation().extras.state.token;
        this.roomName = this.router.getCurrentNavigation().extras.state.roomName;
        this.roomEmail = this.router.getCurrentNavigation().extras.state.roomEmail;
        this.idCalendar = this.router.getCurrentNavigation().extras.state.idCalendar;
        this.createTodayEventsArray(this.obj);
        this.checkMeetingNow(this.obj);
      }
    });
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      let now = new Date();
      this.clock = moment(now).format();
      this.refreshTodayEventsArray();
    }, 40000);
  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Ocorreu um erro ao atualizar os eventos.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAuthenticationErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Sua sessão expirou. Por favor faça novamente o login',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.storage.set('token',null);
          this.router.navigate(['/home']);
        }
      }]
    });

    await alert.present();
  }

  async presentErrorEndMeetingAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Erro!',
      message: 'Ocorreu um erro ao encerrar o evento.',
      buttons: ['OK']
    });

    await alert.present();
  }

  createTodayEventsArray(array:any){
    let now = new Date();
    array.forEach(element => {
      let dateStartParsed = new Date(element.start.dateTime);
      let dateEndParsed = new Date(element.end.dateTime);

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
      if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours() >= now.getHours()){
        if(dateStartParsed.getHours() == now.getHours()){
          if(dateStartParsed.getMinutes() > now.getMinutes()){
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
            let temp = {
              subject: element.subject,
              startHour: dateStartParsed,
              formattedStartHour: formattedStartHour,
              formattedStartMinutes: formattedStartMinute,
              formattedEndHour: formattedEndHour,
              formattedEndMinutes: formattedEndMinute
            }
            this.todayEventsArray.push(temp);
          }
        }
        else{
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
          let temp = {
            subject: element.subject,
            startHour: dateStartParsed,
            formattedStartHour: formattedStartHour,
            formattedStartMinutes: formattedStartMinute,
            formattedEndHour: formattedEndHour,
            formattedEndMinutes: formattedEndMinute
          }
          this.todayEventsArray.push(temp);
        }
      }
    });
    this.todayEventsArray.sort(function(a,b){
      return a.startHour - b.startHour;
    });
  }

  async refreshTodayEventsArray(){
    let now = new Date();
    let newEventsArray = [];

    let url = "https://graph.microsoft.com/v1.0/users/"+this.roomEmail+"/events";

    this.http.get(url,{
      headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
    }).subscribe(res => {
      console.log("token",this.token);
      console.log("refreshed events",res["value"]);
      res["value"].forEach(element => {
        let dateStartParsed = new Date(element.start.dateTime);
        let dateEndParsed = new Date(element.end.dateTime);

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
        if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours() >= now.getHours()){
          if(dateStartParsed.getHours() == now.getHours()){
            if(dateStartParsed.getMinutes() > now.getMinutes()){
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
                formattedEndMinute = dateEndParsed.getMinutes();
              }
              let temp = {
                subject: element.subject,
                startHour: dateStartParsed,
                formattedStartHour: formattedStartHour,
                formattedStartMinutes: formattedStartMinute,
                formattedEndHour: formattedEndHour,
                formattedEndMinutes: formattedEndMinute
              }
              newEventsArray.push(temp);
            }
          }
          else{
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
            let temp = {
              subject: element.subject,
              startHour: dateStartParsed,
              formattedStartHour: formattedStartHour,
              formattedStartMinutes: formattedStartMinute,
              formattedEndHour: formattedEndHour,
              formattedEndMinutes: formattedEndMinute,
              eventId: element.id
            }
            newEventsArray.push(temp);
          }
        }
      });
      newEventsArray.sort(function(a,b){
        return a.startHour - b.startHour;
      });
      this.todayEventsArray = newEventsArray;
      this.checkMeetingNow(res["value"]);
    }, err =>{
      console.log("get events api error", err);
      let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

      authContext.acquireTokenSilentAsync('https://graph.microsoft.com', environment.AZURE_CLIENT_ID, '')
      .then((authResponse: AuthenticationResult) => {
        this.storage.set('token',authResponse.accessToken);
        this.token = authResponse.accessToken;
        console.log("authResponse",authResponse);
      })
      .catch((e: any) => {
        this.presentAuthenticationErrorAlert();
      });
    })
  }

  checkMeetingNow(array:any){
    let foundMeeting = false;
    let now = new Date();
    console.log("checking for event right now: ",now);

    array.forEach(element => {
      let dateStartParsed = new Date(element.start.dateTime);
      let dateEndParsed = new Date(element.end.dateTime);

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

      let meetingStart;
      let meetingEnd;

      meetingStart = moment(dateStartParsed).format();
      meetingEnd = moment(dateEndParsed).format();

      let nowFormatted = moment(now).format();

      if(!element.isCancelled && nowFormatted >= meetingStart && nowFormatted < meetingEnd){
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
        let obj = {
          subject: element.subject,
          formattedStartHour: formattedStartHour,
          formattedStartMinutes: formattedStartMinute,
          formattedEndHour: formattedEndHour,
          formattedEndMinutes: formattedEndMinute,
          eventEnd: meetingEnd,
          eventId: element.id
        }
        this.currentMeeting = obj;
        foundMeeting = true;
        console.log("found meeting right now");
        if(this.todayEventsArray.length > 0){
          let temp = moment(this.currentMeeting.eventEnd);
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour);
          let difference = temp.diff(nextEventStartTime, 'minutes') * -1;
          if(difference <= 1){
            this.disabledExtendBtn = true;
          }
          else{
            this.disabledExtendBtn = false;
          }
        }
      }
    });
    if(!foundMeeting){
      console.log("didnt find meeting right now");
      this.currentMeeting = null;
    }
  }

  async useRoomClicked(){

    this.btnUsarCssClass = 'btn-usar-room-event-selected';

    setTimeout(() => {
      this.btnUsarCssClass = 'btn-usar-room-event';
    }, 250);

    let cssClass = 'custom-case-4-room-events-modal';
    let modal:any;

    if(this.todayEventsArray.length > 0){
      let now = new Date();
      let temp = moment(now);
      let nextEventStartTime = moment(this.todayEventsArray[0].startHour);
      let nextEventStartTimeFormatted = nextEventStartTime.format();
      let difference = temp.diff(nextEventStartTime, 'minutes') * -1;

      if(difference <= 15){
        cssClass = 'custom-case-1-room-events-modal';
      }
      else if(difference <= 30){
        cssClass = 'custom-case-2-room-events-modal';
      }
      else if(difference <= 45){
        cssClass = 'custom-case-3-room-events-modal';
      }
      else if(difference <= 60){
        cssClass = 'custom-room-events-modal';
      }

      modal = await this.modalCtrl.create({
        component: RoomEventsModalPage,
        componentProps: {
          token: this.token,
          roomName: this.roomName,
          roomEmail: this.roomEmail,
          idCalendar: this.idCalendar,
          nextEventStart: nextEventStartTimeFormatted,
          difference: difference
        },
        cssClass: cssClass
      });
    }
    else{
      modal = await this.modalCtrl.create({
        component: RoomEventsModalPage,
        componentProps: {
          token: this.token,
          roomName: this.roomName,
          roomEmail: this.roomEmail,
          idCalendar: this.idCalendar,
          nextEventStart: null
        },
        cssClass: 'custom-room-events-modal'
      });
    }
    

    modal.onDidDismiss().then((res) => {
      this.navigationBar.hideNavigationBar();
      let now = new Date();
      this.clock = moment(now).format();
      
      if(res.data){
        this.currentMeeting = res.data;

        if(this.todayEventsArray.length > 0){
          let temp = moment(this.currentMeeting.eventEnd);
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour);
          let difference = temp.diff(nextEventStartTime, 'minutes') * -1;
          if(difference <= 1){
            this.disabledExtendBtn = true;
          }
          else{
            this.disabledExtendBtn = false;
          }
        }
      }
    });
    return await modal.present();
  }

  async extendRoomClicked(){

    this.btnExtenderCssClass = 'btn-extender-room-event-selected';

    setTimeout(() => {
      this.btnExtenderCssClass = 'btn-extender-room-event';
    }, 250);

    let cssClass = 'custom-extend-events-next-event-modal';
    let modal:any;

    if(this.todayEventsArray.length > 0){
      let temp = moment(this.currentMeeting.eventEnd);
      let nextEventStartTime = moment(this.todayEventsArray[0].startHour);
      let nextEventStartTimeFormatted = nextEventStartTime.format();
      let difference = temp.diff(nextEventStartTime, 'minutes') * -1;

      if(difference <= 15){
        cssClass = 'custom-extend-events-case-1-next-event-modal';
      }
      else if(difference <= 30){
        cssClass = 'custom-extend-events-case-2-next-event-modal';
      }
      else if(difference <= 45){
        cssClass = 'custom-extend-events-case-3-next-event-modal';
      }
      else if(difference <= 60){
        cssClass = 'custom-extend-events-modal';
      }

      modal = await this.modalCtrl.create({
        component: RoomExtendModalPage,
        componentProps: {
          token: this.token,
          roomName: this.roomName,
          roomEmail: this.roomEmail,
          eventName: this.currentMeeting.subject,
          eventId: this.currentMeeting.eventId,
          eventEnd: this.currentMeeting.eventEnd,
          idCalendar: this.idCalendar,
          nextEventStart: nextEventStartTimeFormatted,
          difference: difference
        },
        cssClass: cssClass
      });
    }
    else{
      modal = await this.modalCtrl.create({
        component: RoomExtendModalPage,
        componentProps: {
          token: this.token,
          roomName: this.roomName,
          roomEmail: this.roomEmail,
          eventName: this.currentMeeting.subject,
          eventId: this.currentMeeting.eventId,
          eventEnd: this.currentMeeting.eventEnd,
          idCalendar: this.idCalendar,
          nextEventStart: null
        },
        cssClass: 'custom-extend-events-modal'
      });
    }

    modal.onDidDismiss().then((res) => {
      let now = new Date();
      this.clock = moment(now).format();
      if(res.data){
        this.currentMeeting = res.data;
        if(this.todayEventsArray.length > 0){
          let temp = moment(this.currentMeeting.eventEnd);
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour);
          let difference = temp.diff(nextEventStartTime, 'minutes') * -1;
          if(difference <= 1){
            this.disabledExtendBtn = true;
          }
          else{
            this.disabledExtendBtn = false;
          }
        }
      }
    });

    return await modal.present();
  }
 
  async finishMeetingClicked(){

    this.btnFinalizarCssClass = 'btn-finalizar-room-event-selected';

    setTimeout(() => {
      this.btnFinalizarCssClass = 'btn-finalizar-room-event';
    }, 250);

    const loading = await this.loadingCtrl.create({
      message: 'Encerrando reunião'
    });

    const alert = await this.alertCtrl.create({
      header: 'Confirmar encerramento',
      message: 'Deseja realmente encerrar a reunião?',
      buttons: [
        {
          text: 'NÃO',
          role: 'cancel',
        }, {
          text: 'SIM',
          handler: () => {
            loading.present();

            let url = "https://graph.microsoft.com/v1.0/users/marine@nvstec.com/calendars/"+this.idCalendar+"/events/"+this.currentMeeting.eventId;

            let now = new Date();
            let meetingEnd = moment(now).format();

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

              this.currentMeeting = null;
            }, err =>{
              loading.dismiss();
              console.log("finish meeting api error", err);
              this.presentErrorEndMeetingAlert();
            })
          }
        }
      ]
    });
    await alert.present();
  }
}
