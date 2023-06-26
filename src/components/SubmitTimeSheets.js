import { PrimaryButton } from '@fluentui/react'
import React from 'react'

function SubmitTimeSheets({submitTimeSheets}) {
  return <PrimaryButton styles={{root: {marginLeft: 10}}} onClick={submitTimeSheets}>Submit</PrimaryButton>
}

export default SubmitTimeSheets
