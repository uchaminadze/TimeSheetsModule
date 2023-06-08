import { useEffect, useState } from "react";
import { baseUrl, loginRequest } from "../authConfig";
import { AccountData } from "./TimeSheetData";
import { callMsGraph } from "../data/graph";
import { callDataverseWebAPI } from "../data/dataverse";

function TimeSheetTable ({instance, accounts}) {
    const [timeSheetData, setTimeSheetData] = useState(null);

    useEffect(() => {
        graphCall();
    }, []);




    function graphCall(){
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => {
                    localStorage.setItem('userEmail', response.userPrincipalName.toLowerCase())
                    dataverseCall();
                })
                .catch((err) => console.log(err))
            });
    };




    function dataverseCall(){
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
                scopes: [baseUrl+"/user_impersonation"]
                // scopes: [baseUrl+"/.default"]
            })
            .then((response) => {
                const urlEndpoint = `?$filter=mw_email eq '${localStorage.getItem('userEmail')}'`;
                callDataverseWebAPI("mw_employees"+urlEndpoint, response.accessToken).then((resp) => {
                    localStorage.setItem('modifiedByValue', resp.value[0]._modifiedby_value)
                    localStorage.setItem('accessToken', response.accessToken)
                    getExactTimeSheet();
                })
                .catch((err) => console.log(err))
            });
    };




    function getExactTimeSheet() {
        const modifiedByValue = localStorage.getItem('modifiedByValue');
        const accessToken = localStorage.getItem('accessToken');
        const urlEndpoint = `?$filter=_ownerid_value eq ${modifiedByValue}`;
        callDataverseWebAPI("cr303_timesheets"+urlEndpoint, accessToken)
            .then((data) => setTimeSheetData(data.value[0]))
            .catch((err)=> console.log(err))
    }


    return (
        <>
            <h5>Welcome {accounts[0].name}</h5>
            {timeSheetData && <AccountData timeSheetData={timeSheetData} />}
        </>
    );
};


export default TimeSheetTable;