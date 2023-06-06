import { LogLevel } from "@azure/msal-browser";

export const baseUrl = "https://orgf6218f79.api.crm.dynamics.com";
const tenantId = "1b2695b6-7a1e-47e0-a688-2b0da022362b";
const webAPIEndpoint = baseUrl +"/api/data/v9.2"; 

export const msalConfig = {
    auth: {
        clientId: "77856b46-5005-4bcd-bff3-b00106461b37",
        authority: "https://login.microsoftonline.com/"+tenantId,
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};


export const loginRequest = {
    scopes: ["User.Read", baseUrl+"/user_impersonation"]
};


export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};


export const dataverseConfig = {
    dataverseEndpoint: webAPIEndpoint
}