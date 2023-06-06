import { useEffect, useState } from "react";
import { baseUrl, loginRequest } from "../authConfig";
import { ProfileData } from "./ProfileData";
import { callMsGraph } from "../data/graph";
import { callDataverseWebAPI } from "../data/dataverse";

function ProfileContent ({instance, accounts}) {
    const [graphData, setGraphData] = useState(null);  
    const [dataverseData, setDataverseData] = useState(null);


    useEffect(() => {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
                scopes: [baseUrl+"/.default"]
            })
            .then((response) => {
                callDataverseWebAPI("WhoAmI", response.accessToken).then((response) => setDataverseData(response));
            });
    }, [])

    return (
        <>
            <h5>Welcome {accounts[0].name}</h5>
            {graphData && <ProfileData graphData={graphData} dataverseData={dataverseData} />}
        </>
    );
};


export default ProfileContent