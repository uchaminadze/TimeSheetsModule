import React from "react";
import useStore from "../store/useStore";
import {
  getWeekDayComments,
  getWeekDayDates,
  getWeekDayHours,
  weekDayNames,
} from "../data/timeSheetData";
import Project from "./Project";

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

    return { weekDayDates: weekDayDates, hours: hours, comments: comments };
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



  const totalSundayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_sundayhours, 0);
  const totalMondayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_mondayhours, 0);
  const totalTuesdayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_tuesdayhours, 0);
  const totalWednesdayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_wednesdayhours, 0);
  const totalThursdayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_thursdayhours, 0);
  const totalFridayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_fridayhours, 0);
  const totalSaturdayHours = timeSheetData.reduce((sum, obj) => sum + obj.cr303_saturdayhours, 0);


  return (
    <div>
      <h3>Time Sheet Table</h3>
      <h5>{formattedDate}</h5>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDayNames.map((day, index) => {
            return (
              <div key={index + 1}>
                <div>
                  <p>
                    <strong>{day}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {mappedTimeSheetData[0].weekDayDates.map((sheet, index) => {
            const slicedDay = sheet.slice(8, 10);
            return (
              <div key={index + 1}>
                <p>{slicedDay}</p>
              </div>
            );
          })}
        </div>
        {mappedTimeSheetData.map((sheet, index) => {
            const sum = sheet.hours.reduce((acc, curr) => {
                return acc + curr;
              }, 0);
          return (
            <div
              key={index + 1}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <Project projects={projects} />
              </div>
              {sheet.weekDayDates.map((day, index) => {
                console.log(sheet);
                return (
                  <div key={index + 1}>
                    <div>
                      <p>{sheet.hours[index]}</p>
                    </div>

                    <div>
                      <p style={{ width: "40px" }}>{sheet.comments[index]}</p>
                    </div>
                  </div>
                );
              })}
            <div>
                <p>{sum}</p>
            </div>
            </div>
          );
        })}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <p>Total work time:</p>

            <span>{totalSundayHours}</span>
            <span>{totalMondayHours}</span>
            <span>{totalTuesdayHours}</span>
            <span>{totalWednesdayHours}</span>
            <span>{totalThursdayHours}</span>
            <span>{totalFridayHours}</span>
            <span>{totalSaturdayHours}</span>
        </div>
      </div>
    </div>
  );
};
