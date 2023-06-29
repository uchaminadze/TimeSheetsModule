import { Dropdown, initializeIcons } from "@fluentui/react";
import React from "react";
import useStore from "../store/useStore";

function WeeksDropdown({ weeks }) {
    const {weekId, setWeekId, setWeekStartDate, setApiCalled, selectedWeek} = useStore();

    initializeIcons()



    const onChangeHandler = (event, option) => {
        if(option){
            console.log(option);
            setWeekId(option.key)
            setWeekStartDate(option.date)
            setApiCalled(false)
        }
    }


  return (
    <Dropdown
      options={weeks}
      responsiveMode={2}
      onChange={onChangeHandler}
      selectedKey={weekId}
    />
  );
}

export default WeeksDropdown;
