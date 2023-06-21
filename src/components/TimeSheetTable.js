import { useEffect, useState } from "react";
import { baseUrl, loginRequest } from "../authConfig";
import { TimeSheetData } from "./TimeSheetData";
import { callMsGraph } from "../api/graph";
import { callDataverseWebAPI } from "../api/dataverse";
import useStore from "../store/useStore";
import WeeksPagination from "./WeeksPagination";
import { DefaultButton, PrimaryButton, Stack } from "@fluentui/react";
import WeeksDropdown from "./WeeksDropdown";
import AddTimeSheetRow from "./AddTimeSheetRow";
import SubmitTimeSheet from "./SubmitTimeSheet";

function TimeSheetTable({ instance, accounts }) {
  const {
    timeSheetData,
    setTimeSheetData,
    weekStartDate,
    setWeekStartDate,
    weekId,
    setWeekId,
    apiCalled,
    setApiCalled,
    projectId,
    setProjectId,
    projectDescription,
    setProjectDescription,
    setUniqueId
  } = useStore();
  const [projects, setProjects] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [timeSheetIds, setTimeSheetIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!apiCalled) {
      console.log(apiCalled);
      graphCall();
      setApiCalled(true);
    }
    
  }, []);
  
  useEffect(() => {
    if (weekId) {
      getTimeSheets();
    }
  }, [weekId, isSubmitted]);
  
  // useEffect(() => {
    //   if (projectId) {
      //     getExactProject();
      //   }
      // }, [projectId]);
      
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

  function getWeeks() {
    const accessToken = localStorage.getItem("accessToken");
    callDataverseWebAPI("cr303_weeks", accessToken)
      .then((data) => {
        const newWeeks = data.value.map((week) => ({
          text: week.cr303_name,
          date: week.cr303_startdate,
          key: week.cr303_weekid,
        }));

        setWeeks([...weeks, ...newWeeks]);
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
    callDataverseWebAPI(
      `cr303_weeks?$filter=cr303_startdate eq ${weekStartDate}`,
      accessToken
    )
      .then((data) => {
        setWeekId(data.value[0].cr303_weekid);
        setWeekStart(data.value[0].cr303_startdate);
        setWeekEnd(data.value[0].cr303_enddate);
        setCurrentYear(data.value[0].cr303_year);
      })
      .catch((err) => console.log(err));
  }

  function getTimeSheets() {
    const modifiedByValue = localStorage.getItem("modifiedByValue");
    const accessToken = localStorage.getItem("accessToken");
    console.log(weekId);

    const urlEndpoint = `?$filter=_ownerid_value eq ${modifiedByValue} and _cr303_week_value eq ${weekId}`;
    callDataverseWebAPI("cr303_timesheets" + urlEndpoint, accessToken)
      .then((data) => {
        setTimeSheetData(data.value);
        console.log(timeSheetData);

        const timesheetIDs = [];

        data.value.forEach((sheet) => {
          if(sheet.cr303_timesheetstatus === 824660000) {
            timesheetIDs.push(sheet.cr303_timesheetid)
          }
        })


        setTimeSheetIds(timesheetIDs)

        const projectIdArray = data.value.map((c) => {
          return c._cr303_chargecode_value
        })
        
        const timestamp = new Date().getTime(); // Get current timestamp
        const id = timestamp.toString();
        setUniqueId(id)

        // setProjectId(data.value[0]._cr303_chargecode_value);
        setProjectId(projectIdArray);
      })
      .catch((err) => console.log(err));
  }

  function getProjects() {
    const accessToken = localStorage.getItem("accessToken");
    callDataverseWebAPI("cr303_chargecodes", accessToken)
      .then((data) => {
        const newProjects = data.value.map((project) => ({
          text: project.cr303_name,
          key: project.cr303_chargecodeid,
          description: project.mw_description
        }));

        setProjects([...projects, ...newProjects]);
      })
      .catch((err) => console.log(err));
  }

  // const getExactProject = () => {
  //   const accessToken = localStorage.getItem("accessToken");

  //     projectId.map((p) => (
  //       callDataverseWebAPI(`cr303_chargecodes${p !== null ? `(${p})` : ""}`, accessToken)
  //       .then((data) => {
  //         const singleProject = {
  //           text: data.cr303_name,
  //           key: data.cr303_chargecodeid,
  //           description: data.mw_description
  //         }

  //         console.log("week id >>>>>>>>>>>>>>>>>>>>>>>", weekId);

  //         setSingleProjects([...singleProjects, singleProject])
          
  //         setProjectDescription(data.mw_description);
  //       })
  //       .catch((err) => console.log(err))
  //     ))
  // };

  const getPreviousWeek = () => {
    setApiCalled(false);
    const currentDate = new Date(weekStartDate);

    currentDate.setUTCHours(5, 0, 0, 0);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 7);

    const formattedPreviousWeekStart =
      previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";

    setWeekStartDate(formattedPreviousWeekStart);
  };

  const getNextWeek = () => {
    setApiCalled(false);

    const currentDate = new Date(weekStartDate);

    currentDate.setUTCHours(5, 0, 0, 0);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setUTCDate(startOfWeek.getUTCDate() + 7);

    const formattedPreviousWeekStart =
      previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";

    setWeekStartDate(formattedPreviousWeekStart);
  };



  function submitTimeSheet() {
    const accessToken = localStorage.getItem("accessToken");
    timeSheetIds.forEach((id) => {
      fetch(`https://org2e01c0ca.api.crm.dynamics.com/api/data/v9.2/cr303_timesheets(${id})`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          cr303_timesheetstatus: 824660001
        })
      })
        .then((resp) => {
          if(resp.status === 204){
            console.log("Submitted successfully");
            setIsSubmitted(true)
          }
        })
        .catch((error) => console.log(error))
    })
  }


  function saveTimeSheets(){
    const accessToken = localStorage.getItem("accessToken");
    fetch(`https://org2e01c0ca.api.crm.dynamics.com/api/data/v9.2/cr303_timesheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          cr303_tuesdayhours: 8.0000000000
        })
      })
        .then((resp) => {
          if(resp.status === 201){
            console.log("Submitted successfully");
          }
        })
        .catch((error) => console.log(error))
  }

  return (
    <>
      <h4>Welcome {accounts[0].name}</h4>
      <br />
      <br />
      <Stack horizontal>
        {timeSheetData && (
          <WeeksPagination
            getExactWeek={getExactWeek}
            getPreviousWeek={getPreviousWeek}
            getNextWeek={getNextWeek}
            currentYear={currentYear}
            weekStart={weekStart}
            weekEnd={weekEnd}
          />
        )}

        {timeSheetData && <WeeksDropdown weeks={weeks} />}
      </Stack>
      <br />
      <br />
      {timeSheetData && <TimeSheetData projects={projects} />}
      <br />
      <br />
      <Stack horizontal horizontalAlign="space-between">
        <Stack.Item>
          <AddTimeSheetRow/>
        </Stack.Item>
        <Stack.Item>
          <DefaultButton styles={{root: {marginRight: 10}}} onClick={saveTimeSheets}>Save</DefaultButton>
          <SubmitTimeSheet submitTimeSheet={submitTimeSheet}/>
        </Stack.Item>
      </Stack>
    </>
  );
}

export default TimeSheetTable;
