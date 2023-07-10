import { Dropdown, initializeIcons } from "@fluentui/react";
import React from "react";
import useStore from "../store/useStore";

function WeeksDropdown({ weeks, getTimeSheets }) {
    const {weekId, setWeekId, setWeekStartDate, setApiCalled, selectedWeek} = useStore();

    initializeIcons()



    const onChangeHandler = (event, option) => {
        if(option){
            console.log(option);
            setWeekId(option.key)
            setWeekStartDate(option.date)
            setApiCalled(false)
            getTimeSheets("afterfirstrender")
        }
    }


  return (
    <Dropdown
      options={weeks}
      responsiveMode={2}
      onChange={onChangeHandler}
      selectedKey={weekId}
      styles={{root: {
        marginLeft: "32px",
        position: "relative",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#373A3C",
        "::before": {
          content: "''",
          position: "absolute",
          height: "30px",
          width: "1px",
          borderRadius: "1px",
          top: "1px",
          backgroundColor: "#D0D6DA",
          zIndex: 1,
          transform: "translateX(-12px)"
        }
      },
      title: {
        padding: "2px 40px 0 8px",
      },
      caretDown: {
        fontSize: "17px",
        color: "#373A3C",
        fontWeight: 600,
        marginLeft: "12px !important",
        padding: "2px 0 0 0"
      }
    }}
    />
  );
}

export default WeeksDropdown;
