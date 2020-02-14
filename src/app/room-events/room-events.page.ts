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
        console.log("obj",this.obj);
      }
    });
  }

  ngOnInit() {
  }

}
