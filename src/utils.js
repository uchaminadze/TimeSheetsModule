import { baseUrl, loginRequest } from "./authConfig";

export function acquireTokenCall(instance, accounts) {
    return new Promise((resolve, reject) => {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
          scopes: [baseUrl + "/user_impersonation"],
        //   forceRefresh: true
        })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });
  }
  