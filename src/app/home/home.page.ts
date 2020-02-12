import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user: any;
  events: any;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.user;
    this.events = this.authService.events;
    console.log("wololo",this.events);
  }

  async signIn(): Promise<void>{
    await this.authService.signIn();
  }
}
