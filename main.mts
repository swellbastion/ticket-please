import express from "express";
import passport from "passport";
import oauth2Strategy from "passport-oauth2";
import { TicketPleaseArguments } from "./TicketPleaseArguments.js";

const app = express();

const ticketPlease = (args: TicketPleaseArguments): Promise<string> => 
    new Promise
    (
        (resolve, reject) => 
        {

            // setup express
            const expressApp = express();
            expressApp.get
            (
                args.localServer.loginUrl, 
                passport.authenticate("oauth2")
            );


            expressApp.get
            (
                "/callback",
                passport.authenticate("oauth2", {session: false}),
                (request, response) => 
                {
                    console.log("redirecting to home");
                    response.redirect("" + "/home");
                }
            );


            expressApp.get
            (
                "/failure",
                (request, response) => 
                {
                    response.status(500).send("Failed to authenticate.");
                    reject("Failed to authenticate.");
                }
            );
            const expressServer = expressApp.listen
            (
                args.localServer.port, 
                () => 
                {
                    if (!args.beQuiet) console.log
                    (
                        "Go to http://localhost:" + 
                        args.localServer.port +
                        args.localServer.loginUrl + 
                        " to authenticate."
                    );
                }
            );

            // setup passport
            passport.use
            (
                new oauth2Strategy
                (
                    {
                        authorizationURL: args.credentials.authorizationUrl,
                        tokenURL: args.credentials.tokenUrl,
                        clientID: args.credentials.clientId,
                        clientSecret: args.credentials.clientSecret,
                        callbackURL: "/callback"
                    },
                    accessToken => 
                    {
                        //resolve(accessToken);
                        expressServer.close
                        (
                            () => 
                            {
                                if (!args.beQuiet) 
                                    console.log("closed local authentication server");
                                resolve(accessToken);
                            }
                        )
                    }
                )
            );

            expressApp.use(passport.initialize());

        }
    );

export default ticketPlease;