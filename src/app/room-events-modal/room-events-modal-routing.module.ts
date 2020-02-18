import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomEventsModalPage } from './room-events-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RoomEventsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomEventsModalPageRoutingModule {}
