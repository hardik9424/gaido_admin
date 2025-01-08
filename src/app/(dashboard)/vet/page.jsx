'use client'

import React, { useState, useEffect } from 'react'

import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  TablePagination,
  CardHeader
} from '@mui/material'

import { Person2 } from '@mui/icons-material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { getAllVets, createVet, editVet, getAllHospital, uploadImage, deleteVet } from '@/app/api'

const VetManagementPage = () => {
  const [vets, setVets] = useState([])
  const [hospitalLists, setHospitalLists] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedVet, setSelectedVet] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vetToDelete, setVetToDelete] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedDates, setSelectedDates] = useState([])
  const [error, setError] = useState({})
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [userRole, setUserRole] = useState('')

  const [newVet, setNewVet] = useState({
    name: '',
    specialization: '',
    profilePicture: '',
    bio: '',
    slots: [],
    clinicId: [],
    experience: ''
  })

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])

  const formatTimeTo12Hour = time24 => {
    const [hour, minute] = time24.split(':')
    let hourInt = parseInt(hour)
    const amPm = hourInt >= 12 ? 'PM' : 'AM'
    hourInt = hourInt % 12 || 12
    return `${hourInt.toString().padStart(2, '0')}:${minute} ${amPm}`
  }

  // Generate time slots from 9:00 AM to 8:00 PM with leading zero
  // const timeSlots = Array.from({ length: 12 }, (_, i) => {
  //   const hour = i + 9
  //   return `${hour.toString().padStart(2, '0')}:00`
  // })
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour24 = i + 9
    const hour12 = hour24 % 12 || 12
    const period = hour24 >= 12 ? 'PM' : 'AM'
    return `${hour12.toString().padStart(2, '0')}:00 ${period}`
  })

  const fetchVets = async () => {
    try {
      const response = await getAllVets()
      setVets(response.data.data || [])
    } catch (error) {
      toast.error('Error fetching vets')
      setVets([])
    }
  }

  const fetchAllHospitals = async () => {
    try {
      const response = await getAllHospital()
      if (response.status === 200) {
        setHospitalLists(response?.data?.data)
      }
    } catch (error) {
      toast.error('Error fetching hospitals')
      setHospitalLists([])
    }
  }

  useEffect(() => {
    fetchVets()
    fetchAllHospitals()
  }, [])

  const handleInputChange = e => {
    const { name, value } = e.target
    if (error[name]) {
      setError({
        ...error,
        [name]: ''
      })
    }
    setNewVet(prev => ({ ...prev, [name]: value }))
  }
  // name: '',
  // specialization: '',
  // profilePicture: '',
  // bio: '',
  // slots: [],
  // clinicId: [],
  // experience: '' // New field for experience

  const validate = () => {
    const tempError = {}
    if (!newVet?.name) {
      tempError.name = 'Name is required'
    } else if (newVet?.name.length > 10) {
      tempError.name = 'Name must  be less than 10'
    }
    if (!newVet?.specialization) {
      tempError.specialization = 'Specialization is required'
    }
    if (!newVet?.bio) {
      tempError.bio = 'Bio is required'
    }
    if (!newVet?.experience) {
      tempError.experience = 'Experience is required'
    }
    setError(tempError)
    return Object.keys(tempError).length === 0
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await uploadImage(formData)
        if (response) {
          const imageUrl = response?.data?.data.fileUrl
          setMediaUrl(imageUrl)
          setIsUploading(false)
        } else {
          toast.error('Failed to upload image')
        }
      } catch (error) {
        toast.error('Error uploading image')
      }
    }
  }

  const handleSlotChange = slot => {
    console.log('ss', slot)
    console.log('ss', selectedSlots)
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot)) // Deselect slot
    } else {
      setSelectedSlots([...selectedSlots, slot]) // Select slot
    }
  }

  const handleCreateVet = async e => {
    e.preventDefault()

    // Convert selected slots to 12-hour format
    const formattedSlots = selectedSlots.map(slot => formatTimeTo12Hour(slot))
    const formattedDates = selectedDates.map(date => date.toISOString())
    if (!validate()) {
      return
    }

    const vetData = {
      name: newVet.name,
      specialization: newVet.specialization,
      profilePicture: mediaUrl ? mediaUrl : newVet.profilePicture,
      bio: newVet.bio,
      slots: selectedSlots,
      experience: newVet.experience
      // availableDates: formattedDates
    }

    try {
      const response = await createVet(vetData)
      if (response.status === 201) {
        fetchVets()
        toast.success('Vet created successfully')
      }
    } catch (error) {
      toast.error('Failed to create vet')
    }

    setModalOpen(false)
    setNewVet({ name: '', specialization: '', profilePicture: '', bio: '', clinicId: [], experience: '' }) // Reset experience too
    setSelectedSlots([]) // Reset time slots
  }
  const handleDateChange = date => {
    setSelectedDates(prevDates => [...prevDates, date]) // Add the selected date to the array
  }

  const handleUpdateVet = async e => {
    e.preventDefault()

    const vetData = {
      name: newVet.name,
      specialization: newVet.specialization,
      profilePicture: newVet.profilePicture || mediaUrl,
      bio: newVet.bio,
      slots: selectedSlots,
      clinicId: newVet.clinicId,
      experience: newVet.experience
    }

    try {
      const response = await editVet(vetData, selectedVet.id)
      if (response.status === 200) {
        fetchVets()
        toast.success('Vet updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update vet')
    }

    setModalOpen(false)
    setIsEditing(false)
    setSelectedVet(null)
    setNewVet({ name: '', specialization: '', profilePicture: '', bio: '', clinicId: [], experience: '' })
    setSelectedSlots([])
  }

  const handleEditVet = vet => {
    console.log('vv', vet)
    setSelectedVet(vet)
    setNewVet({
      name: vet.name,
      specialization: vet.specialization,
      profilePicture: vet.profilePicture,
      bio: vet.bio,
      slots: vet.slots.join(',') || [],
      clinicId: vet.Clinic.map(clinic => clinic.id) || [],
      experience: vet.experience || ''
    })
    setSelectedSlots(vet.slots || [])
    setIsEditing(true)
    setModalOpen(true)
  }

  const handleDeleteVet = id => {
    setVetToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleCancel = () => {
    setModalOpen(false)
    setIsEditing(false)
    setSelectedVet(null)
    setNewVet({ name: '', specialization: '', profilePicture: '', bio: '', clinicId: [], experience: '' })
    setSelectedSlots([])
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setNewVet({ name: '', specialization: '', profilePicture: '', bio: '', clinicId: [], experience: '', slots: '' })
    setSelectedSlots([])
  }

  const confirmDeleteVet = async () => {
    try {
      const payload = {
        vetId: vetToDelete
      }
      const response = await deleteVet(payload)
      if (response.status === 200) {
        setVets(vets.filter(vet => vet.id !== vetToDelete))
        toast.success('Vet deleted successfully')
      } else {
        toast.error('Failed to delete vet')
      }
    } catch (error) {
      toast.error('Failed to delete vet')
    }
    setDeleteDialogOpen(false)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <div>
      <ToastContainer />
      <Box>
        <CardHeader
          avatar={<Person2 color='primary' fontSize='large' />} // Icon before title
          title='Vet managemnt'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'Create or Edit Vet Profile'}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant='contained' sx={{ backgroundColor: '#FFA500' }} onClick={() => setModalOpen(true)}>
          Add Vet
        </Button>
      </Box>

      {/* Modal for adding or editing vet */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            gap: '2'
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {isEditing ? 'Edit Vet Profile' : 'Add New Vet'}
          </h2>
          {/* {mediaUrl && (
            <Box display='flex' justifyContent='center' mb={2}>
              <img
                src={mediaUrl}
                alt='Profile Preview'
                width='150' // Increased size for better visibility
                height='150'
                style={{ borderRadius: '50%', objectFit: 'cover', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}
              />
            </Box>
          )} */}
          {/* Profile Picture Preview or Placeholder */}
          <Box display='flex' justifyContent='center' mb={2}>
            {mediaUrl || newVet.profilePicture ? (
              <img
                src={mediaUrl || newVet.profilePicture}
                alt='Profile Preview'
                width='150'
                height='150'
                style={{ borderRadius: '50%', objectFit: 'cover', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}
              />
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 0px 5px rgba(0,0,0,0.2)'
                }}
              >
                <PhotoCamera style={{ fontSize: 50, color: '#9e9e9e' }} />
              </Box>
            )}
          </Box>

          <form onSubmit={isEditing ? handleUpdateVet : handleCreateVet}>
            <TextField
              label='Name'
              name='name'
              value={newVet.name}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              required
              error={!!error.name}
              helperText={error.name}
              type='name'
            />
            <TextField
              label='Specialization'
              name='specialization'
              value={newVet.specialization}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              required
              error={!!error.specialization}
              helperText={error.specializations}
            />
            <TextField
              label='Experience (years)'
              name='experience'
              value={newVet.experience}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              required
              error={!!error.experience}
              helperText={error.experiences}
            />
            <TextField
              label='Bio'
              name='bio'
              value={newVet.bio}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              multiline
              rows={3}
              error={!!error.bio}
              helperText={error.bio}
            />
            {/* <div className=''>
              <DatePicker
                selected={null}
                onChange={handleDateChange}
                dateFormat='MMMM d, yyyy'
                placeholderText='Select Available Date'
                isClearable
                inline
                customInput={<TextField fullWidth />}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                {selectedDates?.map((date, index) => (
                  <Chip
                    key={index}
                    label={date.toLocaleDateString()}
                    onDelete={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                    color='primary'
                  />
                ))}
              </Box>
            </div> */}

            {/* Time slots selection */}
            <Box sx={{ marginBottom: 2 }}>
              <p>Select Available Time Slots:</p>
              {timeSlots.map(slot => (
                <Button
                  key={slot}
                  variant={selectedSlots.includes(slot) ? 'contained' : 'outlined'}
                  onClick={() => handleSlotChange(slot)}
                  sx={{ margin: '4px' }}
                >
                  {/* {formatTimeTo12Hour(slot)}
                   */}
                  {slot}
                </Button>
              ))}
            </Box>

            {/* Only show clinic select field in edit mode */}
            {isEditing && (
              <Select
                multiple
                value={newVet.clinicId}
                onChange={e => setNewVet(prev => ({ ...prev, clinicId: e.target.value }))}
                renderValue={selected =>
                  selected.map(id => hospitalLists.find(hospital => hospital.id === id)?.name).join(', ')
                }
                fullWidth
                margin='normal'
              >
                {hospitalLists?.map(hospital => (
                  <MenuItem key={hospital.id} value={hospital.id}>
                    <Checkbox checked={newVet.clinicId.indexOf(hospital.id) > -1} />
                    <ListItemText primary={hospital.name} />
                  </MenuItem>
                ))}
              </Select>
            )}

            <Button
              variant='contained'
              component='label'
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ mt: 2, mb: 2, backgroundColor: '#FFA500' }}
            >
              {isUploading ? 'Uploading Image...' : 'Upload Profile Picture'}
              <input type='file' hidden onChange={handleImageUpload} />
            </Button>

            <Button type='submit' variant='contained' sx={{ backgroundColor: '#FFA500' }} fullWidth>
              {isEditing ? 'Update Vet' : 'Create Vet'}
            </Button>
            <Button onClick={() => handleCancel()} variant='contained' color='secondary' fullWidth sx={{ mt: 2 }}>
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Table to show all vets */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile Picture</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Bio</TableCell>

              <TableCell>Assigned Clinic(s)</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vets.length > 0 ? (
              vets.map(vet => (
                <TableRow key={vet.id}>
                  <TableCell>
                    {vet.profilePicture ? (
                      <img src={vet.profilePicture} alt='Profile' width={50} height={50} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>{vet.name}</TableCell>
                  <TableCell>{vet.specialization}</TableCell>
                  <TableCell>{vet.bio}</TableCell>

                  <TableCell>
                    {vet.Clinic ? vet.Clinic.map(clinic => clinic.name).join(', ') : 'Not Assigned'}
                  </TableCell>
                  <TableCell>{vet.slots ? vet.slots.join(', ') : 'No Slots Selected'}</TableCell>
                  <TableCell>{vet.experience ? `${vet.experience} years` : 'N/A'}</TableCell>

                  <TableCell>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => handleEditVet(vet)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => handleDeleteVet(vet.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align='center'>
                  No vets available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={vets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Confirmation Dialog for Deleting Vet */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete this vet?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteVet} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default VetManagementPage
