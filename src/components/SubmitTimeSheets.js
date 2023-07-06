import { PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react'
import React, { useEffect } from 'react'
import useStore from '../store/useStore'

function SubmitTimeSheets({submitTimeSheets, isLoading}) {
  const {areTimeSheetsSubmitted} = useStore()

  return(
    <PrimaryButton disabled={areTimeSheetsSubmitted} styles={{root: {marginLeft: 10, width: 176, height: 38, padding: 0, borderRadius: 4, background: "#1A6BA9"}}} onClick={submitTimeSheets}>
      {isLoading.submitbutton && (<Spinner size={SpinnerSize.small} styles={{root: {position: "absolute", left: "45px"}}}/>)} Submit
    </PrimaryButton>
  ) 
}

export default SubmitTimeSheets
