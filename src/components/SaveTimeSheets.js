import { DefaultButton, Spinner, SpinnerSize } from '@fluentui/react'
import React from 'react'

function SaveTimeSheets({saveTimeSheets, isLoading}) {
    
  return (
    <DefaultButton styles={{root: {marginRight: 10, width: 176, height: 38, padding: 0, borderRadius: 4, color: "#1A6BA9",  border: "1px solid #1A6BA9"}}} onClick={saveTimeSheets}>
      {isLoading.savebutton && (<Spinner size={SpinnerSize.small} styles={{root: {position: "absolute", left: "45px"}}}/>)} Save
    </DefaultButton>
  )
}

export default SaveTimeSheets
