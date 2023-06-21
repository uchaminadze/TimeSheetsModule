import React, { useState, useEffect } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import { Dropdown, initializeIcons } from "@fluentui/react";
import { Stack, Typography } from "@mui/material";
import useStore from "../store/useStore";

function Project({ projects, p, status }) {
  const {projectId, selectedProjectId, setProjectId} = useStore();
  const [selectedKey, setSelectedKey] = useState(p);
  const [changeSelectedDescription, setChangeSelectedDescription] = useState('');
    
  initializeIcons()

  const handleDropdownChange = (event, option) => {
    setSelectedKey(option.key);
    setChangeSelectedDescription(option.description);
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
