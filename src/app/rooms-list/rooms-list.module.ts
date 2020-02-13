import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsListPageRoutingModule } from './rooms-list-routing.module';

import { RoomsListPage } from './rooms-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomsListPageRoutingModule
  ],
  declarations: [RoomsListPage]
})
export class RoomsListPageModule {}
