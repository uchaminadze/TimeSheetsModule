export const getWeekDayDates = (timeSheetData) => {
    const {
        cr303_sundaydate,
        cr303_mondaydate,
        cr303_tuesdaydate,
        cr303_wednesdaydate,
        cr303_thursdaydate,
        cr303_fridaydate,
        cr303_saturdaydate2,
    } = timeSheetData || {};
    
    return [
        cr303_sundaydate,
        cr303_mondaydate,
        cr303_tuesdaydate,
        cr303_wednesdaydate,
        cr303_thursdaydate,
        cr303_fridaydate,
        cr303_saturdaydate2,
    ];
}



export const getWeekDayHours = (timeSheetData) => {
    const {
        cr303_sundayhours,
        cr303_mondayhours,
        cr303_tuesdayhours,
        cr303_wednesdayhours,
        cr303_thursdayhours,
        cr303_fridayhours,
        cr303_saturdayhours
    } = timeSheetData || {};
    
    return [
        cr303_sundayhours,
        cr303_mondayhours,
        cr303_tuesdayhours,
        cr303_wednesdayhours,
        cr303_thursdayhours,
        cr303_fridayhours,
        cr303_saturdayhours
    ];
}




export const getWeekDayComments = (timeSheetData) => {
    const {
        cr303_sundaycomment,
        cr303_mondaycomment,
        cr303_tuesdaycomment,
        cr303_wednesdaycomment,
        cr303_thursdaycomment,
        cr303_fridaycomment,
        cr303_saturdaycomment
    } = timeSheetData || {};

    return [
        cr303_sundaycomment,
        cr303_mondaycomment,
        cr303_tuesdaycomment,
        cr303_wednesdaycomment,
        cr303_thursdaycomment,
        cr303_fridaycomment,
        cr303_saturdaycomment
    ]
}



export const getTimeSheetStatus = (timeSheetData) =>{
    const {
        cr303_timesheetstatus
    } = timeSheetData || {};


    return cr303_timesheetstatus
}


export const getTimeSheetTotalHours = (timeSheetData) =>{
    const {
        cr303_totalhours
    } = timeSheetData || {};


    return cr303_totalhours
}




export const statusLabels = {
    824660000: "Draft",
    824660001: "Submitted",
    124740001: "Approved",
    124740002: "Rejected"
};



export const weekDayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];