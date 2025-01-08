'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  FormControl,
  Modal,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  TablePagination,
  CardHeader
} from '@mui/material'

import { ImageAspectRatio } from '@mui/icons-material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditIcon from '@mui/icons-material/Edit'

import DeleteIcon from '@mui/icons-material/Delete'

import CountUp from 'react-countup'

import {
  getAllCoupons,
  createCoupon,
  uploadImage,
  getAllProducts,
  editCoupon,
  updateStatus,
  deleteCoupon
} from '@/app/api'

const CouponPage = () => {
  const [coupons, setCoupons] = useState([])
  const [errors, setErrors] = useState({}) // State to track field errors
  const [editingData, setEditingData] = useState()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [mediaUrls, setMediaUrls] = useState(null) // State for uploaded image URL
  const [couponDetails, setCouponDetails] = useState({
    code: '',
    name: '',
    couponApplicable: [],
    description: '',
    discountType: '',
    discountValue: '',
    maxDiscountAmount: '',

    minOrderValue: '',
    validFrom: null,
    validUntil: null,
    image: null
  })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(null)
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

  const validateFields = () => {
    const tempErrors = {}
    if (!couponDetails.code) tempErrors.code = 'Coupon code is required.'
    if (!couponDetails.name) tempErrors.name = 'Coupon name is required.'
    if (!couponDetails.discountType) tempErrors.discountType = 'Discount type is required.'
    if (!couponDetails.discountValue) tempErrors.discountValue = 'Discount value is required.'
    if (!couponDetails.validFrom) tempErrors.validFrom = 'Valid from date is required.'
    if (!couponDetails.validUntil) tempErrors.validUntil = 'Valid until date is required.'
    if (!couponDetails.description) tempErrors.description = 'Description is required.'
    if (!couponDetails.maxDiscountAmount) tempErrors.maxDiscountAmount = 'Maximum discount amount is required.'
    if (!couponDetails.minOrderValue) tempErrors.minOrderValue = 'Minimum order value is required.'
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const fetchAllCoupons = async () => {
    setLoading(true)
    try {
      const response = await getAllCoupons()
      setCoupons(response.data.data)
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCoupons()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleOpenDeleteDialog = id => {
    setSelectedCouponId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteOpen(false)
    setSelectedCouponId(null)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleConfirmDelete = async () => {
    try {
      await deleteCoupon(selectedCouponId)
      toast.success('Coupon deleted successfully')
      fetchAllCoupons()
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete coupon')
    } finally {
      handleCloseDeleteDialog()
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setCouponDetails({ ...couponDetails, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleCouponApplicableChange = event => {
    setCouponDetails({ ...couponDetails, couponApplicable: event.target.value })
  }

  const handleDateChange = (name, value) => {
    setCouponDetails({ ...couponDetails, [name]: value })
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await uploadImage(formData)

        if (response && response.data.data.fileUrl) {
          const uploadedUrl = response.data.data.fileUrl
          setMediaUrls(uploadedUrl) // Store uploaded URL in mediaUrls
          setCouponDetails({ ...couponDetails, image: uploadedUrl }) // Set image URL in coupon details
          toast.success('Image uploaded successfully')
        }
      } catch (error) {
        console.error('Image upload failed', error)
        toast.error('Failed to upload image')
      }
    }
  }

  const handleSaveCoupon = async () => {
    if (!validateFields()) return
    setLoading(true)
    try {
      const payload = {
        ...couponDetails,
        discountValue: parseFloat(couponDetails.discountValue),
        maxDiscountAmount: parseFloat(couponDetails.maxDiscountAmount),
        minOrderValue: parseFloat(couponDetails.minOrderValue),
        validFrom: couponDetails.validFrom,
        validUntil: couponDetails.validUntil
      }

      if (isEditing) {
        if (!couponDetails.id) {
          toast.error('Coupon ID is missing for editing.')
          return
        }
        const response = await editCoupon(couponDetails.id, payload) // Pass ID and payload
        toast.success('Coupon updated successfully')
      } else {
        await createCoupon(payload)
        toast.success('Coupon created successfully')
      }

      // Refresh the coupon list
      fetchAllCoupons()
      setModalOpen(false)
      setIsEditing(false)

      // Reset coupon details
      setCouponDetails({
        code: '',
        name: '',
        couponApplicable: [],
        description: '',
        discountType: '',
        discountValue: '',
        maxDiscountAmount: '',
        minOrderValue: '',
        validFrom: null,
        validUntil: null,
        image: null
      })
      setMediaUrls(null)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setIsEditing(false)
  }

  const handleEdit = coupon => {
    console.log('cou', coupon)
    setCouponDetails(coupon)
    setIsEditing(true)
    setModalOpen(true)
    setEditingData(coupon)
  }

  const handleDelete = async id => {
    try {
      await deleteCoupon(id)
      toast.success('Coupon deleted successfully')
      fetchAllCoupons()
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete coupon')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    console.log('pay', currentStatus)
    const payload = {
      isActive: currentStatus
    }
    console.log('pay', payload)
    try {
      setLoading(true)
      const response = await updateStatus(id, payload)
      console.log('cc', response)
      if (response.status === 200) {
        toast.success('Status Changed')
        fetchAllCoupons()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred while updating status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <ToastContainer />
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200
            // backgroundColor: 'rgba(255, 165, 0, 0.2)'
          }}
        />
      )}
      <CardHeader
        avatar={<ImageAspectRatio color='primary' fontSize='large' />} // Icon before title
        title='Coupons Management'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Add or Edit Coupons'}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenModal}
          sx={{ mb: 2, backgroundColor: '#ffA500' }}
        >
          Create Coupon
        </Button>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby='create-coupon'
        aria-describedby='coupon-details-form'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            borderRadius: 1
          }}
        >
          <Typography variant='h5' gutterBottom>
            {isEditing ? 'Edit Coupon' : 'Create Coupon'}
          </Typography>
          <Box display='flex' flexDirection='column' alignItems='center' mb={4}>
            {mediaUrls && <Avatar src={mediaUrls} sx={{ width: 120, height: 120, border: '2px solid #ddd', mb: 2 }} />}
            <input
              accept='image/*'
              type='file'
              style={{ display: 'none' }}
              id='upload-image'
              onChange={handleImageUpload}
            />
            <label htmlFor='upload-image'>
              <Button variant='contained' component='span' sx={{ backgroundColor: '#ffA500' }}>
                Upload Image
              </Button>
            </label>
          </Box>

          <Box display='grid' gridTemplateColumns='repeat(2, 1fr)' gap={2}>
            <TextField
              name='code'
              label='Coupon Code'
              fullWidth
              value={couponDetails.code}
              onChange={handleInputChange}
              error={!!errors.code}
              helperText={errors.code}
            />
            <TextField
              name='name'
              label='Coupon Name'
              fullWidth
              value={couponDetails.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <FormControl fullWidth error={!!errors.discountType}>
              <InputLabel>Coupon Applicable</InputLabel>
              <Select
                multiple
                name='couponApplicable'
                value={couponDetails.couponApplicable}
                onChange={handleCouponApplicableChange}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value='shop'>Shop</MenuItem>
                <MenuItem value='vet'>Vet</MenuItem>
                <MenuItem value='subscription'>Subscription</MenuItem>
              </Select>
              <Typography variant='body2' color='error'>
                {errors.discountType}
              </Typography>
            </FormControl>

            <TextField
              name='description'
              label='Description'
              fullWidth
              multiline
              value={couponDetails.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                name='discountType'
                value={couponDetails.discountType}
                onChange={handleInputChange}
                label='Discount Type'
              >
                <MenuItem value='percentage'>Percentage</MenuItem>
                <MenuItem value='fixed'>Fixed Amount</MenuItem>
              </Select>
              <Typography variant='body2' color='error'>
                {errors.discountType}
              </Typography>
            </FormControl>

            <TextField
              name='discountValue'
              label='Discount Value'
              fullWidth
              type='number'
              value={couponDetails.discountValue}
              onChange={handleInputChange}
              error={!!errors.discountValue}
              helperText={errors.discountValue}
            />
            <TextField
              name='maxDiscountAmount'
              label='Maximum Discount Amount'
              fullWidth
              type='number'
              value={couponDetails.maxDiscountAmount}
              onChange={handleInputChange}
              error={!!errors.maxDiscountAmount}
              helperText={errors.maxDiscountAmount}
            />

            <TextField
              name='minOrderValue'
              label='Minimum Order Value'
              fullWidth
              type='number'
              value={couponDetails.minOrderValue}
              onChange={handleInputChange}
              error={!!errors.minOrderValue}
              helperText={errors.minOrderValue}
            />

            <DatePicker
              selected={couponDetails.validFrom}
              onChange={date => handleDateChange('validFrom', date)}
              dateFormat='MMMM d, yyyy'
              placeholderText='Select Start Date'
              // customInput={<TextField fullWidth />}
              customInput={<TextField fullWidth error={!!errors.validFrom} />}
            />
            <DatePicker
              selected={couponDetails.validUntil}
              onChange={date => handleDateChange('validUntil', date)}
              dateFormat='MMMM d, yyyy'
              placeholderText='Select End Date'
              // customInput={<TextField fullWidth />}
              customInput={<TextField fullWidth error={!!errors.validUntil} />}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseModal} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon} variant='contained' color='primary'>
              Save Coupon
            </Button>
          </Box>
        </Box>
      </Modal>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>

              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Coupons Applicable</TableCell>
              {/* <TableCell>Type</TableCell> */}
              <TableCell>Discount Type</TableCell>
              <TableCell>Discount Value</TableCell>
              <TableCell>Max Discount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coupon, index) => (
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
                key={index}
              >
                <TableCell>
                  <Avatar src={coupon.image} sx={{ width: 50, height: 50 }} />
                </TableCell>

                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.couponApplicable}</TableCell>
                {/* <TableCell>{coupon.type}</TableCell> */}
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>{<CountUp start={0} end={coupon.discountValue} />}</TableCell>
                <TableCell>{<CountUp start={0} end={coupon.maxDiscountAmount} />}</TableCell>
                <TableCell>
                  <Button
                    variant='contained'
                    size='small'
                    color={coupon.isActive ? 'success' : 'error'}
                    onClick={() => handleToggleStatus(coupon.id, !coupon.isActive)}
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleEdit(coupon)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleOpenDeleteDialog(coupon.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={coupons.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby='confirm-delete'
        aria-describedby='confirm-delete-dialog'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Confirm Delete
          </Typography>
          <Typography variant='body2' gutterBottom>
            Are you sure you want to delete this coupon?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
            <Button onClick={handleCloseDeleteDialog} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant='contained' color='error'>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default CouponPage
