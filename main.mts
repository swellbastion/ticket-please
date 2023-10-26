import express from "express";
import passport from "passport";
import oauth2Strategy from "passport-oauth2";
import { TicketPleaseArguments } from "./TicketPleaseArguments.js";

const app = express();

const ticketPlease = (args: TicketPleaseArguments): Promise<string> => new Promise
(
    (resolve, reject) => 
    {

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
                (accessToken, refreshToken, profile, cb) => 
                {
                    return cb(null, {accessToken});
                }
            )
        );

        passport.serializeUser(function(user, done) {
            done(null, user);
          });
          passport.deserializeUser(function(user, done) {
            done(null, user);
          });

        // setup express
        const expressApp = express();
        expressApp.use(passport.initialize());
        expressApp.get
        (
            args.localServer.loginUrl, 
            passport.authenticate("oauth2")
        );


        expressApp.get
        (
            "/callback",
            passport.authenticate
            (
                "oauth2", 
                {failureRedirect: "/failure", session: false},
            ),
            (request, response) => 
            {
                console.log("oh hi");
                response.redirect("/success");
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
        expressApp.get
        (
            "/success",
            (request, response) => 
            {
                response.status(200).send("Successfully authenticated.");
                resolve("thing goes here");
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

    }
);

export default ticketPlease;