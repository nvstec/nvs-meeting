import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomsListPage } from './rooms-list.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsListPageRoutingModule {}
