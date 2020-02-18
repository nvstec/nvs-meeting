import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-room-events-modal',
  templateUrl: './room-events-modal.page.html',
  styleUrls: ['./room-events-modal.page.scss'],
})
export class RoomEventsModalPage implements OnInit {

  @Input() token:any;
  @Input() roomName:any;
  @Input() roomEmail:any;

  eventName: any;
  eventDuration: any;

  isBookBtnDisabled: boolean = true;

  constructor(
    public modalCtrl: ModalController
    ) {

    }

  ngOnInit() {
    console.log("token: ", this.token);
    console.log("roomName: ", this.roomName);
    console.log("roomEmail: ", this.roomEmail);
  }

  checkBtnEnabled(value){
    if(this.eventName && this.eventDuration){
      this.isBookBtnDisabled = false;
    }
  }

  bookClicked(){
    let now = new Date();
    let nowFormatted = moment(now).add( 1,'h').format();
    console.log("chamar a api aqui");
    console.log("name: ",this.eventName);
    console.log("duration: ",this.eventDuration);
    console.log("nowFormatted: ",nowFormatted);
    this.modalCtrl.dismiss();
  }
}
