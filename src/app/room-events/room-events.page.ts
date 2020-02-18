import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { RoomEventsModalPage } from '../room-events-modal/room-events-modal.page';

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
  clock: any = new Date();
  timer: any;
  timer2: any;
  todayEventsArray = [];
  currentMeeting: any = null;

  constructor(
    private msAdal: MSAdal,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private http: HttpClient,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.clock = moment(this.clock).add( 1,'h').format();
        this.obj = this.router.getCurrentNavigation().extras.state.roomEvents;
        this.token = this.router.getCurrentNavigation().extras.state.token;
        this.roomName = this.router.getCurrentNavigation().extras.state.roomName;
        this.roomEmail = this.router.getCurrentNavigation().extras.state.roomEmail;
        console.log("obj",this.obj);
        this.createTodayEventsArray(this.obj);
        this.checkMeetingNow(this.obj);
      }
    });
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      let now = new Date();
      this.clock = moment(now).add( 1,'h').format();
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

  createTodayEventsArray(array:any){
    let now = new Date();
    array.forEach(element => {
      let dateStartParsed = new Date(element.start.dateTime);
      let dateEndParsed = new Date(element.end.dateTime);
      if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours()-3 >= now.getHours()+1){
        if(dateStartParsed.getHours()-3 == now.getHours()+1){
          if(dateStartParsed.getMinutes() > now.getMinutes()){
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
            let temp = {
              subject: element.subject,
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
          let temp = {
            subject: element.subject,
            formattedStartHour: formattedStartHour,
            formattedStartMinutes: formattedStartMinute,
            formattedEndHour: formattedEndHour,
            formattedEndMinutes: formattedEndMinute
          }
          this.todayEventsArray.push(temp);
        }
      }
    });
    this.todayEventsArray.reverse();
  }

  async refreshTodayEventsArray(){
    let now = new Date();
    let newEventsArray = [];

    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');

    authContext.acquireTokenSilentAsync('https://graph.microsoft.com', '03d4b82a-06df-4c21-99bd-ee5fec338c1f','').then((authResponse: AuthenticationResult) =>{
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
        if(!element.isCancelled && dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours()-3 >= now.getHours()+1){
          if(dateStartParsed.getHours()-3 == now.getHours()+1){
            if(dateStartParsed.getMinutes() > now.getMinutes()){
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
              let temp = {
                subject: element.subject,
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
            let temp = {
              subject: element.subject,
              formattedStartHour: formattedStartHour,
              formattedStartMinutes: formattedStartMinute,
              formattedEndHour: formattedEndHour,
              formattedEndMinutes: formattedEndMinute
            }
            newEventsArray.push(temp);
          }
        }
      });
      newEventsArray.reverse();
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
      let meetingStart = moment(element.start.dateTime).subtract(3,'h').format();
      let meetingEnd = moment(element.end.dateTime).subtract(3,'h').format();
      let nowFormatted = moment(now).add( 1,'h').format();

      if(!element.isCancelled && nowFormatted >= meetingStart && nowFormatted < meetingEnd){
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
        let obj = {
          subject: element.subject,
          formattedStartHour: formattedStartHour,
          formattedStartMinutes: formattedStartMinute,
          formattedEndHour: formattedEndHour,
          formattedEndMinutes: formattedEndMinute
        }
        this.currentMeeting = obj;
        foundMeeting = true;
        console.log("found meeting right now");
      }
    });
    if(!foundMeeting){
      console.log("didnt find meeting right now");
      this.currentMeeting = null;
    }
  }

  async useRoomClicked(){
    console.log("clicou usar sala");
    let modal = await this.modalCtrl.create({
      component: RoomEventsModalPage,
      componentProps: {
        token: this.token
      },
      cssClass: 'custom-room-events-modal'
    });
    return await modal.present();
  }
}
