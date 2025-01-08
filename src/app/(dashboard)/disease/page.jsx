'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Button,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  CardHeader
} from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import AddIcon from '@mui/icons-material/Add'

import { Warning } from '@mui/icons-material'

import { createDisease, deleteDisease, getAllDisease, updateDisease } from '@/app/api'

const DiseaseList = () => {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDisease, setEditingDisease] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [validationErrors, setValidationErrors] = useState({ name: '', type: '' })
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

  // Fetch diseases from API
  const fetchAllDiseases = async () => {
    setLoading(true)
    try {
      const response = await getAllDisease()
      if (response.status === 200) {
        setDiseases(response.data.data)
      } else {
      }
    } catch (error) {
      toast.error('An error occurred while fetching diseases.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllDiseases()
  }, [])

  // Open the modal for adding or editing
  const handleOpenModal = (disease = null) => {
    setEditingDisease(disease || { name: '', type: '' })
    setIsAdding(!disease)
    setModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingDisease(null)
    setIsAdding(false)
    setValidationErrors({ name: '', type: '' })
  }

  const handleSave = async () => {
    const errors = {}

    // Validate Name
    if (!editingDisease?.name?.trim()) {
      errors.name = 'Name is required'
    }

    // Validate Type
    if (!editingDisease?.type?.trim()) {
      errors.type = 'Type is required'
    }

    // If there are validation errors, set them and return early
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    setLoading(true)
    try {
      if (isAdding) {
        // Add new disease
        const response = await createDisease({ name: editingDisease.name, type: editingDisease.type })
        if (response.status === 200) {
          fetchAllDiseases()
          toast.success('Disease added successfully!')
        } else {
          toast.error('Failed to add disease.')
        }
      } else {
        // Edit existing disease
        await updateDisease(editingDisease.id, { name: editingDisease.name, type: editingDisease.type })
        fetchAllDiseases()
        toast.success('Disease updated successfully!')
      }
      handleCloseModal()
    } catch (error) {
      toast.error('An error occurred while saving the disease.')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete action with confirmation
  const handleDelete = id => {
    setDeleteId(id)
    setConfirmDelete(true)
  }

  const confirmDeleteDisease = async () => {
    setLoading(true)
    try {
      await deleteDisease(deleteId)
      fetchAllDiseases()
      toast.success('Disease deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete disease.')
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ padding: 4 }}>
      <ToastContainer />
      {loading && <LinearProgress />}
      <CardHeader
        avatar={<Warning color='primary' fontSize='large' />} // Icon before title
        title='Pets Disease'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Add or Edit Disease'}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 2 }}>
        <Button
          variant='contained'
          sx={{ backgroundColor: '#ffA500' }}
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add Disease
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diseases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(disease => (
              <TableRow key={disease.id}>
                <TableCell>{disease.name}</TableCell>
                <TableCell>{disease.type}</TableCell>
                <TableCell>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleOpenModal(disease)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleDelete(disease.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={diseases.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24
          }}
        >
          <Typography variant='h6' gutterBottom>
            {isAdding ? 'Add Disease' : 'Edit Disease'}
          </Typography>
          <TextField
            fullWidth
            label='Name'
            value={editingDisease?.name || ''}
            // onChange={e => setEditingDisease(prev => ({ ...prev, name: e.target.value }))}
            onChange={e => {
              setEditingDisease(prev => ({ ...prev, name: e.target.value }))
              setValidationErrors(prev => ({ ...prev, name: '' })) // Clear error on change
            }}
            sx={{ mb: 2 }}
            error={!!validationErrors.name} // Highlight the input field in red if there's an error
            helperText={validationErrors.name}
          />
          <TextField
            fullWidth
            label='Type'
            value={editingDisease?.type || ''}
            // onChange={e => setEditingDisease(prev => ({ ...prev, type: e.target.value }))}
            onChange={e => {
              setEditingDisease(prev => ({ ...prev, type: e.target.value }))
              setValidationErrors(prev => ({ ...prev, type: '' })) // Clear error on change
            }}
            sx={{ mb: 2 }}
            error={!!validationErrors.type} // Highlight the input field in red if there's an error
            helperText={validationErrors.type}
          />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button onClick={handleCloseModal} color='secondary'>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this disease?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteDisease} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DiseaseList
