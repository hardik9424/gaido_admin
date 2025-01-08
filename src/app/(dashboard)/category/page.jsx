'use client'

import { useState, useEffect, useMemo } from 'react'

import {
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TablePagination,
  IconButton,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  FormControlLabel,
  CardHeader,
  LinearProgress
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import CountUp from 'react-countup'

import { Money } from '@mui/icons-material'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import EditIcon from '@mui/icons-material/Edit'

import 'react-toastify/dist/ReactToastify.css'
import tableStyles from '@core/styles/table.module.css'
import { createMenbershipPlan, getAllPlans, editPlan } from '@/app/api'

const MembershipPlanTable = () => {
  const columnHelper = createColumnHelper()
  const [open, setOpen] = useState(false)
  const [membershipPlans, setMembershipPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newPlan, setNewPlan] = useState({
    planName: '',
    duration: '',
    price: '',
    discountedPrice: '',
    benefits: '',
    description: '',
    welcomeKit: false,
    birthdayCake: false,
    shopDiscountPercentage: '',
    deliveryDiscountPercentage: '',
    vetDiscountPercentage: '',
    dailyProfileViews: '',
    pawFives: ''
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      // setUserRole(parsedData.role)
      setUserRole(parsedData.role.trim().toLowerCase())
    } else {
      setUserRole('')
    }
  }, [])

  useEffect(() => {
    console.log('role', userRole)
  }, [userRole])

  const fetchAllPlans = async () => {
    setLoading(true)
    try {
      const response = await getAllPlans()
      if (response?.data) {
        setMembershipPlans(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch subscription plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPlans()
  }, [])

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setNewPlan({
      planName: '',
      duration: '',
      price: '',
      discountedPrice: '',
      benefits: '',
      description: '',
      welcomeKit: false,
      birthdayCake: false,
      shopDiscountPercentage: '',
      deliveryDiscountPercentage: '',
      vetDiscountPercentage: '',
      dailyProfileViews: '',
      pawFives: ''
    })
  }

  const handleFormChange = event => {
    const { name, value, type, checked } = event.target
    setNewPlan(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditOpen = plan => {
    setNewPlan({
      id: plan.id,
      planName: plan.name,
      duration: plan.durationInMonths.toString(),
      price: plan.price.toString(),
      discountedPrice: plan.crossedPrice?.toString() || '',
      benefits: plan.benefits.join(', '), // Display as a comma-separated string
      description: plan.description || '',
      welcomeKit: plan.welcomeKit || false,
      birthdayCake: plan.birthdayCake || false,
      shopDiscountPercentage: plan.shopDiscountPercentage?.toString() || '',
      deliveryDiscountPercentage: plan.deliveryDiscountPercentage?.toString() || '',
      vetDiscountPercentage: plan.vetDiscountPercentage?.toString() || '',
      dailyProfileViews: plan.dailyProfileViews?.toString() || '',
      pawFives: plan.pawFives?.toString() || ''
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const planData = {
      id: newPlan.id,
      name: newPlan.planName,
      durationInMonths: parseInt(newPlan.duration, 10),
      price: parseFloat(newPlan.price),
      crossedPrice: newPlan.discountedPrice ? parseFloat(newPlan.discountedPrice) : null,
      description: newPlan.description,
      benefits: newPlan.benefits.split(',').map(benefit => benefit.trim()), // Convert benefits string to array
      welcomeKit: newPlan.welcomeKit,
      birthdayCake: newPlan.birthdayCake,
      shopDiscountPercentage: parseFloat(newPlan.shopDiscountPercentage) || 0.0,
      deliveryDiscountPercentage: parseFloat(newPlan.deliveryDiscountPercentage) || 0.0,
      vetDiscountPercentage: parseFloat(newPlan.vetDiscountPercentage) || 0.0,
      dailyProfileViews: parseInt(newPlan.dailyProfileViews, 10) || 0,
      pawFives: parseInt(newPlan.pawFives, 10) || 0
    }
    setLoading(true)

    try {
      if (newPlan.id) {
        await editPlan(planData)
        toast.success('Membership plan updated successfully!')
      } else {
        await createMenbershipPlan(planData)
        toast.success('New membership plan added successfully!')
      }
      fetchAllPlans()
      handleClose()
    } catch (error) {
      toast.error('Failed to save membership plan')
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Plan Name' }),
      columnHelper.accessor('durationInMonths', {
        header: 'Duration (Months)',
        cell: ({ row }) => <CountUp start={0} end={row.original.durationInMonths} />
      }),
      // columnHelper.accessor('price', { header: 'Price' }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => (
          <CountUp
            start={0} // Start from 0
            end={row.original.price} // Target price value
            decimals={2} // Number of decimal places
            prefix='Rs' // Prefix (e.g., currency)
          />
        )
      }),
      columnHelper.accessor('crossedPrice', {
        header: 'Discounted Price',
        cell: ({ row }) => <CountUp start={0} end={row.original.crossedPrice} decimals={2} prefix='Rs' />
      }),
      columnHelper.accessor('benefits', {
        header: 'Benefits',
        cell: ({ row }) => (
          <Typography
            sx={{
              overflow: 'hidden',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: '200px'
            }}
          >
            {row.original.benefits.join(', ')}
          </Typography>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <IconButton
            disabled={userRole !== 'superadmin' && userRole !== 'admin'}
            onClick={() => handleEditOpen(row.original)}
          >
            <EditIcon />
            {/* {JSON.stringify(userRole == 'superadmin')} */}
          </IconButton>
        )
      })
    ],
    [userRole]
  )

  const table = useReactTable({
    data: membershipPlans,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(255, 165, 0, 0.2)'
          }}
        />
      )}

      <ToastContainer />
      <CardHeader
        avatar={<Money color='primary' fontSize='large' />} // Icon before title
        title='Membership'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Edit Membership Plan'}
      />

      {loading ? (
        ''
      ) : (
        <TableContainer component={Paper}>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
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
                  key={row.id}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            count={membershipPlans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => setRowsPerPage(+e.target.value)}
          />
        </TableContainer>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newPlan.id ? 'Edit Membership Plan' : 'Add New Membership Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Plan Name'
            fullWidth
            name='planName'
            value={newPlan.planName}
            onChange={handleFormChange}
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel>Duration</InputLabel>
            <Select name='duration' value={newPlan.duration} onChange={handleFormChange}>
              <MenuItem value='1'>1 Month</MenuItem>
              <MenuItem value='12'>1 Year</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin='dense'
            label='Price'
            fullWidth
            name='price'
            value={newPlan.price}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Discounted Price'
            fullWidth
            name='discountedPrice'
            value={newPlan.discountedPrice}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Description'
            fullWidth
            name='description'
            value={newPlan.description}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Benefits'
            fullWidth
            name='benefits'
            value={newPlan.benefits}
            onChange={handleFormChange}
          />
          {/* Additional fields for editing and adding new plans */}
          <TextField
            margin='dense'
            label='Shop Discount %'
            fullWidth
            name='shopDiscountPercentage'
            value={newPlan.shopDiscountPercentage}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Delivery Discount %'
            fullWidth
            name='deliveryDiscountPercentage'
            value={newPlan.deliveryDiscountPercentage}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Vet Discount %'
            fullWidth
            name='vetDiscountPercentage'
            value={newPlan.vetDiscountPercentage}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Daily Profile Views'
            fullWidth
            name='dailyProfileViews'
            value={newPlan.dailyProfileViews}
            onChange={handleFormChange}
          />
          <TextField
            margin='dense'
            label='Paw Fives'
            fullWidth
            name='pawFives'
            value={newPlan.pawFives}
            onChange={handleFormChange}
          />
          <FormControl fullWidth margin='dense'>
            <FormControlLabel
              control={<Checkbox checked={newPlan.welcomeKit} onChange={handleFormChange} name='welcomeKit' />}
              label='Include Welcome Kit'
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <FormControlLabel
              control={<Checkbox checked={newPlan.birthdayCake} onChange={handleFormChange} name='birthdayCake' />}
              label='Include Birthday Cake'
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: 'orange', color: 'white' }} disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MembershipPlanTable
