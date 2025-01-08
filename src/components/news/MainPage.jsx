'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  CardHeader,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  LinearProgress,
  Tooltip
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon, // For View Options button
  Apartment
} from '@mui/icons-material'

import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import { getAllNews, getIndustryList, createNew } from '@/app/api'

const MainPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '', // For React Quill content
    isImportant: false
  })

  const [isFormValid, setIsFormValid] = useState({
    name: true,
    description: true
  })

  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [industries, setIndustries] = useState([]) // Stores the list of industries
  const [editingIndex, setEditingIndex] = useState(null) // Tracks which industry is being edited
  const [industryLists, setIndustriesLists] = useState([])
  const [page, setPage] = useState(0) // Zero-based page index for Material UI pagination
  const [rowsPerPage, setRowsPerPage] = useState(10) // Number of rows per page
  const [viewOptionsModalOpen, setViewOptionsModalOpen] = useState(false) // For "View Options" modal
  const [selectedQuestion, setSelectedQuestion] = useState(null) // Track selected question for viewing options
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false) // State for confirmation dialog
  const [deleteIndex, setDeleteIndex] = useState(null) // Track the industry to delete

  const router = useRouter()

  const fetchAllNewsLists = async () => {
    setLoading(true)
    try {
      const response = await getAllNews(page + 1, rowsPerPage) // Pass page (1-indexed) and rowsPerPage
      if (response.status === 200) {
        setIndustriesLists(response.data.data)
      }
    } catch (error) {
      console.error(error)
      setIndustriesLists([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllNewsLists()
  }, [page, rowsPerPage])

  // Handle input changes for name, description, and details
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCheckboxChange = e => {
    const { checked } = e.target
    setFormData(prevState => ({ ...prevState, isImportant: checked }))
  }

  const handleDetailsChange = value => {
    setFormData(prevState => ({ ...prevState, details: value }))
  }

  // Validation for name and description
  const validateForm = () => {
    const nameValid = formData.name.trim() !== ''
    const descriptionValid = formData.description.trim() !== ''
    setIsFormValid({
      name: nameValid,
      description: descriptionValid
    })
    return nameValid && descriptionValid
  }

  // Handle Save button click
  const handleSave = async () => {
    if (validateForm()) {
      const payload = {
        name: formData.name,
        description: formData.description,
        content: formData.details
      }

      try {
        const response = await createNew(payload)

        if (response.status === 200) {
          // Reset form and close modal if successful
          setFormData({
            name: '',
            description: '',
            details: '',
            isImportant: false
          })
          setOpenModal(false)
          toast.success(response.data.message)
          fetchAllFunctionLists() // Refresh the industry list
        } else {
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      }
    }
  }

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      details: '',
      isImportant: false
    })
    setEditingIndex(null)
  }

  // Handle back navigation
  const handleBack = () => {
    router.back()
  }

  // Handle opening and closing the modal
  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData({ ...industries[index] }) // Load existing industry data into the form
    }
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  // Handle Delete Industry
  const handleDelete = index => {
    setDeleteIndex(index)
    setDeleteConfirmOpen(true) // Open confirmation dialog before delete
  }

  const confirmDelete = () => {
    const updatedIndustries = industries.filter((_, i) => i !== deleteIndex)
    setIndustries(updatedIndustries)
    setDeleteConfirmOpen(false) // Close confirmation dialog
    setDeleteIndex(null)
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false) // Close confirmation dialog
    setDeleteIndex(null)
  }

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Reset to the first page on row count change
  }

  // Open "View Options" modal and set the selected question
  const handleViewOptions = question => {
    setSelectedQuestion(question)
    setViewOptionsModalOpen(true)
  }

  // Close the "View Options" modal
  const handleCloseViewOptionsModal = () => {
    setViewOptionsModalOpen(false)
    setSelectedQuestion(null)
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '1800px', margin: 'auto' }}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            backgroundColor: 'rgba(17, 129, 123, 0.2)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(270deg, rgba(10, 129, 123, 0.7) 0%, #11817B 100%)' // Gradient for the progress bar
            }
          }}
          variant='indeterminate'
        />
      )}

      <CardHeader
        avatar={<Apartment fontSize='large' color='info' />}
        title='News Management'
        titleTypographyProps={{
          variant: 'h5',
          fontWeight: 'bold'
        }}
        subheader='Add, edit, or delete news'
        action={
          <Button
            variant='contained'
            color='primary'
            onClick={() => handleOpenModal()}
            sx={{
              background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
              color: 'white',
              '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
            }}
          >
            Add News
          </Button>
        }
      />

      {/* Industry List Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ width: '5%', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {industryLists.map((industry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Tooltip title={industry.name.length > 20 ? industry.name : ''}>
                    <span>{industry.name.length > 20 ? `${industry.name.substring(0, 20)}...` : industry.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={industry.description.length > 20 ? industry.description : ''}>
                    <span>
                      {industry.description.length > 20
                        ? `${industry.description.substring(0, 20)}...`
                        : industry.description}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <IconButton color='primary' onClick={() => handleOpenModal(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='secondary' onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ marginTop: 3 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={industryLists.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete} maxWidth='xs' fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this industry?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color='primary' variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Add/Edit Industry */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth='md'>
        <DialogTitle>{editingIndex !== null ? 'Edit Industry' : 'Add Industry'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Industry Name Input */}
            <TextField
              label='News Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              error={!isFormValid.name}
              helperText={!isFormValid.name ? 'Name is required' : ''}
            />
            {/* Industry Description Input */}
            <TextField
              label='News Description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              multiline
              rows={4}
              error={!isFormValid.description}
              helperText={!isFormValid.description ? 'Description is required' : ''}
            />
            {/* Checkbox for Important */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={formData.isImportant} onChange={handleCheckboxChange} />}
                label='Mark as Important'
              />
            </Grid>
            {/* React Quill Editor for Details */}
            <Grid item xs={12}>
              <Box sx={{ marginTop: 2 }}>
                <h4>Add Details (optional)</h4>
                <ReactQuill
                  value={formData.details}
                  onChange={handleDetailsChange}
                  modules={{
                    toolbar: [
                      [{ header: '1' }, { header: '2' }, { font: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['bold', 'italic', 'underline'],
                      ['link'],
                      ['blockquote'],
                      [{ align: [] }],
                      ['image', 'video'],
                      ['clean']
                    ]
                  }}
                  style={{ minHeight: '200px', maxHeight: '400px', overflow: 'auto' }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color='primary'
            disabled={!isFormValid.name || !isFormValid.description}
            sx={{
              background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
              color: 'white',
              '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MainPage
