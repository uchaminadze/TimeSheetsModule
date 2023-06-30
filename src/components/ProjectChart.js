import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore';
import { Stack } from '@mui/material';

function ProjectChart({projectTotalHours}) {
    const {modifiedTimeSheetData} = useStore();
    return (
        <Stack direction="row" spacing={1}>
        {modifiedTimeSheetData?.map((sheet, index) => {
            const percentage = (sheet.totalHours / projectTotalHours) * 100
            return(
                <div key={index} style={{backgroundColor: sheet.randomColor, borderRadius: "5px", height: "20px", width: `${percentage}%`}}></div>
            )
        })}
        </Stack>
    )
}

export default ProjectChart;
