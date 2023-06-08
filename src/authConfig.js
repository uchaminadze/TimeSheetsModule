import { LogLevel } from "@azure/msal-browser";

export const baseUrl = "https://org2e01c0ca.api.crm.dynamics.com";
const tenantId = "1b2695b6-7a1e-47e0-a688-2b0da022362b";
const webAPIEndpoint = baseUrl + "/api/data/v9.2";

export const msalConfig = {
  auth: {
    clientId: "77856b46-5005-4bcd-bff3-b00106461b37",
    authority: "https://login.microsoftonline.com/" + tenantId,
    identityProviders: {
      customOpenIdConnectProviders: {
        aadb2c: {
          registration: {
            clientIdSettingName: "254cf206-a2a8-463b-b5bf-3cd61fe25c7b",
            clientCredential: {
              clientSecretSettingName:
                "KXz8Q~v2M4il03qxo33pXLIAEtl~4c1DdvgWiaRl",
            },
            openIdConnectConfiguration: {
              wellKnownOpenIdConfiguration:
                "https://doesesspdemo.b2clogin.com/doesesspdemo.onmicrosoft.com/B2X_1_A/v2.0/.well-known/openid-configuration",
            },
          },
          login: {
            nameClaimType:
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
            scopes: [],
            loginParameterNames: [],
          },
        },
      },
    },
    redirectUri: window.location.origin,
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
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

export const dataverseConfig = {
  dataverseEndpoint: webAPIEndpoint,
};
