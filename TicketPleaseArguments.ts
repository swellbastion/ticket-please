export interface TicketPleaseArguments
{
    beQuiet?: boolean;
    localServer: 
    {
        loginUrl: string; 
        port: number;
    };
    credentials:
    {
        authorizationUrl: string;
        tokenUrl: string;
        clientId: string;
        clientSecret: string;
    };
}