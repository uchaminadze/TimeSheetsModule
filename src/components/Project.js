import React, { useState } from "react";
import { callDataverseWebAPI } from "../api/dataverse";

function Project({ projects }) {
    const [projectDescription, setProjectDescription] = useState('');



  const onChangeHandler = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    callDataverseWebAPI(`cr303_chargecodes(${id})`, accessToken)
      .then((data) => setProjectDescription(data.mw_description))
      .catch((err) => console.log(err));
  }


  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <select name="projects" onChange={(e) => onChangeHandler(e.target.value)} id="project-select">
        <option value="" hidden>Select a project</option>
        {projects.map((project) => {
          return (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          );
        })}
      </select>
      <p>{projectDescription ? projectDescription : "Description"}</p>
    </div>
  );
}

export default Project;
