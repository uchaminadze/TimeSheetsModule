import React from "react";
import { DefaultButton, Icon, initializeIcons } from "@fluentui/react";
import useStore from "../store/useStore";
import { AddRounded } from "@mui/icons-material";

function AddTimeSheetRow() {
  const { modifiedTimeSheetData, setModifiedTimeSheetData, projectId, setProjectId } = useStore();

  initializeIcons();

  const addNewRow = () => {
    const date = modifiedTimeSheetData[0]?.weekDayDates;

    const newRow = {
      weekDayDates: [
        date[0],
        date[1],
        date[2],
        date[3],
        date[4],
        date[5],
        date[6],
      ],
      hours: [null, null, null, null, null, null, null],
      comments: [null, null, null, null, null, null, null],
      timeSheetStatus: null,
      projectId: null,
      totalHours: null,
      isEdited: false,
      isNewRow: true
    };

    setProjectId([...projectId, null])
    setModifiedTimeSheetData([...modifiedTimeSheetData, newRow]);
  };
  return (
    <DefaultButton
      styles={{ 
      root: { 
        marginRight: 10, 
        border: "none", 
        fontSize: "16px", 
        color: "#1A6BA9" 
      }, 
      rootHovered: {
        backgroundColor: "transparent", 
        color: "#1A6BA9"
      },
      rootPressed: {
        backgroundColor: "transparent", 
        color: "#1A6BA9"
      }
    }}
      onClick={addNewRow}
    >
      {/* <Icon iconName="CalculatorAddition" styles={{root: {marginRight: 10}}}/> */}
      <AddRounded sx={{marginRight: 1.6}} />
      Add timesheet row
    </DefaultButton>
  );
}

export default AddTimeSheetRow;
