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

export const TimeSheetData = ({ projects }) => {
  const {
    projectId,
    timeSheetData,
    uniqueId,
    modifiedTimeSheetData,
    setModifiedTimeSheetData,
    staticTimeSheetData,
    setStaticTimeSheetData
  } = useStore();
  const [cellEdit, setCellEdit] = useState(null);
  const tableRef = useRef();

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
      let isEdited = false;
      let isNewRow = false;
      console.log(el);
      return { weekDayDates, hours, comments, timeSheetStatus, chargecodeId: el._cr303_chargecode_value, timeSheetId: el.cr303_timesheetid, isEdited, isNewRow };
    });
  
    setStaticTimeSheetData(mappedTimeSheetData);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mappedTimeSheetData = timeSheetData.map((el) => {
      const weekDayDates = getWeekDayDates(el);
      const hours = getWeekDayHours(el);
      const comments = getWeekDayComments(el);
      const timeSheetStatus = getTimeSheetStatus(el);
      let isEdited = false;
      let isNewRow = false;
      console.log(el);
      return { weekDayDates, hours, comments, timeSheetStatus, chargecodeId: el._cr303_chargecode_value, timeSheetId: el.cr303_timesheetid, isEdited, isNewRow };
    });


    const result = modifiedTimeSheetData?.reduce(function(array1, array2) {
      return array2.hours.map(function(value, index) {
        return value + (array1[index] || 0);
      }, 0);
    }, []);

    console.log(result);
    
    
    setModifiedTimeSheetData(mappedTimeSheetData)
  }, [timeSheetData]);


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
    updatedCell[rowIndex].isEdited = isSheetEdited;
    setModifiedTimeSheetData(updatedCell)

    // const updatedFields = _.omitBy(updatedCell[rowIndex], (value, key) => {
    //   return _.isEqual(value, staticTimeSheetData[rowIndex][key]);
    // });
  }

  return (
    <div>
      <TableContainer sx={{ maxWidth: 1480 }}>
        <Table aria-label="time sheet table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Stack direction="row" spacing={23.1}>
                  <Typography sx={{ fontSize: 20 }}>Project</Typography>
                  <Typography sx={{ fontSize: 20 }}>Description</Typography>
                </Stack>
              </TableCell>
              {modifiedTimeSheetData &&
                modifiedTimeSheetData[0]?.weekDayDates.map((sheet, index) => {
                  const slicedDay = sheet.slice(8, 10);
                  return (
                    <TableCell key={index + 1} align="center">
                      <Typography sx={{ fontSize: 14 }}>
                        {weekDayNames[index]}
                      </Typography>
                      <Typography sx={{ fontSize: 32 }}>{slicedDay}</Typography>
                    </TableCell>
                  );
                })}
              <TableCell sx={{ fontSize: 20 }} align="center">
                Total
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableRef}>
            {modifiedTimeSheetData &&
              modifiedTimeSheetData.map((sheet, rowIndex) => {
                const sum = sheet.hours.reduce((acc, curr) => {
                  return acc + curr;
                }, 0);
                return (
                  <TableRow key={rowIndex + 1}>
                    <TableCell>
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
                            fontSize: 20,
                            position: "relative",
                            cursor:
                              sheet.timeSheetStatus === 824660000
                                ? "pointer"
                                : "auto",
                          }}
                          key={cellIndex + 1}
                          onClick={() => onClickHandler(rowIndex, cellIndex)}
                        >
                          {cellEdit?.rowIndex === rowIndex &&
                          cellEdit?.cellIndex === cellIndex &&
                          sheet.timeSheetStatus === 824660000 ? (
                            <TextField
                              type="number"
                              defaultValue={sheet.hours[cellIndex]}
                              onChange={(e) => onChangeHandler(e, rowIndex, cellIndex)}
                              autoFocus
                            />
                          ) : (
                            sheet.hours[cellIndex] > 0 ? sheet.hours[cellIndex] : ""
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{ fontSize: 20 }} align="center">
                      {sum > 0 ? sum : ""}
                    </TableCell>
                    <TableCell sx={{ fontSize: 20 }} align="center">
                      {statusLabels[sheet.timeSheetStatus]}
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
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalSundayHours > 0 ? totalSundayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalMondayHours > 0 ? totalMondayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalTuesdayHours > 0 ? totalTuesdayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalWednesdayHours > 0 ? totalWednesdayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalThursdayHours > 0 ? totalThursdayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalFridayHours > 0 ? totalFridayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {totalSaturdayHours > 0 ? totalSaturdayHours : ""}
              </TableCell>
              <TableCell sx={{ fontSize: 20 }} align="center">
                {total > 0 ? total : ""}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
