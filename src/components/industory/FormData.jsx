'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, CardHeader, TextField, FormControlLabel, Checkbox } from '@mui/material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const FormData = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '', // For React Quill content
    isImportant: false
  })

  const [isFormValid, setIsFormValid] = useState({
    name: true,
    description: true
  })

  const router = useRouter()

  // Handle input changes for name, description, and details
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCheckboxChange = e => {
    const { checked } = e.target
    setFormData(prevState => ({ ...prevState, isImportant: checked }))
  }

  const handleDetailsChange = value => {
    setFormData(prevState => ({ ...prevState, details: value }))
  }

  // Validation for name and description
  const validateForm = () => {
    const nameValid = formData.name.trim() !== ''
    const descriptionValid = formData.description.trim() !== ''
    setIsFormValid({
      name: nameValid,
      description: descriptionValid
    })
    return nameValid && descriptionValid
  }

  // Handle Save button click
  const handleSave = () => {
    if (validateForm()) {
      // Handle form save logic (e.g., API call)
      console.log('Form Data Submitted:', formData)
      // Reset the form after submission
      setFormData({
        name: '',
        description: '',
        details: '',
        isImportant: false
      })
    }
  }

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      details: '',
      isImportant: false
    })
  }

  // Handle back navigation
  const handleBack = () => {
    router.back()
  }

  return (
    <>
      <Box sx={{ padding: 4, maxWidth: '1800px', margin: 'auto' }}>
        <CardHeader
          title='Add Industry Details'
          titleTypographyProps={{
            variant: 'h5',
            fontWeight: 'bold'
          }}
          subheader='Add details for the industry'
        />

        {/* Industry Name Input */}
        <TextField
          label='Industry Name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
          error={!isFormValid.name}
          helperText={!isFormValid.name ? 'Name is required' : ''}
        />

        {/* Industry Description Input */}
        <TextField
          label='Industry Description'
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
          multiline
          rows={4}
          error={!isFormValid.description}
          helperText={!isFormValid.description ? 'Description is required' : ''}
        />

        {/* React Quill Editor for Details */}
        <Box sx={{ marginTop: 2 }}>
          <h4>Add Details (optional)</h4>
          <ReactQuill
            value={formData.details}
            onChange={handleDetailsChange}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['blockquote'],
                [{ align: [] }],
                ['image', 'video'],
                ['clean']
              ]
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ marginTop: 3 }}>
          <Button onClick={handleBack} color='primary' sx={{ marginRight: 2 }}>
            Back
          </Button>
          <Button onClick={handleReset} color='primary' sx={{ marginRight: 2 }}>
            Reset
          </Button>
          <Button onClick={handleSave} color='primary' disabled={!isFormValid.name || !isFormValid.description}>
            Save
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default FormData
