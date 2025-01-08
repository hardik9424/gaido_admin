'use client'
import React, { useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  LinearProgress,
  TablePagination,
  Typography,
  Box,
  Modal
} from '@mui/material'
import { Add, Edit, Delete, Pets } from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { createTemperament, getAllTemperament, updateTemperament, removeTemperament } from '@/app/api'

const TemperamentPage = () => {
  const [temperaments, setTemperaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTemperament, setCurrentTemperament] = useState(null)
  const [newTemperament, setNewTemperament] = useState('')
  const [type, setType] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [validationErrors, setValidationErrors] = useState({ name: '', type: '' })
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [selectedTemperamentId, setSelectedTemperamentId] = useState(null)
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

  const fetchTemperaments = async () => {
    setLoading(true)
    try {
      const response = await getAllTemperament()
      setTemperaments(response.data.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load temperaments')
    } finally {
      setLoading(false)
    }
  }
  const handleOpenDeleteDialog = id => {
    setSelectedTemperamentId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteOpen(false)
    setSelectedTemperamentId(null)
  }

  const handleConfirmDelete = async () => {
    try {
      console.log('deleting', selectedTemperamentId)
      const response = await removeTemperament(selectedTemperamentId)
      if (response.status === 200) {
        toast.success('Temperament deleted successfully')
        fetchTemperaments()
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete temperament')
    } finally {
      handleCloseDeleteDialog()
    }
  }

  useEffect(() => {
    fetchTemperaments()
  }, [])

  const saveTemperament = async () => {
    const errors = {}

    // Validate Name
    if (!newTemperament.trim()) {
      errors.name = 'Temperament Name is required'
    }

    // Validate Type
    if (!type.trim()) {
      errors.type = 'Type is required'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setLoading(true)
    try {
      if (currentTemperament) {
        await updateTemperament(currentTemperament.id, { name: newTemperament, type })
        toast.success('Temperament updated successfully')
      } else {
        await createTemperament({ name: newTemperament, type })
        toast.success('Temperament added successfully')
      }
      setIsModalOpen(false)
      fetchTemperaments()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save temperament')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (temperament = null) => {
    setCurrentTemperament(temperament)
    setNewTemperament(temperament ? temperament.name : '')
    setType(temperament ? temperament.type : '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTemperament(null)
    setNewTemperament('')
    setType('')
    setValidationErrors({ name: '', type: '' })
  }

  // const deleteTemperament = async id => {
  //   setLoading(true)
  //   try {
  //     // await removeTemperament(id)
  //     toast.success('Temperament deleted successfully')
  //     fetchTemperaments()
  //   } catch (error) {
  //     console.error(error)
  //     toast.error('Failed to delete temperament')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <Card>
        <ToastContainer />
        {loading && <LinearProgress />}
        <CardHeader
          avatar={<Pets color='primary' />}
          title='Pets Temperament'
          titleTypographyProps={{
            variant: 'h5',
            color: 'textPrimary',
            fontWeight: 'bold'
          }}
          action={
            <Button
              variant='contained'
              sx={{ backgroundColor: '#ffA500' }}
              startIcon={<Add />}
              onClick={() => openModal()}
            >
              Add Temperament
            </Button>
          }
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temperaments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell align='right'>
                    <Tooltip title='Edit'>
                      <IconButton
                        disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                        onClick={() => openModal(item)}
                      >
                        <Edit color='' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton
                        disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                        onClick={() => handleOpenDeleteDialog(item.id)}
                      >
                        <Delete color='' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={temperaments.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={event => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </TableContainer>
        <Dialog open={isModalOpen} onClose={closeModal}>
          <DialogTitle>{currentTemperament ? 'Edit Temperament' : 'Add Temperament'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label='Temperament Name'
              value={newTemperament}
              onChange={e => {
                setNewTemperament(e.target.value)
                setValidationErrors(prev => ({ ...prev, name: '' }))
              }}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              fullWidth
              label='Type'
              value={type}
              onChange={e => {
                setType(e.target.value)
                setValidationErrors(prev => ({ ...prev, type: '' }))
              }}
              error={!!validationErrors.type}
              helperText={validationErrors.type}
              style={{ marginTop: 16 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color='secondary'>
              Cancel
            </Button>
            <Button onClick={saveTemperament} color='primary'>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
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
    </>
  )
}

export default TemperamentPage
