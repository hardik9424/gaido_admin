'use client'

import { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CardHeader,
  IconButton,
  Modal,
  Box,
  Typography,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Icon,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog
} from '@mui/material'
import { Edit, Delete, Add, Image, Wallpaper, WallpaperTwoTone } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CountUp from 'react-countup'

import { getAllBanners, createBanner, uploadImage, editBanner, deleteBanner } from '@/app/api'

const BannerType = {
  Veterinary: 'veterinary',
  Shop: 'shop',
  Subscription: 'subscription'
}

const BannerPage = () => {
  const [allBanners, setAllBanners] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [newBannerData, setNewBannerData] = useState({ title: '', type: BannerType.Shop })
  const [mediaUrl, setMediaUrl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [userRole, setUserRole] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    type: '',
    image: ''
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

  const fetchAllBanners = async () => {
    try {
      const response = await getAllBanners()
      if (response.status === 200) {
        setAllBanners(response?.data?.data?.banners || [])
      }
    } catch (error) {
      console.log(error)
      setAllBanners([])
    }
  }

  useEffect(() => {
    fetchAllBanners()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const openEditModal = data => {
    setEditData(data)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditData(null)
  }

  // const handleSaveEdit = async () => {
  //   const errors = {}

  //   // Validate title
  //   if (!editData.title.trim()) {
  //     errors.title = 'Title is required'
  //   }

  //   // Validate type
  //   if (!editData.type) {
  //     errors.type = 'Type is required'
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors)
  //     return
  //   }
  //   try {
  //     const updatedBanner = {
  //       title: editData.title,
  //       type: editData.type,
  //       image: mediaUrl || editData.image
  //     }
  //     await editBanner(editData.id, updatedBanner)
  //     fetchAllBanners()
  //     closeEditModal()
  //     toast.success('Banner updated successfully')
  //   } catch (error) {
  //     console.error(error)
  //     toast.error('Failed to update banner')
  //   }
  // }
  const handleSaveEdit = async () => {
    const errors = {}

    // Validate title
    if (!editData.title.trim()) {
      errors.title = 'Title is required.'
    }

    // Validate type
    if (!editData.type) {
      errors.type = 'Type is required.'
    }

    // Validate image
    if (!mediaUrl && !editData.image) {
      errors.image = 'Image is required.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors) // Set errors if validation fails
      return
    }

    try {
      const updatedBanner = {
        title: editData.title,
        type: editData.type,
        image: mediaUrl || editData.image
      }
      await editBanner(editData.id, updatedBanner)
      fetchAllBanners()
      closeEditModal()
      toast.success('Banner updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update banner')
    }
  }

  const openAddModal = () => setAddModalOpen(true)
  const closeAddModal = () => {
    setAddModalOpen(false)
    setNewBannerData({ title: '', type: BannerType.HOME })
    setMediaUrl(null)
  }

  // const handleAddBanner = async () => {
  //   const errors = {}
  //   if (!newBannerData.title.trim()) {
  //     errors.title = 'Title is required'
  //   }

  //   // Validate type
  //   if (!newBannerData.type) {
  //     errors.type = 'Type is required'
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors)
  //     return
  //   }
  //   try {
  //     const newBanner = {
  //       title: newBannerData.title,
  //       type: newBannerData.type,
  //       image: mediaUrl
  //     }
  //     await createBanner(newBanner)
  //     fetchAllBanners()
  //     closeAddModal()
  //     toast.success('Banner added successfully')
  //   } catch (error) {
  //     console.error(error)
  //     toast.error('Failed to add banner')
  //   }
  // }
  const handleAddBanner = async () => {
    const errors = {}

    // Validate title
    if (!newBannerData.title.trim()) {
      errors.title = 'Title is required.'
    }

    // Validate type
    if (!newBannerData.type) {
      errors.type = 'Type is required.'
    }

    // Validate image
    if (!mediaUrl) {
      errors.image = 'Image is required.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors) // Set errors if validation fails
      return
    }

    try {
      const newBanner = {
        title: newBannerData.title,
        type: newBannerData.type,
        image: mediaUrl
      }
      await createBanner(newBanner)
      fetchAllBanners()
      closeAddModal()
      toast.success('Banner added successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add banner')
    }
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData)

      if (response.status === 200) {
        const imageUrl = response?.data?.data.fileUrl
        setMediaUrl(imageUrl)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error('Image upload failed')
    }
  }
  // Open confirmation dialog
  const openDeleteDialog = bannerId => {
    setBannerToDelete(bannerId)
    setDeleteDialogOpen(true)
  }

  // Close confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setBannerToDelete(null)
  }

  // Confirm and delete the banner
  const confirmDeleteBanner = async () => {
    try {
      const response = await deleteBanner(bannerToDelete)
      if (response.status === 200) {
        toast.success('Banner deleted successfully')
        fetchAllBanners()
      } else {
        toast.error('Error deleting banner')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete banner')
    } finally {
      closeDeleteDialog()
    }
  }

  const handleDelete = async bannerId => {
    const response = await deleteBanner(bannerId)
    console.log('delban', response)
    if (response.status === 200) {
      toast.success('Banner deleted')
      fetchAllBanners()
    } else {
      toast.error('Error deleting banner')
      fetchAllBanners()
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
    bgcolor: 'background.paper',
    borderRadius: 2,
    width: 500,
    boxShadow: 24,
    overflowY: 'auto'
  }

  return (
    <>
      <ToastContainer />
      <CardHeader
        avatar={<Wallpaper color='primary' fontSize='large' />}
        title='Banner Management'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Create or Edit Banner'}
      />
      <Box display='flex' justifyContent='flex-end' mb={2} mr={2}>
        <Button variant='contained' sx={{ backgroundColor: '#ffA500' }} startIcon={<Add />} onClick={openAddModal}>
          Add Banner
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBanners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(banner => (
              <TableRow
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
                key={banner.id}
              >
                <TableCell>
                  <img src={banner.image} alt={banner.title} style={{ width: '50px', height: '50px' }} />
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.type}</TableCell>
                <TableCell>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => openEditModal(banner)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => openDeleteDialog(banner.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={allBanners.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom align='center'>
            Edit Banner
          </Typography>
          <TextField
            fullWidth
            label='Title'
            value={editData?.title || ''}
            onChange={e => {
              setEditData({ ...editData, title: e.target.value })
              setValidationErrors(prev => ({ ...prev, title: '' })) // Clear error for title
            }}
            margin='normal'
            error={!!validationErrors.title} // Highlight field if error exists
            helperText={validationErrors.title} // Show error message
          />
          <FormControl fullWidth margin='normal' error={!!validationErrors.type}>
            <InputLabel>Type</InputLabel>
            <Select
              value={editData?.type || BannerType.Shop}
              onChange={e => {
                setEditData({ ...editData, type: e.target.value })
                setValidationErrors({ ...validationErrors, type: '' })
              }}
            >
              <MenuItem value={BannerType.Shop}>Shop</MenuItem>
              <MenuItem value={BannerType.Veterinary}>Veterinary</MenuItem>
              <MenuItem value={BannerType.Subscription}>Subscription</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2} mb={2}>
            <Typography variant='body1' gutterBottom>
              Upload Image
            </Typography>
            <Button
              variant='contained'
              component='label'
              color='primary'
              startIcon={<Image />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Choose File
              <input type='file' hidden onChange={handleImageUpload} />
            </Button>
            {mediaUrl && (
              <Box mt={2} display='flex' justifyContent='center'>
                <img
                  src={mediaUrl}
                  alt='Uploaded preview'
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mt={2}>
            <Button onClick={closeEditModal} color='secondary' variant='outlined'>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color='primary' variant='contained'>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Modal */}
      <Modal open={isAddModalOpen} onClose={closeAddModal}>
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom align='center'>
            Add Banner
          </Typography>
          <TextField
            fullWidth
            label='Title'
            value={newBannerData.title}
            // onChange={e => setNewBannerData({ ...newBannerData, title: e.target.value })}
            onChange={e => {
              const value = e.target.value
              if (isEditModalOpen) {
                setEditData({ ...editData, title: value })
              } else {
                setNewBannerData({ ...newBannerData, title: value })
              }
              setValidationErrors(prev => ({ ...prev, title: '' })) // Clear title error
            }}
            margin='normal'
            error={!!validationErrors.title} // Highlight field if error exists
            helperText={validationErrors.title} // Show error message
          />
          <FormControl fullWidth margin='normal' error={!!validationErrors.type}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newBannerData.type}
              // onChange={e => setNewBannerData({ ...newBannerData, type: e.target.value })}
              onChange={e => {
                const value = e.target.value
                if (isEditModalOpen) {
                  setEditData({ ...editData, type: value })
                } else {
                  setNewBannerData({ ...newBannerData, type: value })
                }
                setValidationErrors(prev => ({ ...prev, type: '' })) // Clear type error
              }}
            >
              <MenuItem value={BannerType.Shop}>Shop</MenuItem>
              <MenuItem value={BannerType.Veterinary}>Veterinary</MenuItem>
              <MenuItem value={BannerType.Subscription}>Subscription</MenuItem>
              <Typography variant='body2' color='error'>
                {validationErrors.type}
              </Typography>
            </Select>
          </FormControl>

          <Box mt={2} mb={2}>
            <Typography variant='body1' gutterBottom>
              Upload Image
            </Typography>
            <Button
              variant='contained'
              component='label'
              color='primary'
              startIcon={<Image />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Choose File
              {/* <input type='file' hidden onChange={handleImageUpload} /> */}
              <input
                type='file'
                hidden
                onChange={handleImageUpload}
                onClick={() => setValidationErrors(prev => ({ ...prev, image: '' }))} // Clear image error
              />
            </Button>
            <Typography variant='body2' color='error'>
              {validationErrors.image}
            </Typography>
            {mediaUrl && (
              <Box mt={2} display='flex' justifyContent='center'>
                <img
                  src={mediaUrl}
                  alt='Uploaded preview'
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mt={2}>
            <Button onClick={closeAddModal} color='secondary' variant='outlined'>
              Cancel
            </Button>
            <Button onClick={handleAddBanner} color='primary' variant='contained'>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this banner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteBanner} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BannerPage
