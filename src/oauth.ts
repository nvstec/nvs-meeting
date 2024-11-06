import * as dotenv from 'dotenv';
dotenv.config();

export const OAuthSettings = {
    appId: process.env.APP_ID,
    scopes: [
        "user.read",
        "calendars.read"
    ]
};