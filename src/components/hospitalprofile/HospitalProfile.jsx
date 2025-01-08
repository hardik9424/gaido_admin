import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import {
  Typography,
  TextField,
  Button,
  Slider,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import {
  getAllVets,
  getAllHospital,
  deleteClinic,
  createHospital,
  editHospital,
  uploadImage,
  getAllMatches
} from '@/app/api'

import CustomDatePicker from '../../utils/DatePicker'

const HospitalProfileForm = ({ fetchHospital, fetchvets, vetsList, onSubmit, onClose, initialData = {} }) => {
  const [mediaUrls, setMediaUrls] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')

  const [hospitalData, setHospitalData] = useState({
    id: '',
    name: '',
    address: '',
    images: mediaUrls ? mediaUrls : '',
    coordinates: [],
    timing: '',
    rating: 3,
    fees: 0,
    vetIds: [],
    silverFees: '',
    goldFees: '',
    regularFees: '',

    ...initialData
  })

  useEffect(() => {
    if (initialData) {
      setHospitalData(prevData => ({
        ...prevData,
        ...initialData,
        images: initialData.images || []
      }))

      if (initialData.timing) {
        const [from, to] = initialData.timing.split(' - ')
        setFromTime(from || '')
        setToTime(to || '')
      }

      setMediaUrls(initialData.images || [])
    }
  }, [initialData])

  useEffect(() => {
    if (initialData?.Vets) {
      setHospitalData(prevData => ({
        ...prevData,
        vetIds: initialData.Vets.map(vet => vet.id)
      }))
    } else {
      // setHospitalData([])
    }
  }, [initialData])

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files)
    const imageUrls = []

    for (let file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await uploadImage(formData)
        if (response) {
          const imageUrl = response?.data?.data.fileUrl
          imageUrls.push(imageUrl)
        } else {
          toast.error('Failed to upload image')
        }
      } catch (error) {
        toast.error('Error uploading image')
      }
    }
    setMediaUrls(prevUrls => [...prevUrls, ...imageUrls])
  }

  const handleRemoveImage = index => {
    setMediaUrls(prevUrls => prevUrls.filter((_, i) => i !== index))
    if (index === currentImageIndex && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % mediaUrls.length)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + mediaUrls.length) % mediaUrls.length)
  }

  const handleInputChange = async e => {
    const { name, value } = e.target
    setHospitalData(prevData => ({ ...prevData, [name]: value }))

    if (name === 'address') {
      const coordinates = await fetchCoordinates(value)
      if (coordinates) {
        setHospitalData(prevData => ({ ...prevData, coordinates }))
      }
    }
  }

  const fetchCoordinates = async address => {
    try {
      const apiKey = 'AIzaSyC1jYctLwdiesL_sAaQh8QGTkXPi7-S03M'
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: apiKey
        }
      })
      const location = response?.data?.results[0]?.geometry?.location
      return [location?.lat, location?.lng]
    } catch (error) {
      toast.error('Error fetching coordinates')
      return null
    }
  }

  const handleVetSelection = event => {
    const { value } = event.target
    setHospitalData(prevData => ({
      ...prevData,
      vetIds: value
    }))
  }

  const handleCoordinatesChange = (index, value) => {
    const newCoordinates = [...hospitalData.coordinates]
    newCoordinates[index] = parseFloat(value)
    setHospitalData(prevData => ({ ...prevData, coordinates: newCoordinates }))
  }

  const handleSubmit = async () => {
    console.log('hd', hospitalData)
    if (!fromTime || !toTime) {
      toast.error('Please select both opening and closing times')
      return
    }

    try {
      const payload = {
        name: hospitalData.name?.trim(),
        // timing: hospitalData.timing ? String(hospitalData.timing) : '',
        timing: `${fromTime} - ${toTime}`,
        images: mediaUrls,
        coordinates: hospitalData.coordinates.length === 2 ? hospitalData.coordinates : [],
        address: hospitalData.address?.trim(),
        goldFees: hospitalData.goldFees !== '' ? hospitalData.goldFees : 0,
        silverFees: hospitalData.silverFees !== '' ? hospitalData.silverFees : 0,
        regularFees: hospitalData.regularFees !== '' ? hospitalData.regularFees : 0,
        fees: hospitalData.fees !== '' ? hospitalData.fees : 0,
        ...(initialData?.id && { vetIds: hospitalData.vetIds })
      }

      if (
        !payload.name ||
        !payload.timing ||
        !payload.images.length ||
        !payload.coordinates.length ||
        !payload.address ||
        isNaN(payload.fees) ||
        isNaN(payload.silverFees) ||
        isNaN(payload.goldFees) ||
        isNaN(payload.regularFees)
      ) {
        throw new Error('All required fields must be filled and valid')
      }

      if (initialData?.id) {
        const response = await editHospital(initialData.id, payload)
        if (response.status === 200) {
          // await getAllHospital()
          await fetchHospital
          // await getAllVets()
          toast.success('Hospital edited successfully', {
            autoClose: 9000
          })
        }
      } else {
        const response = await createHospital(payload)
        if (response.status === 200) {
          await fetchHospital
          // fetchvets()
          toast.success('Hospital created successfully',{
            autoClose: 9000,
          })
        }
      }

      onSubmit(hospitalData)
      onClose()
    } catch (error) {
      toast.error('Error saving hospital: ' + error.message)
    }
  }

  // const handleDateChange = newDate => {
  //   setTiming(newDate)
  //   setHospitalData(prevData => ({ ...prevData, timing: newDate }))
  // }

  // const handleTimeChange = (field, time) => {
  //   setHospitalData(prevData => ({
  //     ...prevData,
  //     [field]: time,
  //     timing: `${prevData.fromTime || ''} - ${prevData.toTime || ''}`
  //   }))
  // }
  const handleTimeChange = (field, time) => {
    console.log('tt', time)
    const timmings = {
      fromTime: time,
      toTime: time
    }
    setHospitalData(prevData => {
      const updatedData = { ...prevData, [field]: timmings }

      return updatedData
    })
  }

  return (
    <form>
      <ToastContainer />
      <TextField
        name='name'
        label='Hospital Name'
        value={hospitalData.name}
        fullWidth
        margin='normal'
        onChange={handleInputChange}
      />
      <TextField
        name='address'
        label='Address'
        fullWidth
        margin='normal'
        multiline
        rows={3}
        onChange={handleInputChange}
        value={hospitalData.address}
      />
      <Typography variant='h6' gutterBottom>
        Opening and Closing Times
      </Typography>
      <Box display='flex' flexDirection='column' gap={2} marginBottom={2}>
        <CustomDatePicker
          label='From Time'
          value={fromTime}
          onChange={time => setFromTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption='Time'
          dateFormat='h:mm aa'
        />

        <CustomDatePicker
          label='To Time'
          value={toTime}
          onChange={time => setToTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption='Time'
          dateFormat='h:mm aa'
        />
      </Box>
      <TextField
        type='number'
        name='fees'
        label='Consultation Fees'
        fullWidth
        margin='normal'
        onChange={handleInputChange}
        value={hospitalData.fees || ''}
      />
      <TextField
        type='number'
        name='silverFees'
        label='Silver Fees'
        fullWidth
        margin='normal'
        onChange={handleInputChange}
        value={hospitalData.silverFees || ''}
      />
      <TextField
        type='number'
        name='goldFees'
        label='Gold Fees'
        fullWidth
        margin='normal'
        onChange={handleInputChange}
        value={hospitalData.goldFees || ''}
      />
      <TextField
        type='regularFees'
        name='regularFees'
        label='Regular Fees'
        fullWidth
        margin='normal'
        onChange={handleInputChange}
        value={hospitalData.regularFees || ''}
      />

      <Box display='flex' gap={2} marginBottom={2}>
        <TextField
          type='number'
          name='latitude'
          label='Latitude'
          fullWidth
          margin='normal'
          value={hospitalData.coordinates[0] || ''}
          onChange={e => handleCoordinatesChange(0, e.target.value)}
        />
        <TextField
          type='number'
          name='longitude'
          label='Longitude'
          fullWidth
          margin='normal'
          value={hospitalData.coordinates[1] || ''}
          onChange={e => handleCoordinatesChange(1, e.target.value)}
        />
      </Box>

      {initialData.id && (
        <FormControl fullWidth margin='normal'>
          <InputLabel>Assign Vets</InputLabel>
          <Select
            multiple
            value={hospitalData.vetIds}
            onChange={handleVetSelection}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => (
                  <Chip key={value} label={vetsList.find(vet => vet.id === value)?.name || value} />
                ))}
              </Box>
            )}
          >
            {vetsList?.map(vet => (
              <MenuItem key={vet.id} value={vet.id}>
                <Checkbox checked={hospitalData.vetIds.indexOf(vet.id) > -1} />
                <ListItemText primary={vet.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={hospitalData.status}
            onChange={e => setHospitalData({ ...hospitalData, status: e.target.checked })}
          />
        }
        label='Status'
      />

      <Box display='flex' flexWrap='wrap' gap={2} marginTop={2} sx={{ overflow: 'auto', maxHeight: '150px' }}>
        {mediaUrls.map((url, index) => (
          <Box key={index} position='relative'>
            <img src={url} alt={`Uploaded ${index}`} width='100' />
            <IconButton
              onClick={() => handleRemoveImage(index)}
              sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {mediaUrls.length > 1 && (
        <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
          <IconButton onClick={handlePreviousImage}>
            <ArrowBackIosIcon />
          </IconButton>
          <img src={mediaUrls[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} width='300' />
          <IconButton onClick={handleNextImage}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant='contained' component='label' sx={{ marginTop: 2 }}>
          Upload Images
          <input type='file' multiple hidden onChange={handleImageUpload} />
        </Button>
        <Button variant='contained' color='primary' sx={{ marginTop: 2 }} onClick={handleSubmit}>
          Save Hospital
        </Button>
      </Box>
    </form>
  )
}

export default HospitalProfileForm
