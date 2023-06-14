import { useEffect, useState } from "react";
import { baseUrl, loginRequest } from "../authConfig";
import { TimeSheetData } from "./TimeSheetData";
import { callMsGraph } from "../api/graph";
import { callDataverseWebAPI } from "../api/dataverse";
import useStore from "../store/useStore";
import WeeksPagination from "./WeeksPagination";

function TimeSheetTable({ instance, accounts }) {
  const { timeSheetData, setTimeSheetData, weekStartDate } = useStore();
  const [projects, setProjects] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState("2023-01-08T05:00:00Z");

  useEffect(() => {
    graphCall();
    console.log(currentWeekStartDate);
  }, []);




  function graphCall() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken)
          .then((response) => {
            localStorage.setItem(
              "userEmail",
              response.userPrincipalName.toLowerCase()
            );
            
            dataverseCall();
          })
          .catch((err) => console.log(err));
      });
  }

  function dataverseCall() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
        scopes: [baseUrl + "/user_impersonation"],
        // scopes: [baseUrl+"/.default"]
      })
      .then((response) => {
        const urlEndpoint = `?$filter=mw_email eq '${localStorage.getItem(
          "userEmail"
        )}'`;
        callDataverseWebAPI("mw_employees" + urlEndpoint, response.accessToken)
          .then((resp) => {
            localStorage.setItem(
              "modifiedByValue",
              resp.value[0]._modifiedby_value
            );
            
            localStorage.setItem("accessToken", response.accessToken);
            getExactWeek();
            getWeeks();
            getProjects();
          })
          .catch((err) => console.log(err));
      });
  }


// =========== Get Previous Weeks =================

  // const currentDate = new Date();

  // // Set the time to 05:00:00 in UTC
  // currentDate.setUTCHours(5, 0, 0, 0);
  
  // // Calculate the start of the current week
  // const startOfWeek = new Date(currentDate);
  // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
  
  // // Calculate the start of the previous week
  // const previousWeekStart = new Date(startOfWeek);
  // previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 14);
  
  // // Format the start of the previous week string
  // const formattedPreviousWeekStart = previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";


// =========== Get Previous Weeks =================



function getWeeks() {
  const accessToken = localStorage.getItem("accessToken");
  callDataverseWebAPI("cr303_weeks", accessToken)
    .then((data) => {
      setWeeks(data.value)
    })
    .catch((err) => console.log(err));
}





function getExactWeek() {
  // const currentDate = new Date();

  // Set the time to 05:00:00 in UTC
  // currentDate.setUTCHours(5, 0, 0, 0);
  
  // Calculate the start of the week
  // const startOfWeek = new Date(currentDate);
  // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
  
  // Format the start of the week string
  // const formattedStartOfWeek = startOfWeek.toISOString().split("T")[0] + "T05:00:00Z";
  
  
  const accessToken = localStorage.getItem("accessToken");
  callDataverseWebAPI(`cr303_weeks?$filter=cr303_startdate eq ${weekStartDate}`, accessToken)
    .then((data) => {
      localStorage.setItem(
        "weekid",
        data.value[0].cr303_weekid
      );

      setWeekStart(data.value[0].cr303_startdate);
      setWeekEnd(data.value[0].cr303_enddate);
      setCurrentYear(data.value[0].cr303_year);
      getExactTimeSheet();
    })
    .catch((err) => console.log(err));
}





  function getExactTimeSheet() {
    // and _cr303_week_value eq ${weekid}
    const weekid = localStorage.getItem("weekid");
    const modifiedByValue = localStorage.getItem("modifiedByValue");
    const accessToken = localStorage.getItem("accessToken");
    const urlEndpoint = `?$filter=_ownerid_value eq ${modifiedByValue} and _cr303_week_value eq ${weekid}`;
    callDataverseWebAPI("cr303_timesheets" + urlEndpoint, accessToken)
      .then((data) => setTimeSheetData(data.value))
      .catch((err) => console.log(err));
  }



  function getProjects() {
    const accessToken = localStorage.getItem("accessToken");
    callDataverseWebAPI("cr303_chargecodes", accessToken)
      .then((data) => {
        const newProjects = data.value.map((project) => ({
          text: project.cr303_name,
          key: project.cr303_chargecodeid,
        }));

        setProjects([...projects, ...newProjects]);
      })
      .catch((err) => console.log(err));
  }




  // const getPreviousWeek = () => {
  // const currentDate = new Date(currentWeekStartDate);

  // // Set the time to 05:00:00 in UTC
  // currentDate.setUTCHours(5, 0, 0, 0);
  
  // // Calculate the start of the current week
  // const startOfWeek = new Date(currentDate);
  // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
  
  // // Calculate the start of the previous week
  // const previousWeekStart = new Date(startOfWeek);
  // previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 14);
  
  // // Format the start of the previous week string
  // const formattedPreviousWeekStart = previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";

  // setCurrentWeekStartDate(formattedPreviousWeekStart)

  // console.log(currentWeekStartDate);
  // }





  const start = new Date(weekStart);
  const weekStartMonth = start.toLocaleString("default", {
    month: "short",
  });
  const weekStartDay = start.getUTCDate();

  const end = new Date(weekEnd);
  
  const weekEndMonth = end.toLocaleString("default", { month: "short" });
  const weekEndDay = end.getUTCDate();

  const formattedDate = `${weekStartMonth} ${weekStartDay} - ${weekEndMonth} ${weekEndDay}`;

  // console.log("timeSheetData >>>>>>>>>>>>>>>>", timeSheetData)

  return (
    <>
      <h4>Welcome {accounts[0].name}</h4>
      <br/>
      <br/>
      <p>These are static dates for testing</p>
      <br/>
      <br/>
      {timeSheetData && <WeeksPagination getExactWeek={getExactWeek} />}
      <h5>{timeSheetData && `${formattedDate}, ${currentYear}`}</h5>
      <br/>
      <br/>
      {timeSheetData && <TimeSheetData projects={projects}/>}
    </>
  );
}

export default TimeSheetTable;
