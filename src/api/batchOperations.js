    import { dataverseConfig } from "../authConfig";

    export function BatchPostAccounts() {
        this.apiUrl = dataverseConfig.dataverseEndpoint;
        this.uniqueId = "batch_" + (new Date().getTime());
        this.batchItemHeader = "--" +
            this.uniqueId + 
            "\nContent-Type: application/http\nContent-Transfer-Encoding:binary";
        this.content = [];
    }
        

    BatchPostAccounts.prototype.addRequestItem = function(entity) {
        this.content.push(this.batchItemHeader);
        this.content.push("");
        this.content.push("POST " + this.apiUrl + "/cr303_timesheets" + " HTTP/1.1");
        this.content.push("Content-Type: application/json;type=entry");
        this.content.push("");
        this.content.push(JSON.stringify(entity));
    }
        

    BatchPostAccounts.prototype.sendRequest = function(token) {
        return new Promise((resolve, reject) => {
            this.content.push("");
            this.content.push("--" + this.uniqueId + "--");
            this.content.push(" ");
    
            const xhr = new XMLHttpRequest();
            xhr.open("POST", encodeURI(this.apiUrl + "/$batch"));
            xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=" + 
                this.uniqueId);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("OData-MaxVersion", "4.0");
            xhr.setRequestHeader("OData-Version", "4.0");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    xhr.onreadystatechange = null;
                    if (this.status === 200) {
                        resolve(this.status);
                    } else {
                        reject(new Error(`Request failed with status ${this.status}`));
                    }
                }
            };
            
            xhr.send(this.content.join("\n"));
        })
    }