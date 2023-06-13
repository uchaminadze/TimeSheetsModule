import React, { useState } from "react";
import { callDataverseWebAPI } from "../api/dataverse";
import { Dropdown, initializeIcons } from "@fluentui/react";
import { Typography } from "@mui/material";

function Project({ projects }) {
  const [projectDescription, setProjectDescription] = useState('');
    
  initializeIcons()


  const onChangeHandler = (event, option) => {
    if(option){
      const accessToken = localStorage.getItem("accessToken");
      callDataverseWebAPI(`cr303_chargecodes(${option.key})`, accessToken)
        .then((data) => setProjectDescription(data.mw_description))
        .catch((err) => console.log(err));
    }
  }



  const dropDownStyles = {
    dropdown: {width: 170}
  }



  return (
    <div style={{ display: "flex", alignItems: "center" }}>
        <Dropdown 
          placeholder="Select a project"
          options={projects}
          responsiveMode={2}
          onChange={onChangeHandler}
          styles={dropDownStyles}
        />

        <Typography>{projectDescription}</Typography>
    </div>
  );
}

export default Project;
