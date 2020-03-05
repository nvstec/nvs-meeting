import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomEventsPage } from './room-events.page';

const routes: Routes = [
  {
    path: '',
    component: RoomEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomEventsPageRoutingModule {}
