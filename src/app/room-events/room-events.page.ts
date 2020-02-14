import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';

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
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
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
      this.clock = new Date();
    }, 60000);

    setTimeout(()=>{
      this.timer2 = setInterval(() => {
        this.refreshTodayEventsArray();
        this.checkMeetingNow(this.obj);
      }, 60000);
    }, 60000);
  }

  ngOnDestroy(){
    clearInterval(this.timer);
    clearInterval(this.timer2);
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
      if(dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours()-3 >= now.getHours()+1){
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

    let url = "https://graph.microsoft.com/v1.0/users/"+this.roomEmail+"/events";

    this.http.get(url,{
      headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
    }).subscribe(res => {
      console.log("wololo",res);
      res["value"].forEach(element => {
        let dateStartParsed = new Date(element.start.dateTime);
        let dateEndParsed = new Date(element.end.dateTime);
        if(dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear() && dateStartParsed.getHours()-3 >= now.getHours()+1){
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
    }, err =>{
      console.log("erro", err);
      this.presentErrorAlert();
    })
  }

  checkMeetingNow(array:any){
    console.log("chamou checkMeetingNow");
    let now = new Date();
    array.forEach(element => {
      let dateStartParsed = new Date(element.start.dateTime);
      let dateEndParsed = new Date(element.end.dateTime);
      if(dateStartParsed.getDate() == now.getDate() && dateStartParsed.getMonth() == now.getMonth() && dateStartParsed.getFullYear() == now.getFullYear()){
        if(dateStartParsed.getHours()-3 == now.getHours()+1){
          if(dateStartParsed.getMinutes() <= now.getMinutes()){
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
            return;
          }
        }
      }
    });
    this.currentMeeting = null;
  }
}
