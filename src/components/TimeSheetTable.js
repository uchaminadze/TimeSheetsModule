import { useEffect, useState } from "react";
import { baseUrl, loginRequest } from "../authConfig";
import { TimeSheetData } from "./TimeSheetData";
import { callMsGraph } from "../api/graph";
import { callDataverseWebAPI } from "../api/dataverse";
import useStore from "../store/useStore";
import WeeksPagination from "./WeeksPagination";
import { DefaultButton, PrimaryButton, Spinner, SpinnerSize, Stack } from "@fluentui/react";
import WeeksDropdown from "./WeeksDropdown";
import AddTimeSheetRow from "./AddTimeSheetRow";
import SubmitTimeSheets from "./SubmitTimeSheets";
import CopyPreviousWeek from "./CopyPreviousWeek";
import SaveTimeSheets from "./SaveTimeSheets";
import { FetchXML } from "../api/fetchXML";

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
    setUniqueId,
    modifiedTimeSheetData,
    setModifiedTimeSheetData,
    setAreTimeSheetsSubmitted
  } = useStore();
  const [projects, setProjects] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [isLoading, setIsLoading] = useState({
    onfirstrender: false,
    afterfirstrender: false,
    savebutton: false,
    submitbutton: false
  });
  // const [areTimeSheetsSubmitted, setAreTimeSheetsSubmitted] = useState(false);

  useEffect(() => {
    if (!apiCalled) {
      graphCall();
      setApiCalled(true);
    }
  }, []);

  useEffect(() => {
    if (weekId) {
      // setIsLoading((prevState) => ({
      //   onfirstrender: true,
      //   afterfirstrender: false,
      //   savebutton: false,
      //   submitbutton: false
      // }));
      getTimeSheets("onfirstrender");
    }
  }, [weekId]);

  function graphCall() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken)
          .then((resp) => {
            const userInfo = {
              firstName: resp.givenName,
              lastName: resp.surname,
              email: resp.userPrincipalName.toLowerCase(),
              phone: resp.mobilePhone,
            };
            const userInfoString = JSON.stringify(userInfo);
            localStorage.setItem("userInfo", userInfoString);
            localStorage.setItem(
              "userEmail",
              resp.userPrincipalName.toLowerCase()
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
        const urlEndpoint = `?$filter=emailaddress1 eq '${localStorage.getItem(
          "userEmail"
        )}'`;
        callDataverseWebAPI("contacts" + urlEndpoint, response.accessToken)
          .then((resp) => {
            localStorage.setItem(
              "modifiedByValue",
              resp.value[0]._modifiedby_value
            );
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("contactid", resp.value[0].contactid);
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

        newWeeks.sort((a, b) => a.date.localeCompare(b.date));

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
        // getTimeSheets("onfirstrender");
      })
      .catch((err) => console.log(err));
  }

  function getTimeSheets(loader) {
    const contactid = localStorage.getItem("contactid");
    const accessToken = localStorage.getItem("accessToken");
    console.log(loader);

    
    
    if(loader === "onfirstrender" && apiCalled){
      setIsLoading((prevState) => ({
        ...prevState,
        onfirstrender: true,
      }));
    }else if(loader === "afterfirstrender"){
      setIsLoading((prevState) => ({
        ...prevState,
        afterfirstrender: true,
      }));
    }else if(loader === "savebutton"){
      setIsLoading((prevState) => ({
        ...prevState,
        savebutton: true,
      }));
    }else if(loader === "submitbutton"){
      setIsLoading((prevState) => ({
        ...prevState, 
        submitbutton: true,
      }));
    }

    const urlEndpoint = `?$filter=_mw_resource_value eq ${contactid} and _cr303_week_value eq ${weekId}`;

    // if(isLoading.onfirstrender || isLoading.button){
      callDataverseWebAPI("cr303_timesheets" + urlEndpoint, accessToken)
        .then((data) => {
          setTimeSheetData(data.value);
          const projectIdArray = data.value.map((c) => {
            return c._cr303_chargecode_value;
          });
          const timestamp = new Date().getTime();
          const id = timestamp.toString();
          setUniqueId(id);
          if(data?.value){
            setIsLoading((prevState) => ({
              onfirstrender: false,
              afterfirstrender: false,
              submitbutton: false,
              savebutton: false
            }));
          }
          
          setProjectId(projectIdArray);
        })
        .catch((err) => console.log(err))
      // }
  }

  function getProjects() {
    const accessToken = localStorage.getItem("accessToken");
    const contactid = localStorage.getItem("contactid");

    FetchXML(contactid, accessToken, "cr303_chargecodes")
      .then((data) => {
        console.log(data);
        const newProjects = data.value.map((project) => ({
          text: project.cr303_name,
          key: project.cr303_chargecodeid,
          description: project.mw_description,
        }));

        setProjects([...projects, ...newProjects]);
      })
      .catch((err) => console.log(err))
  }

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

    getTimeSheets("afterfirstrender")

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

    getTimeSheets("afterfirstrender")

    setWeekStartDate(formattedPreviousWeekStart);

  };

  function submitTimeSheets() {
    const accessToken = localStorage.getItem("accessToken");
    const contactid = localStorage.getItem("contactid");
    modifiedTimeSheetData?.forEach((sheet) => {
      const payload = {
        "cr303_Week@odata.bind": `/cr303_weeks(${weekId})`,
        "cr303_ChargeCode@odata.bind": `/cr303_chargecodes(${sheet.projectId})`,
        "mw_Resource@odata.bind": `/contacts(${contactid})`,
        cr303_timesheetstatus: 824660001,
        cr303_sundayhours: sheet.hours[0],
        cr303_mondayhours: sheet.hours[1],
        cr303_tuesdayhours: sheet.hours[2],
        cr303_wednesdayhours: sheet.hours[3],
        cr303_thursdayhours: sheet.hours[4],
        cr303_fridayhours: sheet.hours[5],
        cr303_saturdayhours: sheet.hours[6],
      };

      if (
        sheet.hasEntries &&
        (sheet.timeSheetStatus === 824660000 || sheet.timeSheetStatus === null)
      ) {
        fetch(
          `https://org2e01c0ca.api.crm.dynamics.com/api/data/v9.2/cr303_timesheets${
            sheet.timeSheetId ? `(${sheet.timeSheetId})` : ""
          }`,
          {
            method: sheet.timeSheetId ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(
              sheet.timeSheetId ? { cr303_timesheetstatus: 824660001 } : payload
            ),
          }
        )
          .then((resp) => {
            if (resp.status === 204) {
              console.log("Submitted successfully");
              getTimeSheets("submitbutton");
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  function saveTimeSheets() {
    const accessToken = localStorage.getItem("accessToken");
    const contactid = localStorage.getItem("contactid");
    modifiedTimeSheetData?.forEach((sheet) => {
      const payload = {
        "cr303_Week@odata.bind": `/cr303_weeks(${weekId})`,
        "cr303_ChargeCode@odata.bind": `/cr303_chargecodes(${sheet.projectId})`,
        "mw_Resource@odata.bind": `/contacts(${contactid})`,
        cr303_sundayhours: sheet.hours[0],
        cr303_mondayhours: sheet.hours[1],
        cr303_tuesdayhours: sheet.hours[2],
        cr303_wednesdayhours: sheet.hours[3],
        cr303_thursdayhours: sheet.hours[4],
        cr303_fridayhours: sheet.hours[5],
        cr303_saturdayhours: sheet.hours[6],
      };
      
      if (
        (sheet.timeSheetStatus === 824660000 ||
          sheet.timeSheetStatus === null) &&
          sheet.isEdited &&
          sheet.hasEntries
          ) {
          fetch(
          `https://org2e01c0ca.api.crm.dynamics.com/api/data/v9.2/cr303_timesheets${
            !sheet.isNewRow ? `(${sheet.timeSheetId})` : ""
          }`,
          {
            method: sheet.isNewRow ? "POST" : "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          }
        )
          .then((resp) => {
            if (resp.status === 204) {
              console.log("Saved successfully");
              // setIsSaved(true);
              getTimeSheets("savebutton")
            }
          })
          .catch((error) => console.log(error))
      }
    });
  }

  function copyPreviousWeek(prevWeekDate) {
    const accessToken = localStorage.getItem("accessToken");
    console.log(modifiedTimeSheetData);
    // if(weekId !== "4798a277-e6c1-ed11-83fe-000d3a381764" && modifiedTimeSheetData?.length === 1){
    //   setIsLoading((prevState) => ({
    //     ...prevState,
    //     onfirstrender: true,
    //   }));
    // }

    setAreTimeSheetsSubmitted(false)
    callDataverseWebAPI(
      `cr303_weeks?$filter=cr303_startdate eq ${prevWeekDate}`,
      accessToken
    )
      .then((data) => {
        if(data?.value){
          copyTimeSheetsFromPreviousWeek(data.value[0].cr303_weekid);
          // setIsLoading((prevState) => ({
          //   ...prevState,
          //   onfirstrender: false,
          // }));
          getTimeSheets("afterfirstrender")
        }
      })
      .catch((err) => console.log(err));
  }

  function copyTimeSheetsFromPreviousWeek(prevWeekId) {
    const contactid = localStorage.getItem("contactid");
    const accessToken = localStorage.getItem("accessToken");
    const urlEndpoint = `?$filter=_mw_resource_value eq ${contactid} and _cr303_week_value eq ${prevWeekId}`;
    callDataverseWebAPI("cr303_timesheets" + urlEndpoint, accessToken)
    .then((data) => {
        if (data.value.length > 0 && timeSheetData.length === 0) {
          const copiedTimeSheetData = [];
          const copiedTimeSheetprojectId = [];
          let copiedTimeSheet = {};
          data?.value.forEach((sheet, index) => {
            const projectName = projects.find((el) => el.key === sheet._cr303_chargecode_value)?.text || '';
            modifiedTimeSheetData.forEach((p) => {
              copiedTimeSheet = {
                weekDayDates: [
                  p.weekDayDates[0],
                  p.weekDayDates[1],
                  p.weekDayDates[2],
                  p.weekDayDates[3],
                  p.weekDayDates[4],
                  p.weekDayDates[5],
                  p.weekDayDates[6],
                ],
                hours: [
                  sheet.cr303_sundayhours,
                  sheet.cr303_mondayhours,
                  sheet.cr303_tuesdayhours,
                  sheet.cr303_wednesdayhours,
                  sheet.cr303_thursdayhours,
                  sheet.cr303_fridayhours,
                  sheet.cr303_saturdayhours,
                ],
                comments: [
                  sheet.cr303_sundaycomment,
                  sheet.cr303_mondaycomment,
                  sheet.cr303_tuesdaycomment,
                  sheet.cr303_wednesdaycomment,
                  sheet.cr303_thursdaycomment,
                  sheet.cr303_fridaycomment,
                  sheet.cr303_saturdaycomment,
                ],
                timeSheetStatus: null,
                projectName: projectName,
                projectId: sheet._cr303_chargecode_value,
                // timeSheetId: sheet.cr303_timesheetid,
                totalHours: sheet.mw_totalhours,
                hasEntries: true,
                isEdited: true,
                isNewRow: true,
              };
            })
            copiedTimeSheetData.push(copiedTimeSheet);
            copiedTimeSheetprojectId.push(sheet._cr303_chargecode_value);
          });
          
          setProjectId(copiedTimeSheet !== null && [...copiedTimeSheetprojectId]);
          setModifiedTimeSheetData([
            // ...modifiedTimeSheetData,
            ...copiedTimeSheetData,
          ]);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
  {isLoading.onfirstrender ? (
    <Spinner
      size={SpinnerSize.large}
      styles={{
        root: {
          height: "82vh",
        },
      }}
    />
  ) : (
    <>
      {isLoading.afterfirstrender && (
        <Spinner
          size={SpinnerSize.large}
          styles={{
            root: {
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,0.2)",
              zIndex: 1,
            },
          }}
        />
      )}
      <div className="main-content">
        {timeSheetData && (
          <>
            <Stack
              horizontal
              styles={{
                root: {
                  borderBottom: "1px solid #D0D6DA",
                  borderTop: "1px solid #D0D6DA",
                  padding: "16px 0",
                },
              }}
            >
              <WeeksPagination
                getExactWeek={getExactWeek}
                getPreviousWeek={getPreviousWeek}
                getNextWeek={getNextWeek}
                currentYear={currentYear}
                weekStart={weekStart}
                weekEnd={weekEnd}
              />
              <WeeksDropdown weeks={weeks} getTimeSheets={getTimeSheets}/>
            </Stack>
            <br />
            <br />
            <TimeSheetData
              projects={projects}
              weekStart={weekStart}
              weekEnd={weekEnd}
            />
            <br />
            <br />
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack.Item>
                <AddTimeSheetRow />
                <CopyPreviousWeek copyPreviousWeek={copyPreviousWeek} />
              </Stack.Item>
              <Stack.Item>
                <SaveTimeSheets saveTimeSheets={saveTimeSheets} isLoading={isLoading} />
                <SubmitTimeSheets submitTimeSheets={submitTimeSheets} isLoading={isLoading} modifiedTimeSheetData={modifiedTimeSheetData}/>
              </Stack.Item>
            </Stack>
          </>
        )}
      </div>
    </>
  )}
</>

  );
}

export default TimeSheetTable;
