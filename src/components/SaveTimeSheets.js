import { DefaultButton } from '@fluentui/react'
import React from 'react'

function SaveTimeSheets({saveTimeSheets}) {
    
  return (
    <DefaultButton styles={{root: {marginRight: 10}}} onClick={saveTimeSheets}>Save</DefaultButton>
  )
}

export default SaveTimeSheets
