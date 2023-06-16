import React from "react";
import useStore from "../store/useStore";
import {
  getWeekDayComments,
  getWeekDayDates,
  getWeekDayHours,
  weekDayNames,
} from "../data/timeSheetData";
import Project from "./Project";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack, TableFooter, Typography } from "@mui/material";

export const TimeSheetData = ({ projects }) => {
  const {projectId, timeSheetData } = useStore();


  
  
  const mappedTimeSheetData = timeSheetData.map((el) => {
    const weekDayDates = getWeekDayDates(el);
    const hours = getWeekDayHours(el);
    const comments = getWeekDayComments(el);

    return { weekDayDates, hours, comments };
  });

  const totalSundayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_sundayhours,
    0
  );
  const totalMondayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_mondayhours,
    0
  );
  const totalTuesdayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_tuesdayhours,
    0
    );
  const totalWednesdayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_wednesdayhours,
    0
  );
  const totalThursdayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_thursdayhours,
    0
  );
  const totalFridayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_fridayhours,
    0
  );
  const totalSaturdayHours = timeSheetData.reduce(
    (sum, obj) => sum + obj.cr303_saturdayhours,
    0
  );

  const allWorkedHours = [
    totalSundayHours,
    totalMondayHours,
    totalTuesdayHours,
    totalWednesdayHours,
    totalThursdayHours,
    totalFridayHours,
    totalSaturdayHours,
  ];

  const total = allWorkedHours.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  
  const weekDayDates = mappedTimeSheetData[0].weekDayDates.map(
    (sheet, index) => {
      const slicedDay = sheet.slice(8, 10);
      return slicedDay;
    }
    );


    
  const timeSheetStatus = timeSheetData[0].cr303_timesheetstatus;


  const statusLabels = {
    824660000: "Draft",
    824660001: "Submitted",
    124740001: "Approved",
    124740002: "Rejected"
  };

    
  return (
    <div>
      <TableContainer sx={{ maxWidth: 1480 }}>
        <Table aria-label="time sheet table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Stack direction="row" spacing={23.1}>
                  <Typography sx={{fontSize: 20}}>Project</Typography>
                  <Typography sx={{fontSize: 20}}>Description</Typography>
                </Stack>
              </TableCell>
              {weekDayNames.map((day, index) => {
                return (
                  <TableCell key={index + 1} align="center">
                    <Typography sx={{fontSize: 14}}>{day}</Typography>
                    <Typography sx={{fontSize: 32}}>{weekDayDates[index]}</Typography>
                  </TableCell>
                );
              })}
              <TableCell sx={{fontSize: 20}} align="center">Total</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <TableRow>
            <TableCell>
              {projectId.map((p) => (

                <Project key={p} projects={projects} p={p}/>
              ))}
            </TableCell>

            </TableRow> */}
            {mappedTimeSheetData.map((sheet, index) => {
              const sum = sheet.hours.reduce((acc, curr) => {
                return acc + curr;
              }, 0);
              return (
                <TableRow key={index + 1}>
                  <TableCell>
                    <Project projects={projects}/>
                  </TableCell>
                  {sheet.weekDayDates.map((day, index) => (
                    <TableCell align="center" sx={{
                      fontSize: 20, 
                      position: "relative",
                      cursor: "pointer"
                    }} key={index + 1}>
                      {sheet.hours[index]}
                    </TableCell>
                  ))}
                  <TableCell sx={{fontSize: 20}} align="center">{sum}</TableCell>
                  <TableCell sx={{fontSize: 20}} align="center">
                    {statusLabels[timeSheetStatus] || ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "#373A3C", fontSize: 20 }}
              >
                Total work time
              </TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalSundayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalMondayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalTuesdayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalWednesdayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalThursdayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalFridayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{totalSaturdayHours}</TableCell>
              <TableCell sx={{fontSize: 20}} align="center">{total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
