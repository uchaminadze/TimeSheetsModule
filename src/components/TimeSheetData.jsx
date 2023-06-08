import React from "react";

export const AccountData = ({timeSheetData}) => {
    const {
        cr303_sundaydate,
        cr303_mondaydate,
        cr303_tuesdaydate,
        cr303_wednesdaydate,
        cr303_thursdaydate,
        cr303_fridaydate,
        cr303_saturdaydate2,
        cr303_sundayhours,
        cr303_mondayhours,
        cr303_tuesdayhours,
        cr303_wednesdayhours,
        cr303_thursdayhours,
        cr303_fridayhours,
        cr303_saturdayhours,
    } = timeSheetData || {};

    const weekDayDates = [
        cr303_sundaydate, 
        cr303_mondaydate, 
        cr303_tuesdaydate, 
        cr303_wednesdaydate, 
        cr303_thursdaydate, 
        cr303_fridaydate, 
        cr303_saturdaydate2
    ]

    const hours = [
        cr303_sundayhours, 
        cr303_mondayhours, 
        cr303_tuesdayhours, 
        cr303_wednesdayhours, 
        cr303_thursdayhours, 
        cr303_fridayhours, 
        cr303_saturdayhours
    ]

    const weekDayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ]


    const weekStart = new Date(cr303_sundaydate);
    const weekStartMonth = weekStart.toLocaleString('default', { month: 'short' });
    const weekStartDay = weekStart.getUTCDate();

    const weekEnd = new Date(cr303_saturdaydate2);
    const weekEndMonth = weekEnd.toLocaleString('default', { month: 'short' });
    const weekEndDay = weekEnd.getUTCDate();

    const formattedDate = `${weekStartMonth} ${weekStartDay} - ${weekEndMonth} ${weekEndDay}`;

    
    return (
        <div>
            <h3>Time Sheet Table</h3>
            <h5>{formattedDate}</h5>
            <div style={{display: "flex", justifyContent: "space-between"}}>
            {weekDayDates.map((day, index) => {
                const slicedDay = day.slice(8, 10);
                return(
                    <div key={index + 1}>
                        <div>
                            <p><strong>{weekDayNames[index]}</strong></p>
                        </div>

                        <div>
                            <p>{slicedDay}</p>
                        </div>

                        <div>
                            <p>{hours[index]}</p>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    );
};
    


