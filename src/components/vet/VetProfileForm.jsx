import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material'

const CreateVet = ({ isOpen, onClose, onSubmit, initialVetData }) => {
  const [name, setName] = useState(initialVetData?.name || '')
  const [specialization, setSpecialization] = useState(initialVetData?.specialization || '')
  const [profilePicture, setProfilePicture] = useState(initialVetData?.profilePicture || null) // Store image file
  const [bio, setBio] = useState(initialVetData?.bio || '')
  const [clinicId, setClinicId] = useState(initialVetData?.clinicId || '') // Clinic ID selection
  const [experience, setExperience] = useState(initialVetData?.experience || '') // Add experience field
  const [clinics, setClinics] = useState([]) // Clinics for dropdown
  const router = useRouter()

  // Fetch clinics for dropdown
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('/api/clinics') // Assuming you have a getClinics API
        setClinics(response.data)
      } catch (error) {
        console.error('Error fetching clinics', error)
      }
    }
    fetchClinics()
  }, [])

  // Handle image upload
  const handleImageUpload = async event => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await axios.post('/api/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setProfilePicture(response.data.url) // Assuming response returns the uploaded image URL
      } catch (error) {
        console.error('Image upload failed', error)
      }
    }
  }

  // Handle form submission (Create or Edit Vet)
  const handleSubmit = async event => {
    event.preventDefault()

    const vetData = {
      name,
      specialization,
      profilePicture,
      bio,
      clinicId,
      experience
    }

    onSubmit(vetData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{initialVetData ? 'Edit Vet Profile' : 'Create Vet Profile'}</DialogTitle>
      <DialogContent dividers style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            label='Specialization'
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            label='Experience (years)'
            type='number'
            value={experience}
            onChange={e => setExperience(e.target.value)}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            label='Bio'
            value={bio}
            onChange={e => setBio(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin='normal'
          />
          <Select
            label='Assign Clinic'
            value={clinicId}
            onChange={e => setClinicId(e.target.value)}
            fullWidth
            required
            margin='normal'
          >
            <MenuItem value='' disabled>
              Select Clinic
            </MenuItem>
            {clinics.map(clinic => (
              <MenuItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </MenuItem>
            ))}
          </Select>
          <div>
            <label>Profile Picture:</label>
            <input type='file' accept='image/*' onChange={handleImageUpload} />
            {profilePicture && (
              <img src={profilePicture} alt='Profile Preview' width={100} style={{ marginTop: '10px' }} />
            )}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color='primary' variant='contained'>
          {initialVetData ? 'Save Changes' : 'Create Vet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateVet
