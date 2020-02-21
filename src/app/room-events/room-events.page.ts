import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { RoomEventsModalPage } from '../room-events-modal/room-events-modal.page';
import { RoomExtendModalPage } from '../room-extend-modal/room-extend-modal.page';
import { Storage } from '@ionic/storage';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

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

  constructor(
    private msAdal: MSAdal,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private http: HttpClient,
    public modalCtrl: ModalController,
    private storage: Storage,
    private navigationBar: NavigationBar,
    private loadingCtrl: LoadingController
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
      let temp = moment(dateStartParsed).subtract(3,'h').format();
      let temp2 = moment(dateEndParsed).subtract(3,'h').format();
      dateStartParsed = new Date(temp);
      dateEndParsed = new Date(temp2);
      if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours() >= now.getHours()){
        if(dateStartParsed.getHours() == now.getHours()){
          if(dateStartParsed.getMinutes() > now.getMinutes()){
            let formattedStartHour;
            let formattedStartMinute;
            let formattedEndHour;
            let formattedEndMinute;
            if(dateStartParsed.getHours() == 0){
              formattedStartHour = "00";
            }
            else{
              formattedStartHour = dateStartParsed.getHours();
            }
            if(dateEndParsed.getHours() == 0){
              formattedEndHour = "00";
            }
            else{
              formattedEndHour = dateEndParsed.getHours();
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
          if(dateStartParsed.getHours() == 0){
            formattedStartHour = "00";
          }
          else{
            formattedStartHour = dateStartParsed.getHours();
          }
          if(dateEndParsed.getHours() == 0){
            formattedEndHour = "00";
          }
          else{
            formattedEndHour = dateEndParsed.getHours();
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

    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

    authContext.acquireTokenSilentAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f','').then((authResponse: AuthenticationResult) =>{
      this.storage.set('token',authResponse.accessToken);
      console.log("responseSilentToken",authResponse);
      this.token = authResponse.accessToken;
      let url = "https://graph.microsoft.com/v1.0/users/"+this.roomEmail+"/events";

    this.http.get(url,{
      headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
    }).subscribe(res => {
      console.log("refreshed events",res["value"]);
      res["value"].forEach(element => {
        let dateStartParsed = new Date(element.start.dateTime);
        let dateEndParsed = new Date(element.end.dateTime);
        let temp = moment(dateStartParsed).subtract(3,'h').format();
        let temp2 = moment(dateEndParsed).subtract(3,'h').format();
        dateStartParsed = new Date(temp);
        dateEndParsed = new Date(temp2);
        if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours() >= now.getHours()){
          if(dateStartParsed.getHours() == now.getHours()){
            if(dateStartParsed.getMinutes() > now.getMinutes()){
              let formattedStartHour;
              let formattedStartMinute;
              let formattedEndHour;
              let formattedEndMinute;
              if(dateStartParsed.getHours() == 0){
                formattedStartHour = "00";
              }
              else{
                formattedStartHour = dateStartParsed.getHours();
              }
              if(dateEndParsed.getHours() == 0){
                formattedEndHour = "00";
              }
              else{
                formattedEndHour = dateEndParsed.getHours();
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
            if(dateStartParsed.getHours() == 0){
              formattedStartHour = "00";
            }
            else{
              formattedStartHour = dateStartParsed.getHours();
            }
            if(dateEndParsed.getHours() == 0){
              formattedEndHour = "00";
            }
            else{
              formattedEndHour = dateEndParsed.getHours();
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
      console.log("erro", err);
      this.presentErrorAlert();
    })
    }
    ).catch((e: any) => console.log('Authentication failed', e));
  }

  checkMeetingNow(array:any){
    console.log("checking for event right now");
    let foundMeeting = false;
    let now = new Date();
    array.forEach(element => {
      let dateStartParsed = new Date(element.start.dateTime);
      let dateEndParsed = new Date(element.end.dateTime);
      let temp = moment(dateStartParsed).subtract(3,'h').format();
      let temp2 = moment(dateEndParsed).subtract(3,'h').format();
      dateStartParsed = new Date(temp);
      dateEndParsed = new Date(temp2);
      let meetingStart = moment(element.start.dateTime).subtract(3,'h').format();
      let meetingEnd = moment(element.end.dateTime).subtract(3,'h').format();
      let nowFormatted = moment(now).format();

      if(!element.isCancelled && nowFormatted >= meetingStart && nowFormatted < meetingEnd){
        let formattedStartHour;
        let formattedStartMinute;
        let formattedEndHour;
        let formattedEndMinute;
        if(dateStartParsed.getHours() == 0){
          formattedStartHour = "00";
        }
        else{
          formattedStartHour = dateStartParsed.getHours();
        }
        if(dateEndParsed.getHours() == 0){
          formattedEndHour = "00";
        }
        else{
          formattedEndHour = dateEndParsed.getHours();
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
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour).subtract(3,'h');
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

    let cssClass = 'custom-case-4-room-events-modal';
    let modal:any;

    if(this.todayEventsArray.length > 0){
      let now = new Date();
      let temp = moment(now);
      let nextEventStartTime = moment(this.todayEventsArray[0].startHour).subtract(3,'h');
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
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour).subtract(3,'h');
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

    let cssClass = 'custom-extend-events-next-event-modal';
    let modal:any;

    if(this.todayEventsArray.length > 0){
      let temp = moment(this.currentMeeting.eventEnd);
      let nextEventStartTime = moment(this.todayEventsArray[0].startHour).subtract(3,'h');
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
          let nextEventStartTime = moment(this.todayEventsArray[0].startHour).subtract(3,'h');
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

            let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

            authContext.acquireTokenSilentAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f','').then((authResponse: AuthenticationResult) => {
              console.log("responseSilentToken",authResponse);
              this.storage.set('token',authResponse.accessToken);
              
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
                console.log("erro", err);
                this.presentErrorEndMeetingAlert();
              })
              }
            ).catch((e: any) => {
              loading.dismiss();
              this.presentErrorEndMeetingAlert();
              console.log('Authentication failed', e);
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
