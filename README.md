This library is in alpha and is currently only for the adventurous.

The goal of this library is to abstract away, to an unusual degree, the annoyances of intereacting with OAuth2 APIs. It should reduce how much work a developer has to do to the absolute minimum. It will probably be less configurable then other tools in an effort to reduce the number of choices a developer has to make.

It is a wrapper around the excellent [passport](https://www.npmjs.com/package/passport) library.

Usage example:

```javascript
import {ticketPlease} from "ticket-please";

const accessToken = await ticketPlease({
    localServer: {
        loginUrl: "/authenticate",
        port: 8000,
    },
    credentials: {
        authorizationUrl: "https://example.com/authorization",
        tokenUrl: "https://example.com/token",
        clientId: "**************************",
        clientSecret: "**************************"
    }
});
console.log(`got an access token: ${accessToken}`);
```