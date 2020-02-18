import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomEventsModalPageRoutingModule } from './room-events-modal-routing.module';

import { RoomEventsModalPage } from './room-events-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomEventsModalPageRoutingModule
  ],
  declarations: [RoomEventsModalPage],
})
export class RoomEventsModalPageModule {}
