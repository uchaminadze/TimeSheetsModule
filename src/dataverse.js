import { dataverseConfig } from "./authConfig";

/**
 * @param accessToken
 */
export async function callDataverseWebAPI(url, accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Accept", "application/json");
  headers.append("OData-MaxVersion", "4.0");
  headers.append("OData-Version", "4.0");

  const options = {
    method: "GET",
    headers: headers
  };

  return fetch(dataverseConfig.dataverseEndpoint + "/" + url, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
