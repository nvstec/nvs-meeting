import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-room-extend-modal',
  templateUrl: './room-extend-modal.page.html',
  styleUrls: ['./room-extend-modal.page.scss'],
})
export class RoomExtendModalPage implements OnInit {

  @Input() token:any;
  @Input() roomName:any;
  @Input() roomEmail:any;

  extendDuration: any;
  isExtendBtnDisabled: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  checkBtnEnabled(value){
    if(this.extendDuration){
      this.isExtendBtnDisabled = false;
    }
  }
}
