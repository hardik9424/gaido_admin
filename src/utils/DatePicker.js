import React, { useState } from 'react'

import { TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material'

const CustomDatePicker = ({ label, value, onChange }) => {
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [amPm, setAmPm] = useState('AM')

  // Handle the change of time values
  const handleHourChange = e => {
    const newHour = e.target.value
    setHour(newHour)
    updateTime(newHour, minute, amPm)
  }

  const handleMinuteChange = e => {
    const newMinute = e.target.value
    setMinute(newMinute)
    updateTime(hour, newMinute, amPm)
  }

  const handleAmPmChange = e => {
    const newAmPm = e.target.value
    setAmPm(newAmPm)
    updateTime(hour, minute, newAmPm)
  }

  // Update the time state in the parent component
  const updateTime = (hour, minute, amPm) => {
    if (hour && minute) {
      const formattedTime = `${hour}:${minute} ${amPm}`
      onChange(formattedTime) // Send the formatted time to the parent
    }
  }

  return (
    <Box display='flex' gap={2} alignItems='center'>
      {/* Date Picker */}

      {/* Hour selection */}
      <FormControl>
        <InputLabel id='hour-label'></InputLabel>
        <Select labelId='hour-label' value={hour} onChange={handleHourChange} displayEmpty>
          <MenuItem value='' disabled>
            Select Hour
          </MenuItem>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
            <MenuItem key={hour} value={hour}>
              {hour}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Minute selection */}
      <FormControl>
        <InputLabel id='minute-label'></InputLabel>
        <Select labelId='minute-label' value={minute} onChange={handleMinuteChange} displayEmpty>
          <MenuItem value='' disabled>
            Select Minute
          </MenuItem>
          {Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i)).map(minute => (
            <MenuItem key={minute} value={minute}>
              {minute}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* AM/PM selection */}
      <FormControl>
        <InputLabel id='am-pm-label'></InputLabel>
        <Select labelId='am-pm-label' value={amPm} onChange={handleAmPmChange}>
          <MenuItem value='AM'>AM</MenuItem>
          <MenuItem value='PM'>PM</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default CustomDatePicker
