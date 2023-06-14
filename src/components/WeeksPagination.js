import { useEffect } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import useStore from "../store/useStore";

function WeeksPagination({getExactWeek}){
  const {weekStartDate, setWeekStartDate, setWeekId} = useStore();
    useEffect(() => {
      getExactWeek();
    }, [weekStartDate])


    // function getPreviousWeek() {
    //     // const currentDate = new Date();
    
    //     // Set the time to 05:00:00 in UTC
    //     // currentDate.setUTCHours(5, 0, 0, 0);
        
    //     // Calculate the start of the week
    //     // const startOfWeek = new Date(currentDate);
    //     // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
        
    //     // Format the start of the week string
    //     // const formattedStartOfWeek = startOfWeek.toISOString().split("T")[0] + "T05:00:00Z";
    
    //     const startDate = "2023-01-08T05:00:00Z";
    //     const accessToken = localStorage.getItem("accessToken");
    //     callDataverseWebAPI(`cr303_weeks?$filter=cr303_startdate eq ${weekStartDate}`, accessToken)
    //       .then((data) => {
    //         localStorage.setItem(
    //           "weekid",
    //           data.value[0].cr303_weekid
    //         );
    //         setWeekId(data.value[0].cr303_weekid)
    
    //         // setWeekStartDate(data.value[0].cr303_startdate);
    //         // setWeekEndDate(data.value[0].cr303_enddate);
    //         // setCurrentYear(data.value[0].cr303_year);
    //         // getExactTimeSheet();
    //       })
    //       .catch((err) => console.log(err));
    //   }




    const getPreviousWeek = () => {
  //     const currentDate = new Date(weekStartDate);

  // currentDate.setUTCHours(5, 0, 0, 0);
  
  // const startOfWeek = new Date(currentDate);
  // startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
  
  // const previousWeekStart = new Date(startOfWeek);
  // previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 14);
  
  // const formattedPreviousWeekStart = previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";

  //     setWeekStartDate(formattedPreviousWeekStart)
      setWeekStartDate("2023-01-01T05:00:00Z")
    }


    const getNextWeek = () => {
      setWeekStartDate("2023-01-08T05:00:00Z")
    }

    return(
      <>
        <button onClick={() => getPreviousWeek()}>Previous week</button>
        <button onClick={() => getNextWeek()}>Next week</button>
      </>
    )
}


export default WeeksPagination;