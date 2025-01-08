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
import { Edit, Delete, Add, Image, Wallpaper, WallpaperTwoTone, BrandingWatermark } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CountUp from 'react-countup'

import {
  getAllBanners,
  createBanner,
  uploadImage,
  editBanner,
  deleteBanner,
  getAllBrands,
  deleteBrand,
  addBrand,
  updateBrand
} from '@/app/api'

const BannerType = {
  HOME: 'home',
  SHOP: 'shop'
}

const BrandPage = () => {
  const [allBanners, setAllBanners] = useState([])
  const [brands, setBrands] = useState([])
  const [brandId, setBrandId] = useState('')
  const [brandData, setBrandData] = useState({ ranking: '', name: '' })
  const [previousRanking, setPreviousRanking] = useState()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [newBannerData, setNewBannerData] = useState({ title: '', type: BannerType.HOME })
  const [mediaUrl, setMediaUrl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    type: '',
    image: ''
  })
  const [userRole, setUserRole] = useState('')

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
  const fetchALlBrands = async () => {
    try {
      const response = await getAllBrands()
      if (response.status === 200) {
        setBrands(response?.data?.data)
      }
    } catch (error) {
      setBrands([])
    }
  }

  useEffect(() => {
    // fetchAllBanners()
    fetchALlBrands()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const openEditModal = data => {
    console.log(data)
    setEditData(data)
    setPreviousRanking(data?.ranking)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditData(null)
  }

  const handleSaveEdit = async () => {
    const errors = {}

    // Validate title
    if (!editData.ranking) {
      errors.title = 'Ranking is required.'
    }

    // Validate type
    if (!editData.name) {
      errors.type = 'Name is required.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const updatedBrand = {
        ranking: editData.ranking,
        name: editData.name,
        previousRanking: previousRanking
      }
      console.log('brandata', updatedBrand)
      await updateBrand(editData?.id, updatedBrand)
      fetchALlBrands()
      closeEditModal()
      toast.success('Brand updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update brand')
    }
  }

  const openAddModal = () => setAddModalOpen(true)
  const closeAddModal = () => {
    setAddModalOpen(false)
    setNewBannerData({ title: '', type: BannerType.HOME })
    setMediaUrl(null)
  }

  const handleAddBanner = async () => {
    const errors = {}

    // Validate title
    if (!brandData.ranking.trim()) {
      errors.title = 'Ranking is required.'
    }

    // Validate type
    if (!brandData.name) {
      errors.type = 'Name is required.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors) // Set errors if validation fails
      return
    }

    try {
      const newBrand = {
        ranking: Number(brandData.ranking),
        name: brandData.name
      }
      const response = await addBrand(newBrand)
      if (response.status === 200) {
        fetchALlBrands()
        closeAddModal()
        toast.success('Brand added successfully')
      } else {
        closeAddModal()
        toast.success('Failed to add brand')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to Add Brand')
    }
  }

  // Open confirmation dialog
  const openDeleteDialog = brandid => {
    setBrandId(brandid)
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
      const response = await deleteBrand(brandId)
      if (response.status === 200) {
        toast.success('Brand deleted successfully')
        fetchALlBrands()
      } else {
        toast.error('Error deleting Brand')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete Brand')
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
        avatar={<BrandingWatermark color='primary' fontSize='large' />}
        title='Products Brand Management'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Create or Edit Brands'}
      />
      <Box display='flex' justifyContent='flex-end' mb={2} mr={2}>
        <Button variant='contained' sx={{ backgroundColor: '#ffA500' }} startIcon={<Add />} onClick={openAddModal}>
          Add Brand
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ranking</TableCell>
              <TableCell>Name</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(brand => (
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
                key={brand.id}
              >
                <TableCell>{brand.ranking}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditModal(brand)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => openDeleteDialog(brand.id)}
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
            Edit Brand
          </Typography>
          <TextField
            fullWidth
            type='number'
            label='Ranking'
            value={editData?.ranking || ''}
            onChange={e => {
              setEditData({ ...editData, ranking: e.target.value })
              setValidationErrors(prev => ({ ...prev, ranking: '' }))
            }}
            margin='normal'
            error={!!validationErrors.ranking}
            helperText={validationErrors.ranking}
          />

          <TextField
            fullWidth
            type='text'
            label='Name'
            value={editData?.name || ''}
            onChange={e => {
              setEditData({ ...editData, name: e.target.value })
              setValidationErrors(prev => ({ ...prev, name: '' }))
            }}
            margin='normal'
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />

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
            Add Brand
          </Typography>
          <TextField
            fullWidth
            type='number'
            label='Ranking'
            value={brandData.ranking}
            onChange={e => {
              const value = e.target.value
              if (isEditModalOpen) {
                setEditData({ ...editData, ranking: value })
              } else {
                setBrandData({ ...brandData, ranking: value })
              }
              setValidationErrors(prev => ({ ...prev, ranking: '' }))
            }}
            margin='normal'
            error={!!validationErrors.ranking}
            helperText={validationErrors.ranking}
          />
          <TextField
            fullWidth
            type='text'
            label='Name'
            value={brandData.name}
            onChange={e => {
              const value = e.target.value
              if (isEditModalOpen) {
                setEditData({ ...editData, name: value })
              } else {
                setBrandData({ ...brandData, name: value })
              }
              setValidationErrors(prev => ({ ...prev, name: '' }))
            }}
            margin='normal'
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />

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

export default BrandPage
