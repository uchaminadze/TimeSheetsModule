import React, { useState, useEffect } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import { Dropdown, initializeIcons } from "@fluentui/react";
import { Stack, Typography } from "@mui/material";
import useStore from "../store/useStore";
import _ from "lodash";

function Project({ projects, p, status, rowIndex }) {
  const {modifiedTimeSheetData, setModifiedTimeSheetData, staticTimeSheetData, projectId, setProjectId} = useStore();
  const [selectedKey, setSelectedKey] = useState(p);
  const [changeSelectedDescription, setChangeSelectedDescription] = useState('');
    
  initializeIcons()

  const handleDropdownChange = (event, option) => {
    if(!projectId.includes(option.key)){
      setSelectedKey(option.key);
      setChangeSelectedDescription(option.description);

      const updatedCell = [...modifiedTimeSheetData];
      updatedCell[rowIndex].projectId = option.key;

      const isSheetEdited = !_.isEqual(
        _.omit(updatedCell[rowIndex], "isEdited"),
        _.omit(staticTimeSheetData[rowIndex], "isEdited")
      )
      updatedCell[rowIndex].isEdited = isSheetEdited;
      projectId[rowIndex] = option.key;
      updatedCell[rowIndex].projectName = option.text
      setProjectId(projectId)
      setModifiedTimeSheetData(updatedCell)
    }
  };


  useEffect(() => {
    const selectedOption = projects.find(option => option.key === p);
    setChangeSelectedDescription(selectedOption?.description);
    setSelectedKey(selectedOption?.key)
    console.log(projectId[rowIndex])
  }, [modifiedTimeSheetData, projectId])

   
  // useEffect(() => { 
    // const updatedTimeSheet = [...modifiedTimeSheetData];
    // projects.forEach((p) => {
    //   if(p.key === updatedTimeSheet[rowIndex].projectId){
    //     updatedTimeSheet[rowIndex].projectName = p.text
    //   }
    // })
  // }, [])



  // const dropdownStyles = {
  //   dropdown: {width: 170},
  // }

  return (
    <Stack direction="row" spacing={10} alignItems="center">
        <Dropdown
          placeholder={!p && "Select a project"}
          options={projects}
          responsiveMode={2}
          onChange={handleDropdownChange}
          styles={{root: {
            width: 170,
            border: "none",
            position: "relative",
            "::before": {
              content: "''",
              position: "absolute",
              height: "24px",
              width: "4px",
              transform: "translateY(15%)",
              backgroundColor: 
                rowIndex === 0 && projectId[rowIndex] !== null ? "#8465D7" :
                rowIndex === 1 && projectId[rowIndex] !== null ? "#EFAE05" :
                rowIndex === 2 && projectId[rowIndex] !== null ? "#169256" :
                rowIndex === 3 && projectId[rowIndex] !== null ? "#8C1F1F" :
                rowIndex === 4 && projectId[rowIndex] !== null ? "#BBAC25" :
                rowIndex === 5 && projectId[rowIndex] !== null ? "#34A7FF" :
                rowIndex === 6 && projectId[rowIndex] !== null ? "#F18888" :
                projectId[rowIndex] === null && "#D0D6DA",
              borderRadius: "4px",
              zIndex: 1
            }
          },
          
          title: {
            padding: "0 40px 0 14px",
          },

          caretDown: {
            color: "#373A3C",
            fontWeight: 600
          }
        }}
          selectedKey={selectedKey}
          disabled={status !== null && status !== 824660000}
          
        />

        <Typography sx={{
            fontSize: 14,
            color: changeSelectedDescription ? "#373A3C" : "#87898A"
          }}
        >
          {changeSelectedDescription ? changeSelectedDescription : "Description"}
        </Typography>
    </Stack>
  );
}

export default Project;
