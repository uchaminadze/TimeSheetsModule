import { dataverseConfig } from "../authConfig";


export async function FetchXML(contactid, accessToken, endpoint) {
    return new Promise((resolve, reject) => {
      const fetchXML = `
        <fetch version="1.0" mapping="logical" distinct="true">
            <entity name="cr303_chargecode">
                <attribute name="cr303_chargecodeid"/>
                <attribute name="cr303_name"/>
                <order attribute="cr303_name" descending="false"/>
                <attribute name="mw_description"/>
                <link-entity name="mw_cr303_chargecode_contact" intersect="true" visible="false" from="cr303_chargecodeid" to="cr303_chargecodeid">
                    <link-entity name="contact" alias="ab" from="contactid" to="contactid">
                        <filter type="and">
                            <condition attribute="contactid" operator="eq" value="${contactid}" uitype="contact"/>
                        </filter>
                    </link-entity>
                </link-entity>
            </entity>
        </fetch>
      `;
      const encodedFetchXML = encodeURIComponent(fetchXML);
  
      const req = new XMLHttpRequest();
  
      req.open(
        "GET",
        `${dataverseConfig.dataverseEndpoint}/${endpoint}?fetchXml=` +
          encodedFetchXML,
        true
      );
      req.setRequestHeader("OData-MaxVersion", "4.0");
      req.setRequestHeader("OData-Version", "4.0");
      req.setRequestHeader("Accept", "application/json");
      req.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
  
      req.onreadystatechange = function () {
        if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 200) {
            resolve(JSON.parse(this.response));
          } else {
            reject(new Error(`Request failed with status ${this.status}`));
          }
        }
      };
  
      req.send();
    });
  }
  