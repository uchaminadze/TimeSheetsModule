import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore';
import { Stack, Text } from '@fluentui/react';
// import { Stack } from '@mui/material';

function ProjectChart({projectTotalHours}) {
    const {modifiedTimeSheetData} = useStore();
    return (
            <Stack horizontal styles={{root: {gridGap: "4px", marginBottom: "52px"}}}>
                {modifiedTimeSheetData?.map((sheet, index) => {
                    const percentage = (sheet.totalHours / projectTotalHours) * 100;
                    const projectColor = 
                        index === 0 ? "#8465D7" :
                        index === 1 ? "#EFAE05" :
                        index === 2 ? "#169256" :
                        index === 3 ? "#8C1F1F" :
                        index === 4 ? "#BBAC25" :
                        index === 5 ? "#34A7FF" :
                        index === 6 ? "#F18888" : ""
                    console.log(index)
                    return(
                        <div key={index} style={{width: `${percentage}%`}}>
                        <Stack.Item styles={{root: {width: "100%"}}}>
                            <Text block>Project name</Text>
                        </Stack.Item>

                        <Stack.Item styles={{root: {backgroundColor: projectColor, borderRadius: "4px", height: "14px", width: "100%"}}}>
                            <div  style={{backgroundColor: projectColor, borderRadius: "4px", height: "14px", width: "100%"}}></div>
                        </Stack.Item>
                        
                        </div>

                    )
                })}
            </Stack>
    )
}

export default ProjectChart;
