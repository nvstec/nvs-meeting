import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},  {
    path: 'rooms-list',
    loadChildren: () => import('./rooms-list/rooms-list.module').then( m => m.RoomsListPageModule)
  },
  {
    path: 'room-events',
    loadChildren: () => import('./room-events/room-events.module').then( m => m.RoomEventsPageModule)
  },
  {
    path: 'room-events-modal',
    loadChildren: () => import('./room-events-modal/room-events-modal.module').then( m => m.RoomEventsModalPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
