import React from 'react';
import { DefaultButton } from '@fluentui/react';
import useStore from '../store/useStore';


function AddTimeSheetRow(){
    const {modifiedTimeSheetData, setModifiedTimeSheetData} = useStore();

    const addNewRow = () => {
        const date = modifiedTimeSheetData[0]?.weekDayDates
    
        const newRow = {
          weekDayDates: [date[0], date[1], date[2], date[3], date[4], date[5], date[6]],
          hours: [null, null, null, null, null, null, null],
          comments: [null, null, null, null, null, null, null],
          timeSheetStatus: 824660000,
          chargecodeId: null,
          isEdited: false,
          isNewRow: true
        }
    
        setModifiedTimeSheetData([...modifiedTimeSheetData, newRow])
      }
    return(
        <DefaultButton styles={{root: {marginRight: 10}}} onClick={addNewRow}>+ add timesheet row</DefaultButton>
    )
}


export default AddTimeSheetRow;