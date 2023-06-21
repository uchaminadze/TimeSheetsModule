import { PrimaryButton } from '@fluentui/react'
import React from 'react'

function SubmitTimeSheet({submitTimeSheet}) {
  return <PrimaryButton styles={{root: {marginLeft: 10}}} onClick={submitTimeSheet}>Submit</PrimaryButton>
}

export default SubmitTimeSheet
