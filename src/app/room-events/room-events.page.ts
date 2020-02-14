import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-room-events',
  templateUrl: './room-events.page.html',
  styleUrls: ['./room-events.page.scss'],
})
export class RoomEventsPage implements OnInit {

  obj: any;
  token: any;
  roomName: any;
  clock: any = new Date();
  timer: any;
  todayEventsArray = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.obj = this.router.getCurrentNavigation().extras.state.roomEvents;
        this.token = this.router.getCurrentNavigation().extras.state.token;
        this.roomName = this.router.getCurrentNavigation().extras.state.roomName;
        console.log("obj",this.obj);
        this.createTodayEventsArray(this.obj);
      }
    });
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.clock = new Date();
    }, 60000);


  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

  createTodayEventsArray(array:any){
    let now = new Date();
    console.log("now",now);
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
  }
}
