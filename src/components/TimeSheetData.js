import React, { useEffect, useRef, useState } from "react";
import useStore from "../store/useStore";
import {
  getTimeSheetStatus,
  getWeekDayComments,
  getWeekDayDates,
  getWeekDayHours,
  statusLabels,
  weekDayNames,
} from "../data/timeSheetData";
import Project from "./Project";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack, TableFooter, TextField, Typography } from "@mui/material";
import { DefaultButton } from "@fluentui/react";
import _ from 'lodash';
import ProjectChart from "./ProjectChart";

export const TimeSheetData = ({ projects, weekStart, weekEnd }) => {
  const {
    projectId,
    setProjectId,
    timeSheetData,
    uniqueId,
    modifiedTimeSheetData,
    setModifiedTimeSheetData,
    staticTimeSheetData,
    setStaticTimeSheetData,
    apiCalled,
    setAreTimeSheetsSubmitted
  } = useStore();
  const [cellEdit, setCellEdit] = useState(null);
  const tableRef = useRef();
  const [projectTotalHours, setProjectTotalHours] = useState();
  const [summedWeekDaysHours, setSummedWeekDaysHours] = useState([]);
  const [totalWeekDaysHours, setTotalWeekDaysHours] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setCellEdit(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    const mappedTimeSheetData = timeSheetData.map((el) => {
      const weekDayDates = getWeekDayDates(el);
      const hours = getWeekDayHours(el);
      const comments = getWeekDayComments(el);
      const timeSheetStatus = getTimeSheetStatus(el);
      const totalHours = el.mw_totalhours;
      let projectName = "";
      let hasEntries = false;
      let isEdited = false;
      let isNewRow = false;
      return { weekDayDates, hours, comments, timeSheetStatus, projectName, projectId: el._cr303_chargecode_value, timeSheetId: el.cr303_timesheetid, totalHours, hasEntries, isEdited, isNewRow };
    });

  
    setStaticTimeSheetData(mappedTimeSheetData);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [timeSheetData]);

  useEffect(() => {
    function createDateStringArray(weekStart, weekEnd) {
      const dateArray = [];
      const currentDate = new Date(weekStart); // Convert start date to a Date object
      
      while (currentDate <= new Date(weekEnd)) { // Continue until currentDate reaches or exceeds the end date
        dateArray.push(currentDate.toISOString().split("T")[0] + "T05:00:00Z"); // Add current date as a string in the desired format
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to the next day
      }
      
      return dateArray;
    }



    const mappedTimeSheetData = timeSheetData.map((el) => {
      const weekDayDates = getWeekDayDates(el);
      const hours = getWeekDayHours(el);
      const comments = getWeekDayComments(el);
      const timeSheetStatus = getTimeSheetStatus(el);
      const totalHours = el.mw_totalhours;
      let hasEntries = hours.some((h) => h !== null);
      let projectName = "";
      let isEdited = false;
      let isNewRow = false;
      return { 
        weekDayDates, 
        hours, 
        comments, 
        timeSheetStatus,
        projectName,
        projectId: el._cr303_chargecode_value, 
        timeSheetId: el.cr303_timesheetid,
        totalHours,
        hasEntries, 
        isEdited,
        isNewRow
      }
    });


    const draftTimeSheetData = {
      weekDayDates: createDateStringArray(weekStart, weekEnd),
      hours: [null, null, null, null, null, null, null],
      comments: [null, null, null, null, null, null, null], 
      timeSheetStatus: null,
      projectName: "",
      projectId: null,
      totalHours: null,
      hasEntries: false,
      isEdited: false, 
      isNewRow: true
    }



    const updatedTimeSheet = [...mappedTimeSheetData];
    projects.forEach((p) => {
      updatedTimeSheet.forEach((s) => {
        if(p.key === s.projectId){
          s.projectName = p.text
        }
      })
    })

    setProjectId(timeSheetData.length > 0 ? projectId : [...projectId, null])
    setModifiedTimeSheetData(timeSheetData.length > 0 ? updatedTimeSheet : [draftTimeSheetData])
  }, [timeSheetData]);


  
  useEffect(() => {
    const total = _.sumBy(modifiedTimeSheetData, 'totalHours');
    const checkingSubmitted = !modifiedTimeSheetData?.some(obj => obj.timeSheetStatus === 824660000 || obj.timeSheetStatus === null);
    console.log(modifiedTimeSheetData)
    setAreTimeSheetsSubmitted(checkingSubmitted)
    setProjectTotalHours(total)
  }, [projectTotalHours, modifiedTimeSheetData])



  useEffect(() => {
    const groupedHours = _.zip(
      ...(modifiedTimeSheetData ?? []).map(obj => obj.hours)
    );
    
    const totalHours = _.map(groupedHours, arr => (_.sum(arr) || 0));

    const total = totalHours.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    setTotalWeekDaysHours(total);
    setSummedWeekDaysHours(totalHours);
  }, [staticTimeSheetData, projectId])


  const onClickHandler = (rowIndex, cellIndex) => {
    setCellEdit({ rowIndex, cellIndex });
  };


  const onChangeHandler = (e, rowIndex, cellIndex) =>{
    const value = Number(e.target.value);
    const newValue = value <= 0 ? 0 : value;
    const updatedCell = [...modifiedTimeSheetData];
    updatedCell[rowIndex].hours[cellIndex] = newValue ? newValue : null;

    const isSheetEdited = !_.isEqual(
      _.omit(updatedCell[rowIndex], "isEdited"),
      _.omit(staticTimeSheetData[rowIndex], "isEdited")
    )

    updatedCell[rowIndex].hasEntries = updatedCell[rowIndex].hours.some((h) => h !== null);
    updatedCell[rowIndex].isEdited = isSheetEdited;
    setModifiedTimeSheetData(updatedCell);
  }


  const onBlurHandler = (hours, hour, rowIndex) => {
    const sum = hours.reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    const updatedCell = [...modifiedTimeSheetData];
    updatedCell[rowIndex].totalHours = sum;
    const totalProjectHours = _.sumBy(updatedCell, 'totalHours');

    const groupedHours = _.zip(
      ...(modifiedTimeSheetData ?? []).map(obj => obj.hours)
    );
    
    const totalHours = _.map(groupedHours, arr => (_.sum(arr) || 0));

    const totalweekdayshours = totalHours.reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    setProjectTotalHours(totalProjectHours)
    setTotalWeekDaysHours(totalweekdayshours);
    setSummedWeekDaysHours(totalHours)
    setModifiedTimeSheetData(updatedCell);
  }


  return (
    <div>
      {typeof projectTotalHours === 'number' && <ProjectChart projectTotalHours={projectTotalHours} />}
      <TableContainer>
        <Table aria-label="time sheet table">
          <TableHead sx={{background: "#77AFF2"}}>
            <TableRow>
              <TableCell sx={{padding: "0px 117px 0px 24px", borderLeft: "none !important", borderBottom: "none !important", borderTopLeftRadius: "4px !important", borderBottomLeftRadius: "4px !important"}}>
                <Stack direction="row" spacing={16.3}>
                  <Typography sx={{ fontSize: 20, color: "white" }}>Project</Typography>
                  <Typography sx={{ fontSize: 20, color: "white" }}>Description</Typography>
                </Stack>
              </TableCell>
              {apiCalled ? (timeSheetData && modifiedTimeSheetData &&
                modifiedTimeSheetData[0]?.weekDayDates.map((sheet, index) => {
                  const slicedDay = sheet.slice(8, 10);
                  console.log(weekDayNames[index])
                  return (
                    <TableCell key={index + 1} align="center" sx={{padding: "3px 20px", borderBottom: "none !important", backgroundColor: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") && "#D8EEFF"}}>
                      <Typography sx={{ fontSize: 14, color: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") ? "#87898A" : "white", opacity: 0.6 }}>
                        {weekDayNames[index]}
                      </Typography>
                      <Typography sx={{ fontSize: 32, color: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") ? "#373A3C" : "white" }}>{slicedDay}</Typography>
                    </TableCell>
                  )
                })) : (modifiedTimeSheetData &&
                  modifiedTimeSheetData[0]?.weekDayDates.map((sheet, index) => {
                  const slicedDay = sheet.slice(8, 10);
                  console.log(weekDayNames[index])
                  return (
                    <TableCell key={index + 1} align="center" sx={{padding: "3px 20px", borderBottom: "none !important", backgroundColor: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") && "#D8EEFF"}}>
                      <Typography sx={{ fontSize: 14, color: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") ? "#87898A" : "white", opacity: 0.6 }}>
                        {weekDayNames[index]}
                      </Typography>
                      <Typography sx={{ fontSize: 32, color: (weekDayNames[index] === "Sun" || weekDayNames[index] === "Sat") ? "#373A3C" : "white" }}>{slicedDay}</Typography>
                    </TableCell>
                  )
                })
                )}
              <TableCell sx={{padding: "8px 25px", fontSize: 20, color: "white", borderBottom: "none !important" }} align="center">
                Total
              </TableCell>
              <TableCell sx={{padding: "8px 25px", fontSize: 20, color: "white", borderBottom: "none !important", borderRight: "none !important", borderTopRightRadius: "4px !important", borderBottomRightRadius: "4px !important" }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableRef}>
            {modifiedTimeSheetData &&
              modifiedTimeSheetData.map((sheet, rowIndex) => {
                return (
                  <TableRow key={rowIndex + 1}>
                    <TableCell sx={{padding: "8px 24px", borderLeft: "none !important" }}>
                      <Project
                        key={uniqueId + 1}
                        projects={projects}
                        p={[...projectId][rowIndex]}
                        status={sheet.timeSheetStatus}
                        rowIndex={rowIndex}
                      />
                    </TableCell>
                    {sheet.weekDayDates.map((day, cellIndex) => {
                      return (
                        <TableCell
                          align="center"
                          sx={{
                            padding: 
                              (cellEdit?.rowIndex === rowIndex &&
                              cellEdit?.cellIndex === cellIndex &&
                              sheet.projectId !== null) &&
                              (sheet.timeSheetStatus === 824660000 || sheet.timeSheetStatus === null) ? "6px" : "8px 18px",
                            fontSize: 20,
                            position: "relative",
                            cursor:
                              (sheet.timeSheetStatus === 824660000 || sheet.timeSheetStatus === null) &&
                              sheet.projectId !== null
                                ? "pointer"
                                : "auto",
                            pointerEvents: 
                              (sheet.timeSheetStatus === 824660000 || sheet.timeSheetStatus === null) &&
                              sheet.projectId === null
                                ? "none"
                                : "auto"
                          }}
                          key={cellIndex + 1}
                          onClick={() => onClickHandler(rowIndex, cellIndex)}
                        >
                          {(cellEdit?.rowIndex === rowIndex &&
                          cellEdit?.cellIndex === cellIndex &&
                          sheet.projectId !== null) &&
                          (sheet.timeSheetStatus === 824660000 || sheet.timeSheetStatus === null) ? (
                            <TextField
                              inputProps={{
                                style:{
                                  padding: "5px 5px",
                                  textAlign: "center"
                                }
                              }}
                              sx={{maxWidth: "64px"}}
                              type="number"
                              value={sheet.hours[cellIndex] || ""}
                              onChange={(e) => onChangeHandler(e, rowIndex, cellIndex)}
                              autoFocus
                              onBlur={() => onBlurHandler(sheet.hours, sheet.hours[cellIndex], rowIndex)}
                            />
                          ) : (
                            sheet.hours[cellIndex] > 0 ? Number(sheet.hours[cellIndex]).toFixed(2) : ""
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{padding: "8px 32px", fontSize: 20 }} align="center">
                      {sheet.totalHours > 0 ? Number(sheet.totalHours).toFixed(2) : ""}
                    </TableCell>
                    <TableCell sx={{
                      padding: "8px 19px",
                      borderRight: "none !important", 
                      borderTop: "none !important",
                      textAlign: "center"
                    }} align="center">
                      <Typography sx={{
                        fontSize: statusLabels[sheet.timeSheetStatus] === "Draft" ? "16px" : "14px",
                        borderRadius: "4px",
                        padding: "4px 12px",
                        background: 
                          statusLabels[sheet.timeSheetStatus] === "Draft" ? "#DBDFE2" :
                          statusLabels[sheet.timeSheetStatus] === "Submitted" ? "#77AFF2" :
                          statusLabels[sheet.timeSheetStatus] === "Approved" ? "#169256" : "",
                        color: statusLabels[sheet.timeSheetStatus] === "Draft" ? "#373A3C" : "#FFFFFF"
                      }}>
                        {statusLabels[sheet.timeSheetStatus]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "#373A3C", fontSize: 20, borderLeft: "none !important" }}
              >
                Total work time
              </TableCell>
              {summedWeekDaysHours.map((hour, index) => {
                return <TableCell key={index} sx={{ fontSize: 20 }} align="center">
                {hour > 0 ? Number(hour).toFixed(2) : ""}
              </TableCell>
              })}
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalWeekDaysHours > 0 ? Number(totalWeekDaysHours).toFixed(2) : ""}
              </TableCell>
              <TableCell sx={{borderRight: "none !important" }}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
