import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomExtendModalPage } from './room-extend-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RoomExtendModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomExtendModalPageRoutingModule {}
