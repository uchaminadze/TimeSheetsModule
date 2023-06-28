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
      updatedCell[rowIndex].chargecodeId = option.key;

      const isSheetEdited = !_.isEqual(
        _.omit(updatedCell[rowIndex], "isEdited"),
        _.omit(staticTimeSheetData[rowIndex], "isEdited")
      )
      updatedCell[rowIndex].isEdited = isSheetEdited;
      projectId[rowIndex] = option.key;
      setProjectId(projectId)
      setModifiedTimeSheetData(updatedCell)
    }

    
    
  };


useEffect(() => {
  const selectedOption = projects.find(option => option.key === p);
  setChangeSelectedDescription(selectedOption?.description);
}, [])



  const dropdownStyles = {
    dropdown: {width: 170},
  }

  return (
    <Stack direction="row" spacing={10} alignItems="center">
        <Dropdown
          placeholder={!p && "Select a project"}
          options={projects}
          responsiveMode={2}
          onChange={handleDropdownChange}
          styles={dropdownStyles}
          selectedKey={selectedKey}
          disabled={status !== 824660000}
        />

        <Typography sx={{fontSize: 14}}>{changeSelectedDescription ? changeSelectedDescription : "Description"}</Typography>
    </Stack>
  );
}

export default Project;
