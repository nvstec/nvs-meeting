import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Client } from '@microsoft/microsoft-graph-client';

import { OAuthSettings } from '../oauth';
import { async } from '@angular/core/testing';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    public authenticated: boolean;
    public user: any;
    public events: any;

    constructor(
        private msalService: MsalService
    ){
        this.authenticated = this.msalService.getUser() != null;
        this.getUser().then((user) => {this.user = user});
        this.getEvents().then((events) => {this.events = events});
    }

    async signIn(): Promise<void>{
        let result = await this.msalService.loginPopup(OAuthSettings.scopes).catch((reason) => {
            console.log("erro",reason);
        });

        if(result){
            this.authenticated = true;
            this.user = await this.getUser();
        }
    }

    signOut(): void{
        this.msalService.logout();
        this.user = null;
        this.authenticated = false;
    }

    async getAccessToken(): Promise<string>{
        let result = await this.msalService.acquireTokenSilent(OAuthSettings.scopes).catch((reason) => {
            console.log("erro token", reason);
        })
        return result;
    }

    private async getUser(): Promise<any>{
        if (!this.authenticated) return null;

        let graphClient = Client.init({
            authProvider: async(done) =>{
                let token = await this.getAccessToken().catch((reason) => {
                    done(reason,null);
                });

                if(token){
                    done(null, token);
                }
                else{
                    done("error token",null);
                }
            }
        });

        let graphUser = await graphClient.api('/me').get();
        this.user = graphUser;
        return this.user;
    }

    private async getEvents(): Promise<any>{
        if (!this.authenticated) return null;

        let graphClient = Client.init({
            authProvider: async(done) =>{
                let token = await this.getAccessToken().catch((reason) => {
                    done(reason,null);
                });

                if(token){
                    done(null, token);
                }
                else{
                    done("error token",null);
                }
            }
        });

        let graphEvents = await graphClient.api('/me/events').get();
        console.log("aeho2",graphEvents);
        this.events = graphEvents;
        return this.events;
    }
}
