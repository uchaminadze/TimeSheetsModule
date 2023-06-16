import React, { useState } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import { Dropdown, initializeIcons } from "@fluentui/react";
import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import useStore from "../store/useStore";

function Project({ projects }) {
  const {projectId, setProjectId, projectDescription} = useStore();
    
  initializeIcons()


  const onChangeHandler = (event, option) => {
    if(option){
      setProjectId(option.key)
    }
}



  const dropdownStyles = {
    dropdown: {width: 170},
  }



  return (
    <Stack direction="row" spacing={10} alignItems="center">
        <Dropdown
          placeholder={!projectId && "Select a project"}
          options={projects}
          responsiveMode={2}
          onChange={onChangeHandler}
          styles={dropdownStyles}
          selectedKey={projectId}
        />

        <Typography sx={{fontSize: 14, }}>{projectDescription && projectId ? projectDescription : "Description"}</Typography>
    </Stack>
  );
}

export default Project;
