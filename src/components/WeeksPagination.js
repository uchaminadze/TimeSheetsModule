import { useEffect } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import useStore from "../store/useStore";
import { Stack } from "@fluentui/react";

function WeeksPagination({getExactWeek, apiCalled, getPreviousWeek, getNextWeek, currentYear, weekStart, weekEnd}){
  const {weekStartDate, setWeekStartDate, setWeekId} = useStore();
    useEffect(() => {
      if(!apiCalled){
        getExactWeek();
        console.log(apiCalled);
      }
    }, [weekStartDate, apiCalled])




    //     const currentDate = new Date(weekStartDate);
  
    // currentDate.setUTCHours(5, 0, 0, 0);
    
    // const startOfWeek = new Date(currentDate);
    // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
    
    // const previousWeekStart = new Date(startOfWeek);
    // previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 14);
    
    // const formattedPreviousWeekStart = previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";
  
    //     setWeekStartDate(formattedPreviousWeekStart)
    // const getPreviousWeek = () => {
    //   setApiCalled(false)
    //   setWeekStartDate("2023-01-01T05:00:00Z")
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

    return(
      <Stack horizontal>
        <button onClick={() => getPreviousWeek()}>Previous week</button>
        <button onClick={() => getNextWeek()}>Next week</button>
        <h4>{formattedDate}, {currentYear}</h4>
      </Stack>
    )
}


export default WeeksPagination;