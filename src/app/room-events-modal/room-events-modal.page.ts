import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-events-modal',
  templateUrl: './room-events-modal.page.html',
  styleUrls: ['./room-events-modal.page.scss'],
})
export class RoomEventsModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  bookClicked(){
    console.log("chamar a api aqui");
  }
}
