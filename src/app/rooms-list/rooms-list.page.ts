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

    let url = "https://graph.microsoft.com/v1.0/users/"+room.address+"/events";

    this.http.get(url,{
      headers: new HttpHeaders({"Authorization": "Bearer "+ this.token,"Content-Type":"application/json"})
    }).subscribe(res => {
      console.log("res",res);
      loading.dismiss();
      // let navigationExtras: NavigationExtras = {
      //   state: {
      //     selectedRoom: room
      //   }
      // }
      // this.router.navigate(['/rooms-list'],navigationExtras);
    }, err =>{
      console.log("erro", err);
      loading.dismiss();
    })
  }
}
