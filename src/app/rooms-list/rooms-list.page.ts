import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.page.html',
  styleUrls: ['./rooms-list.page.scss'],
})
export class RoomsListPage implements OnInit {

  obj: any;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.obj = this.router.getCurrentNavigation().extras.state.rooms;
        this.token = this.router.getCurrentNavigation().extras.state.token;
      }
    });
  }

  ngOnInit() {
  }

  async onSelectRoom(room){
    const loading = await this.loadingCtrl.create({
      message: 'Carregando eventos'
    });

    await loading.present();

    let urlCalendar = "https://graph.microsoft.com/v1.0/users/"+room.address+"/calendar";

    this.http.get(urlCalendar,{
      headers: new HttpHeaders({"Authorization": "Bearer "+ this.token})
    }).subscribe(resCalendar => {
      console.log("resCalendar",resCalendar);
      let url = "https://graph.microsoft.com/v1.0/users/"+room.address+"/events";

      this.http.get(url,{
        headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
      }).subscribe(res => {
        console.log("resEvents",res);
        loading.dismiss();
        let navigationExtras: NavigationExtras = {
          state: {
            roomName: room.name,
            roomEmail: room.address,
            roomEvents: res["value"],
            idCalendar: resCalendar["id"],
            token: this.token
          }
        }
        this.router.navigate(['/room-events'],navigationExtras);
      }, err =>{
        console.log("erro", err);
        loading.dismiss();
      })
    }, err =>{
      console.log("erro", err);
      loading.dismiss();
    })
  }
}
