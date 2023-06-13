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
import { TableFooter, Typography } from "@mui/material";

export const TimeSheetData = ({ projects }) => {
  const { timeSheetData } = useStore();

  const cr303_sundaydate = timeSheetData.map((el) => {
    return el.cr303_sundaydate;
  });

  const cr303_saturdaydate2 = timeSheetData.map((el) => {
    return el.cr303_saturdaydate2;
  });

  const mappedTimeSheetData = timeSheetData.map((el) => {
    const weekDayDates = getWeekDayDates(el);
    const hours = getWeekDayHours(el);
    const comments = getWeekDayComments(el);

    return { weekDayDates, hours, comments };
  });

  const weekStart = new Date(cr303_sundaydate[0]);
  const weekStartMonth = weekStart.toLocaleString("default", {
    month: "short",
  });
  const weekStartDay = weekStart.getUTCDate();

  const weekEnd = new Date(cr303_saturdaydate2[0]);
  const weekEndMonth = weekEnd.toLocaleString("default", { month: "short" });
  const weekEndDay = weekEnd.getUTCDate();

  const formattedDate = `${weekStartMonth} ${weekStartDay} - ${weekEndMonth} ${weekEndDay}`;

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

  return (
    <div>
      <h5>{formattedDate}</h5>
      <TableContainer sx={{ maxWidth: 1480 }}>
        <Table aria-label="time sheet table">
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography>Project</Typography>
                  <Typography>Description</Typography>
                </div>
              </TableCell>
              {weekDayNames.map((day, index) => {
                return (
                  <TableCell key={index + 1} align="center">
                    <Typography>{day}</Typography>
                    <Typography>{weekDayDates[index]}</Typography>
                  </TableCell>
                );
              })}
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedTimeSheetData.map((sheet, index) => {
              const sum = sheet.hours.reduce((acc, curr) => {
                return acc + curr;
              }, 0);
              return (
                <TableRow key={index + 1}>
                  <TableCell>
                    <Project projects={projects} />
                  </TableCell>
                  {sheet.weekDayDates.map((day, index) => (
                    <TableCell align="center" key={index + 1}>
                      {sheet.hours[index]}
                    </TableCell>
                  ))}
                  <TableCell align="center">{sum}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "#373A3C" }}
              >
                Total work time
              </TableCell>
              <TableCell align="center">{totalSundayHours}</TableCell>
              <TableCell align="center">{totalMondayHours}</TableCell>
              <TableCell align="center">{totalTuesdayHours}</TableCell>
              <TableCell align="center">{totalWednesdayHours}</TableCell>
              <TableCell align="center">{totalThursdayHours}</TableCell>
              <TableCell align="center">{totalFridayHours}</TableCell>
              <TableCell align="center">{totalSaturdayHours}</TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
