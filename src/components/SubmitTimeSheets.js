import { PrimaryButton } from '@fluentui/react'
import React from 'react'

function SubmitTimeSheets({submitTimeSheets}) {
  return <PrimaryButton styles={{root: {marginLeft: 10, width: 176, height: 38, padding: 0, borderRadius: 4, background: "#1A6BA9"}}} onClick={submitTimeSheets}>Submit</PrimaryButton>
}

export default SubmitTimeSheets
