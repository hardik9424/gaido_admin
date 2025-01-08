import React, { useState } from 'react'

import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material'

const PetForm = ({ onSubmit }) => {
  const [petData, setPetData] = useState({
    parentName: '',
    parentEmail: '',
    parentContact: '',
    name: '',
    type: '',
    bio: '',
    gender: '',
    dateOfBirth: '',
    source: '',
    breed: '',
    colour: '',
    existingDisease: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setPetData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit(petData)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5'>Add Pet Profile</Typography>
      <FormControl fullWidth margin='normal'>
        <TextField label="Parent's Name" name='parentName' value={petData.parentName} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField label="Parent's Email" name='parentEmail' value={petData.parentEmail} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label="Parent's Contact Number"
          name='parentContact'
          value={petData.parentContact}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField label="Pet's Name" name='name' value={petData.name} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <InputLabel> Pets Type</InputLabel>
        <Select label="Pet's Type" name='type' value={petData.type} onChange={handleInputChange}>
          <MenuItem value='Dog'>Dog</MenuItem>
          <MenuItem value='Cat'>Cat</MenuItem>
          <MenuItem value='Other'>Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField label="Pet's Bio" name='bio' value={petData.bio} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <InputLabel>Pets Gender</InputLabel>
        <Select name='gender' value={petData.gender} onChange={handleInputChange}>
          <MenuItem value='Male'>Male</MenuItem>
          <MenuItem value='Female'>Female</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Date of Birth'
          type='date'
          name='dateOfBirth'
          value={petData.dateOfBirth}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Source (e.g., adoption/purchase)'
          name='source'
          value={petData.source}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField label='Breed' name='breed' value={petData.breed} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField label='Colour' name='colour' value={petData.colour} onChange={handleInputChange} />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Existing Disease'
          name='existingDisease'
          value={petData.existingDisease}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  )
}

export default PetForm
