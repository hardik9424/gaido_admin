'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Modal,
  TextField,
  Avatar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  CardHeader
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

import { ToastContainer, toast } from 'react-toastify'


import { CollectionsBookmark } from '@mui/icons-material'

import 'react-toastify/dist/ReactToastify.css'
import { createPackage, getAllPackages, uploadImage, updatePackage, deletePackage } from '@/app/api'

const FullWidthCouponTable = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [currentPackage, setCurrentPackage] = useState({
    id: null,
    name: '',
    price: '',
    regularPrice: '',
    goldPrice: '',
    silverPrice: '',
    benefits: '',
    images: []
  })
  const [isEditing, setIsEditing] = useState(false)
  const [allPackages, setAllPackages] = useState([])
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packageIdToDelete, setPackageIdToDelete] = useState(null)
  const fetchAllPackages = async () => {
    try {
      const response = await getAllPackages()
      if (response.status === 200) {
        setAllPackages(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setAllPackages([])
    }
  }

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])

  useEffect(() => {
    fetchAllPackages()
  }, [])
  const handleDeleteClinic = id => {
    // setClinicToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleOpenModal = (pkg = null) => {
    setCurrentPackage(
      pkg
        ? {
            ...pkg,
            benefits: pkg.benefits.join(', ')
          }
        : { id: null, name: '', price: '', regularPrice: '', goldPrice: '', silverPrice: '', benefits: '', images: [] }
    )
    setMediaUrl(pkg ? pkg.images[0] : null)
    setIsEditing(!!pkg)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setCurrentPackage({
      id: null,
      name: '',
      price: '',
      regularPrice: '',
      goldPrice: '',
      silverPrice: '',
      benefits: '',
      images: []
    })
    setMediaUrl(null)
  }

  // const handleSavePackage = async () => {
  //   const payload = {
  //     name: currentPackage.name,
  //     price: parseFloat(currentPackage.price),
  //     goldPrice: parseFloat(currentPackage.goldPrice),
  //     silverPrice: parseFloat(currentPackage.silverPrice),
  //     benefits: currentPackage.benefits.split(',').map(b => b.trim()),
  //     images: mediaUrl ? [mediaUrl] : []
  //   }

  //   try {
  //     if (isEditing) {
  //       await updatePackage(currentPackage.id, payload)
  //       toast.success('Package updated successfully')
  //     } else {
  //       await createPackage(payload)
  //       toast.success('Package created successfully')
  //     }
  //     fetchAllPackages()
  //   } catch (error) {
  //     toast.error('Failed to save package')
  //     console.error('Error:', error)
  //   }

  //   handleCloseModal()
  // }
  const handleSavePackage = async () => {
    // Validation
    if (!currentPackage.name.trim()) {
      toast.error('Package name is required')
      return
    }
    if (!currentPackage.price || isNaN(currentPackage.price) || currentPackage.price <= 0) {
      toast.error('Valid price is required')
      return
    }
    if (!currentPackage.goldPrice || isNaN(currentPackage.goldPrice) || currentPackage.goldPrice <= 0) {
      toast.error('Valid gold price is required')
      return
    }
    if (!currentPackage.silverPrice || isNaN(currentPackage.silverPrice) || currentPackage.silverPrice <= 0) {
      toast.error('Valid silver price is required')
      return
    }
    if (!currentPackage.benefits.trim()) {
      toast.error('At least one benefit is required')
      return
    }

    // Prepare payload
    const payload = {
      name: currentPackage.name.trim(),
      price: parseFloat(currentPackage.price),
      regularPrice: parseFloat(currentPackage.regularPrice),
      goldPrice: parseFloat(currentPackage.goldPrice),
      silverPrice: parseFloat(currentPackage.silverPrice),
      benefits: currentPackage.benefits
        .split(',')
        .map(b => b.trim())
        .filter(b => b),
      images: mediaUrl ? [mediaUrl] : []
    }

    try {
      if (isEditing) {
        await updatePackage(currentPackage.id, payload)
        toast.success('Package updated successfully')
      } else {
        await createPackage(payload)
        toast.success('Package created successfully')
      }
      fetchAllPackages()
    } catch (error) {
      toast.error('Failed to save package')
      console.error('Error:', error)
    }

    handleCloseModal()
  }

  const handleDeletePackage = pkg => {
    console.log('pkid', pkg)
    setPackageIdToDelete(pkg)
    setDeleteDialogOpen(true)
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await uploadImage(formData)
        if (response?.data?.data.fileUrl) {
          setMediaUrl(response.data.data.fileUrl)
          toast.success('Image uploaded successfully')
        }
      } catch (error) {
        toast.error('Failed to upload image')
        console.error('Image upload error:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }
  const confirmDeleteVet = async () => {
    try {
      const payload = {
        id: packageIdToDelete
      }
      const response = await deletePackage(packageIdToDelete)
      if (response.status === 200) {
        // getAllHospital()
        fetchAllPackages()
        toast.success('Clinic deleted successfully')
      } else {
        toast.error('Failed to delete Clinic')
      }
    } catch (error) {
      toast.error('Failed to delete Clinic')
    }
    setDeleteDialogOpen(false)
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <ToastContainer />
      <CardHeader
        avatar={<CollectionsBookmark color='primary' fontSize='large' />} // Icon before title
        title='Packages'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Create or Edit Packages'}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        {' '}
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ mb: 2, backgroundColor: '#FFA500' }}
        >
          Add Package
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}> Regular Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gold Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Silver Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Benefits</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allPackages?.length > 0 ? (
              allPackages.map((pkg, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: '#E0E0E0,',
                    '&:hover': {
                      backgroundColor: '#E0E0E0', // Hover effect
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
                      cursor: 'pointer',
                      '& td': {
                        transform: 'scale(0.95)', // Zoom-out effect
                        transition: 'transform 0.3s ease'
                      }
                    }
                  }}
                >
                  <TableCell>
                    <Avatar src={pkg.images[0]} alt={pkg.name} sx={{ width: 60, height: 60 }} />
                  </TableCell>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.price}</TableCell>
                  <TableCell>{pkg.regularPrice}</TableCell>
                  <TableCell>{pkg.goldPrice}</TableCell>
                  <TableCell>{pkg.silverPrice}</TableCell>
                  <TableCell>
                    <ul style={{ paddingLeft: 20, listStyleType: 'disc', margin: 0 }}>
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      color='primary'
                      onClick={() => handleOpenModal(pkg)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      color='secondary'
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  No packages available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding/Editing Package */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            maxHeight: '80vh',

            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}
        >
          <Typography variant='h6' gutterBottom>
            {isEditing ? 'Edit Package' : 'Add New Package'}
          </Typography>

          {/* Image Preview and Upload Button */}
          <Box display='flex' flexDirection='column' alignItems='center' mb={2}>
            {mediaUrl ? (
              <Avatar src={mediaUrl} sx={{ width: 80, height: 80, mb: 2 }} />
            ) : (
              <Avatar sx={{ width: 80, height: 80, mb: 2, backgroundColor: '#e0e0e0' }}>
                <PhotoCamera />
              </Avatar>
            )}
            <Button
              variant='contained'
              component='label'
              sx={{ mt: 1, backgroundColor: '#FFA500' }}
              startIcon={<PhotoCamera />}
              disabled={isUploading}
            >
              {isUploading ? <CircularProgress size={24} color='inherit' /> : 'Upload Image'}
              <input type='file' hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          <TextField
            label='Name'
            fullWidth
            margin='normal'
            value={currentPackage.name}
            onChange={e => setCurrentPackage({ ...currentPackage, name: e.target.value })}
          />
          <TextField
            label='Price'
            fullWidth
            margin='normal'
            // type='number'
            value={currentPackage.price}
            onChange={e => setCurrentPackage({ ...currentPackage, price: e.target.value })}
          />
          <TextField
            label='Regular Price'
            fullWidth
            margin='normal'
            // type='number'
            value={currentPackage.regularPrice}
            onChange={e => setCurrentPackage({ ...currentPackage, regularPrice: e.target.value })}
          />
          <TextField
            label='Gold Price'
            fullWidth
            margin='normal'
            // type='number'
            value={currentPackage.goldPrice}
            onChange={e => setCurrentPackage({ ...currentPackage, goldPrice: e.target.value })}
          />
          <TextField
            label='Silver Price'
            fullWidth
            margin='normal'
            // type='number'
            value={currentPackage.silverPrice}
            onChange={e => setCurrentPackage({ ...currentPackage, silverPrice: e.target.value })}
          />
          <TextField
            label='Benefits (comma-separated)'
            fullWidth
            margin='normal'
            value={currentPackage.benefits}
            onChange={e => setCurrentPackage({ ...currentPackage, benefits: e.target.value })}
            placeholder='Enter benefits separated by commas'
          />

          <Button onClick={handleSavePackage} variant='contained' fullWidth sx={{ mt: 3, backgroundColor: '#FFA500' }}>
            {isEditing ? 'Update Package' : 'Create Package'}
          </Button>
          <Button onClick={handleCloseModal} variant='outlined' fullWidth sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this clinic?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteVet} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FullWidthCouponTable
