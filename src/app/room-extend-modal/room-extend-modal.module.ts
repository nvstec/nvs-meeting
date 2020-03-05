import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomExtendModalPageRoutingModule } from './room-extend-modal-routing.module';

import { RoomExtendModalPage } from './room-extend-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomExtendModalPageRoutingModule
  ],
  declarations: [RoomExtendModalPage]
})
export class RoomExtendModalPageModule {}
