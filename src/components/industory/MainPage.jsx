'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { saveAs } from 'file-saver'
import Papa from 'papaparse'

import { SketchPicker } from 'react-color'

import { ColorLens as ColorLensIcon, UploadFile } from '@mui/icons-material'

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
  Tooltip,
  Pagination,
  CardContent,
  Card,
  CardMedia,
  Popover,
  Typography
} from '@mui/material'

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon, // For View Options button
  Apartment
} from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// import ReactQuill from 'react-quill'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import Quill from 'quill'

import ImageUploader from 'quill-image-uploader'

import 'quill-image-uploader/dist/quill.imageUploader.min.css'

// import { htmlToMarkdown, markdownToHtml } from './Parser'

Quill.register('modules/imageUploader', ImageUploader)

import QuillTable from 'quill-table'

// Register the table module with Quill
Quill.register('modules/table', QuillTable)

import ProtectedRoute from '@components/ProtectedRoute'

import {
  getIndustryList,
  createIndustry,
  deleteIndustry,
  editIndustry,
  uploadFile,
  adminDetails,
  uploadCsv
} from '@/app/api'
import CustomTextField from '@/@core/components/mui/TextField'

const MainPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '',
    BackgroundColor: '',
    BackgroundImage: '',
    isImportant: false
  })

  const [isFormValid, setIsFormValid] = useState({
    name: true,
    description: true
  })
  const reactQuillRef = useRef()

  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [industries, setIndustries] = useState([]) // Stores the list of industries
  const [editingIndex, setEditingIndex] = useState(null) // Tracks which industry is being edited
  const [industryLists, setIndustriesLists] = useState([])
  const [page, setPage] = useState(1) // Zero-based page index for Material UI pagination
  const [rowsPerPage, setRowsPerPage] = useState(10) // Number of rows per page
  const [viewOptionsModalOpen, setViewOptionsModalOpen] = useState(false) // For "View Options" modal
  const [selectedQuestion, setSelectedQuestion] = useState(null) // Track selected question for viewing options
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false) // State for confirmation dialog
  const [deleteIndex, setDeleteIndex] = useState(null) // Track the industry to delete
  const [deleteId, setDeleteId] = useState(null)
  const [totalItems, setTotalItems] = useState(0) // Store total count of items
  const [value, setValue] = useState('')
  const [htmlContent, setHtmlContent] = useState('') // Stores the HTML content for the modal
  const [viewModalOpen, setViewModalOpen] = useState(false) // Controls the visibility of the modal
  const [globalFilter, setGlobalFilter] = useState('')
  const [touchedFields, setTouchedFields] = useState({})
  const [permissions, setPermissions] = useState({ create: false, read: false, edit: false, delete: false })
  const [adminId, setAdminId] = useState('')
  const [hoveredImage, setHoveredImage] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleImageHover = (event, imageUrl) => {
    setHoveredImage(imageUrl)
    setAnchorEl(event.currentTarget) // Set the anchor element for the popover
  }

  const handleImageLeave = () => {
    // setHoveredImage(null)
    setAnchorEl(null) // Close the popover
  }
  const DebouncedInput = ({ value: initialValue, onChange, debounce = 700, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, onChange, debounce])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null) // Anchor for Popover
  const handleOpenColorPicker = event => setColorPickerAnchor(event.currentTarget)
  const handleCloseColorPicker = () => setColorPickerAnchor(null)
  const isColorPickerOpen = Boolean(colorPickerAnchor)
  //csv
  const handleExportCSV = () => {
    const csvData = industryLists?.industries?.map(industry => ({
      Id: industry._id,
      Name: industry.name,
      Description: industry.description,
      Details: industry.htmlContent
    }))

    const csv = Papa.unparse(csvData)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'industries.csv')
  }

  const handleImportCSV = async event => {
    const file = event?.target?.files[0] // Get the selected file
    console.log('file', file)

    if (file) {
      const formData = new FormData()
      formData.append('file', file) // Add the file to FormData

      try {
        const response = await uploadCsv(formData)
        console.log('CSV Upload Response:', response)
      } catch (error) {
        console.error('Error uploading CSV:', error)
        toast.error('An error occurred while importing the CSV.')
      }
    } else {
      toast.error('Please select a valid CSV file.')
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const parsedData = JSON.parse(userData)
    setAdminId(parsedData._id)
  }, [])
  const fetchPermissions = async () => {
    if (!adminId) return // Skip if adminId is not set

    try {
      const response = await adminDetails({ userId: adminId })
      console.log('perm', response)
      const userPermissions = response?.data?.data?.data?.user?.permissions || []
      const industryPermissions = userPermissions.find(perm => perm.name === 'Industry')

      if (industryPermissions) {
        setPermissions(industryPermissions)
      } else {
        console.warn('Industry permissions not found')
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }
  useEffect(() => {
    if (adminId) {
      fetchPermissions()
    }
  }, [adminId])
  const handleViewDetails = content => {
    setHtmlContent(content.htmlContent) // Set the HTML content
    setFormData({
      name: content?.name,
      description: content?.description,
      details: content?.htmlContent, // Set the HTML content
      BackgroundColor: content?.color,
      BackgroundImage: content?.imageUrl
    })

    setViewModalOpen(true) // Open the modal
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false) // Close the modal
    setHtmlContent('') // Clear the HTML content
  }

  const router = useRouter()
  const quillRef = useRef(null) // Create a ref for the Quill editor

  // const fetchAllIndustryLists = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await getIndustryList(page, rowsPerPage)
  //     if (response.status === 200) {
  //       setIndustriesLists(response.data.data)
  //       setTotalItems(response.data.data.totalCount)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setIndustriesLists([])
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const fetchAllIndustryLists = async () => {
    setLoading(true)
    try {
      const searchParam = globalFilter ? globalFilter : ''
      const response = await getIndustryList(page, rowsPerPage, searchParam) // Fetch based on page, rowsPerPage, and search term
      console.log(response.data.data.industries.length) //
      if (response.status === 200) {
        setIndustriesLists(response.data.data) // Update industry list
        setTotalItems(response.data.data.totalCount) // Update total items for pagination
      }
    } catch (error) {
      console.error('Error fetching industry lists:', error)
      setIndustriesLists([]) // Clear list on error
      setTotalItems(0) // Reset total items
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllIndustryLists()
  }, [page, globalFilter])

  // Handle input changes for name, description, and details
  const validateField = (field, value) => {
    let isValid = true

    if (field === 'name') {
      isValid = value.trim() !== ''
      setIsFormValid(prev => ({ ...prev, name: isValid }))
    } else if (field === 'description') {
      isValid = value.trim() !== ''
      setIsFormValid(prev => ({ ...prev, description: isValid }))
    } else if (field === 'industryId') {
      isValid = value.trim() !== ''
      setIsFormValid(prev => ({ ...prev, industryId: isValid }))
    } else if (field === 'functionId') {
      isValid = value.trim() !== ''
      setIsFormValid(prev => ({ ...prev, functionId: isValid }))
    }
  }
  const validateForm = (data = formData) => {
    const nameValid = data.name && data.name.trim() !== ''
    const descriptionValid = data.description && data.description.trim() !== ''

    const isValid = nameValid && descriptionValid

    // Mark all fields as touched
    setTouchedFields({
      name: true,
      description: true
    })

    // Update validation state
    setIsFormValid({
      name: nameValid,
      description: descriptionValid
    })

    return isValid
  }

  // Handle input changes for name, description, and details
  const handleInputChange = e => {
    const { name, value } = e.target
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }))

    setFormData(prevState => {
      const updatedFormData = { ...prevState, [name]: value }

      // Only validate the touched field
      validateField(name, updatedFormData[name])

      return updatedFormData
    })
  }

  // const handleImageUpload = async file => {
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   try {
  //     // Upload the image to the server (S3 or your backend)
  //     const response = await uploadFile(formData)
  //     console.log('Image Upload Response:', response)

  //     if (response.status === 200) {
  //       const imageUrl = response.data.data.fileUrl
  //       console.log('Uploaded Image URL:', imageUrl)

  //       if (imageUrl) {
  //         const quill = quillRef.current.getEditor() // Access Quill editor instance from ref
  //         const index = quill.getLength() // Get the current content length
  //         console.log('Editor Length:', index)

  //         // Insert image at the end of the editor content
  //         quill.insertEmbed(index, 'image', imageUrl)

  //         // Optionally update formData with updated HTML content
  //         const updatedHtmlContent = quill.root.innerHTML // Get the updated HTML content
  //         console.log('Updated HTML content', updatedHtmlContent)

  //         setFormData(prevState => ({
  //           ...prevState,
  //           details: updatedHtmlContent // Update details in formData
  //         }))
  //       } else {
  //         toast.error('Error: Image URL is undefined')
  //       }
  //     } else {
  //       toast.error('Error uploading image')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     toast.error(error.message)
  //   }
  // }

  const handleCheckboxChange = e => {
    const { checked } = e.target
    setFormData(prevState => ({ ...prevState, isImportant: checked }))
  }

  const handleDetailsChange = value => {
    setFormData(prevState => ({ ...prevState, details: value }))
  }

  // Open the modal for either adding or editing an industry
  const handleOpenModal = (industry = null) => {
    if (industry) {
      console.log('Industry', industry)
      // Prefill the form data with the existing industry data for editing
      setFormData({
        name: industry.name,
        description: industry.description,
        details: industry.htmlContent || '',
        BackgroundColor: industry.color || '',
        BackgroundImage: industry.imageUrl || ''
      })
      setEditingIndex(industry._id) // Save the index or ID to track which industry is being edited
    } else {
      // If no industry is passed, this means it's for adding a new industry, so reset the form
      setFormData({
        name: '',
        description: '',
        details: '',
        isImportant: false
      })
      setEditingIndex(null) // Reset editing index when adding a new industry
    }
    setOpenModal(true) // Open the modal
  }

  const handleSave = async () => {
    if (validateForm()) {
      const payload = {
        name: formData.name,
        description: formData.description,
        htmlContent: formData.details,
        color: formData.BackgroundColor,
        imageUrl: formData.BackgroundImage
      }

      try {
        let response
        if (editingIndex) {
          const editedPayload = {
            _id: editingIndex,
            name: formData.name,
            description: formData.description,
            htmlContent: formData.details,
            color: formData.BackgroundColor,
            imageUrl: formData.BackgroundImage
          }
          // If we are editing, call the editIndustry API
          response = await editIndustry(editedPayload)
        } else {
          console.log('payload col', payload)
          // If we are creating a new industry, call createIndustry API
          response = await createIndustry(payload)
        }

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
          fetchAllIndustryLists() // Refresh the industry list
        } else {
          // Handle unsuccessful response
          toast.error(response.data.message || 'Something went wrong')
        }
      } catch (error) {
        console.error(error)
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

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditingIndex('')
  }

  // Handle Delete Industry
  const handleDelete = industry => {
    console.log('ind', industry)
    setDeleteId(industry._id)

    // setDeleteIndex(index)
    setDeleteConfirmOpen(true) // Open confirmation dialog before delete
  }

  const confirmDelete = async () => {
    const payload = {
      industryId: deleteId
    }
    const response = await deleteIndustry(payload)
    if (response.status === 200) {
      toast.success(response.data.message)
      fetchAllIndustryLists() // Refresh the industry list after deletion
      setDeleteConfirmOpen(false)
      setDeleteIndex(null)
      setDeleteId(null)
      setOpenModal(false)
    } else {
      toast.error(response.data.message)
      setDeleteConfirmOpen(false)
      setDeleteIndex(null)
      setDeleteId(null)
      setOpenModal(false)
    }
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
  const onChange = content => {
    setValue(content)

    if (onChange) {
      onChange({
        html: content
        // markdown: htmlToMarkdown(content)
      })
    }
  }
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        console.log('ff', file)
        const response = await uploadFile({ file: file })
        const url = response.data.data.fileUrl
        const quill = reactQuillRef.current
        if (quill) {
          const range = quill.getEditorSelection()
          range && quill.getEditor().insertEmbed(range.index, 'image', url)
        }
      }
    }
  }, [])
  const handleSearch = searchTerm => {
    setGlobalFilter(searchTerm)
  }

  useEffect(() => {
    setPage(1) // Reset to the first page on search term change
    // setTotalItems(5)
  }, [globalFilter])

  return (
    <>
      <Box sx={{ padding: 4, maxWidth: '1800px', margin: 'auto' }}>
        <ToastContainer />

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

        <Box sx={{ padding: 4, maxWidth: '1800px', margin: 'auto' }}>
          <CardHeader
            avatar={<Apartment fontSize='large' color='info' />}
            title='Industry Management'
            titleTypographyProps={{
              variant: 'h5',
              fontWeight: 'bold'
            }}
            subheader='Add, edit, or delete industries'
            action={
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleOpenModal()}
                sx={{
                  background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                  color: 'white',
                  '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' },
                  minWidth: '200px' // Consistent width
                }}
                disabled={!permissions?.create}
              >
                Add Industry
              </Button>
            }
          />
          <Box
            sx={{
              display: 'flex',

              flexDirection: 'column',
              alignItems: 'flex-end',
              marginRight: 6,
              marginTop: -8
            }}
          >
            <Button
              variant='text'
              component='label'
              sx={{
                fontSize: 'small'
              }}
              startIcon={<UploadFile />}
            >
              Import CSV
              <input type='file' accept='.csv' hidden onChange={handleImportCSV} />
            </Button>
          </Box>
        </Box>

        <Box sx={{ paddingBottom: 6 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            // onChange={value => setGlobalFilter(String(value))}
            // onChange={value => {
            //   setGlobalFilter(value) // Update search term
            //   setPage(1) // Reset to the first page for search results
            // }}
            onChange={handleSearch}
            placeholder='Search Industry'
          />
        </Box>

        {/* Industry List Table */}
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#E0E0E0,',
                  '&:hover': {
                    backgroundColor: '#E0E0E0',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    '& td': {
                      transform: 'scale(0.95)',
                      transition: 'transform 0.3s ease'
                    }
                  }
                }}
              >
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Details</TableCell>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Color</TableCell>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {industryLists?.industries?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align='center'>
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                industryLists?.industries
                  ?.filter(news => news?.name?.toLowerCase().includes(globalFilter.toLowerCase()))
                  .map((industry, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: '#E0E0E0,',
                        '&:hover': {
                          backgroundColor: '#E0E0E0',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                          '& td': {
                            transform: 'scale(0.95)',
                            transition: 'transform 0.3s ease'
                          }
                        }
                      }}
                    >
                      <TableCell>
                        <Tooltip title={industry.name.length > 20 ? industry.name : ''}>
                          <span>
                            {industry.name.length > 20 ? `${industry.name.substring(0, 20)}...` : industry.name}
                          </span>
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
                        <Button
                          variant='contained'
                          sx={{
                            background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                            color: 'white',
                            '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' },
                            width: 80,
                            fontSize: 12
                          }}
                          onClick={() => handleViewDetails(industry)}
                        >
                          View Details
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: industry.color || '#ccc',
                              border: '1px solid #ddd',
                              marginBottom: 1
                            }}
                          />
                          <Typography variant='caption' sx={{ textAlign: 'center' }}>
                            {industry.color || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <Box>
                          <Box
                            component='img'
                            src={industry.imageUrl || 'n/a'}
                            alt='Preview'
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              border: '1px solid #ddd',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                            onMouseEnter={event => handleImageHover(event, industry.imageUrl)}
                            onMouseLeave={handleImageLeave}
                          />
                        </Box>

                        {/* Popover for Larger Image */}
                        <Popover
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={handleImageLeave}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                          }}
                          transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                          }}
                          sx={{
                            pointerEvents: 'none'
                          }}
                        >
                          <Box
                            component='img'
                            src={hoveredImage}
                            alt='Hovered Preview'
                            sx={{
                              width: 200,
                              height: 200,
                              objectFit: 'contain',
                              borderRadius: '8px',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                          />
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={'Edit'}>
                          <IconButton
                            // color={editingIndex && editingIndex === industry._id ? 'primary' : ''}
                            disabled={!permissions?.edit}
                            onClick={() => handleOpenModal(industry)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          disabled={!permissions.edit}
                          color='secondary'
                          onClick={() => handleDelete(industry)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Box sx={{ marginTop: 3 }}>
          {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={industryLists.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
          <Pagination
            count={Math.ceil(totalItems / rowsPerPage)} // Calculate total number of pages
            page={page} // Show the current page (1-indexed)
            onChange={handleChangePage}
            // color='primary'

            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
              '& .Mui-selected': {
                backgroundColor: 'green', // Green background for selected page
                color: 'green' // White text for selected page
              }
            }}
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
              <Grid item xs={12}>
                <TextField
                  label='Industry Name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                  error={touchedFields.name && !isFormValid.name} // Show error only if touched
                  helperText={touchedFields.name && !isFormValid.name ? 'Name is required' : ''}
                />
              </Grid>
              {/* Industry Description Input */}
              <Grid item xs={12}>
                <TextField
                  label='Industry Description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                  multiline
                  rows={4}
                  error={touchedFields.description && !isFormValid.description} // Show error only if touched
                  helperText={touchedFields.description && !isFormValid.description ? 'Description is required' : ''}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label=''
                    name='BackgroundColor'
                    value={formData.BackgroundColor}
                    onChange={handleInputChange}
                    fullWidth={false}
                    margin='normal'
                    sx={{ maxWidth: 200 }}
                    InputProps={{
                      style: {
                        backgroundColor: formData.BackgroundColor, // Set background color
                        color: formData.BackgroundColor === '#ffffff' ? '#000' : '#fff' // Ensure text contrast
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleOpenColorPicker}
                    sx={{
                      backgroundColor: formData.BackgroundColor || '#f5f5f5',
                      border: '1px solid #ddd',
                      '&:hover': { backgroundColor: formData.BackgroundColor || '#e0e0e0' }
                    }}
                  >
                    <ColorLensIcon sx={{ color: formData.BackgroundColor === '#ffffff' ? '#000' : '#fff' }} />
                  </IconButton>
                  <Popover
                    open={isColorPickerOpen}
                    anchorEl={colorPickerAnchor}
                    onClose={handleCloseColorPicker}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <SketchPicker
                      color={formData.BackgroundColor || '#ffffff'}
                      onChangeComplete={color => {
                        setFormData(prevState => ({
                          ...prevState,
                          BackgroundColor: color.hex // Update the color in state
                        }))
                      }}
                      disableAlpha // Disable the alpha slider if transparency isn't needed
                    />
                  </Popover>
                </Box>
              </Grid> */}

              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
                  Pick a Theme Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Color Preview */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: formData.color || '#ddd',
                      border: '2px solid #ccc',
                      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                      cursor: 'pointer'
                    }}
                    onClick={handleOpenColorPicker} // Click to open the picker
                  />
                  {/* Hidden Color Input */}
                  <TextField
                    label='Hex Color Code'
                    name='color'
                    value={formData.BackgroundColor}
                    onChange={handleInputChange}
                    fullWidth={false}
                    margin='normal'
                    sx={{ maxWidth: 200 }}
                    InputProps={{
                      style: {
                        backgroundColor: formData.BackgroundColor, // Set background color
                        BackgroundColor: formData.BackgroundColor === '#ffffff' ? '#000' : '#fff' // Ensure text contrast
                      }
                    }}
                  />
                  <Popover
                    open={isColorPickerOpen}
                    anchorEl={colorPickerAnchor}
                    onClose={handleCloseColorPicker}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <SketchPicker
                      color={formData.BackgroundColor || '#ffffff'}
                      onChangeComplete={color => {
                        setFormData(prevState => ({
                          ...prevState,
                          BackgroundColor: color.hex // Update the color in state
                        }))
                      }}
                      disableAlpha // Remove alpha slider for simplicity
                    />
                  </Popover>
                </Box>
              </Grid>
              {/* <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={async e => {
                      const file = e.target.files[0] // Get the selected file
                      if (file) {
                        try {
                          const formData = new FormData()
                          formData.append('file', file)

                          // Call the API to upload the file
                          const response = await uploadFile(formData)
                          if (response.status === 200) {
                            const imageUrl = response.data.data.fileUrl
                            console.log('Uploaded Image URL:', imageUrl)

                            // Update formData with the uploaded image URL
                            setFormData(prevState => ({
                              ...prevState,
                              BackgroundImage: imageUrl
                            }))

                            toast.success('Image uploaded successfully!')
                          } else {
                            toast.error('Failed to upload image.')
                          }
                        } catch (error) {
                          console.error('Image upload error:', error)
                          toast.error('Error uploading image.')
                        }
                      }
                    }}
                  />
                  {formData.BackgroundImage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={formData.BackgroundImage}
                        alt='Uploaded'
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() =>
                          setFormData(prevState => ({
                            ...prevState,
                            BackgroundImage: ''
                          }))
                        }
                      >
                        Remove Image
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
                  Upload Function Image
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: 2,
                    textAlign: 'center',
                    position: 'relative',
                    backgroundColor: '#f9f9f9',
                    '&:hover': {
                      borderColor: '#11817B',
                      backgroundColor: '#f1f1f1'
                    }
                  }}
                >
                  <input
                    type='file'
                    accept='image/*'
                    onChange={async e => {
                      const file = e.target.files[0] // Get the selected file
                      if (file) {
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          // Call the API to upload the file
                          const response = await uploadFile(formData)
                          if (response.status === 200) {
                            const BackgroundImage = response.data.data.fileUrl
                            setFormData(prevState => ({
                              ...prevState,
                              BackgroundImage
                            }))
                            toast.success('Image uploaded successfully!')
                          } else {
                            toast.error('Failed to upload image.')
                          }
                        } catch (error) {
                          console.error('Image upload error:', error)
                          toast.error('Error uploading image.')
                        }
                      }
                    }}
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  <Typography variant='body2' sx={{ color: '#888' }}>
                    Drag & drop or click to upload an image
                  </Typography>
                </Box>
                {formData.BackgroundImage && (
                  <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src={formData.BackgroundImage}
                      alt='Uploaded'
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={() =>
                        setFormData(prevState => ({
                          ...prevState,
                          BackgroundImage: ''
                        }))
                      }
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Grid>

              {/* React Quill Editor for Details */}
              <Grid item xs={12}>
                <Box sx={{ marginTop: 2 }}>
                  <h4>Add Details (optional)</h4>

                  <ReactQuill
                    ref={reactQuillRef}
                    theme='snow'
                    placeholder='Start writing...'
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: '1' }, { header: '2' }, { font: [] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                          ['link', 'image', 'video'],
                          ['code-block', 'table'],
                          ['clean']
                        ],
                        handlers: {
                          image: imageHandler
                        },
                        table: true
                      },

                      clipboard: {
                        matchVisual: false
                      }
                    }}
                    formats={[
                      'header',
                      'font',
                      'size',
                      'bold',
                      'italic',
                      'underline',
                      'strike',
                      'blockquote',
                      'list',
                      'bullet',
                      'indent',
                      'link',
                      'image',
                      'video',
                      'code-block',
                      'table'
                    ]}
                    value={formData.details}
                    onChange={value => setFormData({ ...formData, details: value })}
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

        <Dialog open={viewModalOpen} onClose={handleCloseViewModal} fullWidth maxWidth='md'>
          <DialogTitle>Industry Details</DialogTitle>
          <DialogContent>
            <Card
              sx={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                marginBottom: 2
              }}
            >
              {/* Display the image */}
              <CardMedia
                component='img'
                image={
                  htmlContent?.match(/<img.*?src="(.*?)"/)?.[1] || // Extract the first image URL from HTML
                  'https://via.placeholder.com/400' // Fallback image
                }
                alt='Industry Image'
                sx={{
                  height: 200,
                  objectFit: 'contain', // Ensure the image is fully visible
                  backgroundColor: '#f5f5f5' // Optional: Add a background color for contrast
                }}
              />

              {/* Display the details */}
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: htmlContent.replace(/<img.*?>/, '') // Remove the image from the HTML content
                  }}
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewModal} color='secondary' variant='contained'>
              Close
            </Button>
            <Button
              // color='primary'
              sx={{
                background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                color: 'white',
                '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
              }}
              variant='contained'
              onClick={() => {
                setOpenModal(true), setViewModalOpen(false)
              }}
              disabled={!permissions.edit}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

// export default MainPage
const ProtectedChatPage = () => {
  return (
    <ProtectedRoute requiredPermission='Industry'>
      <MainPage />
    </ProtectedRoute>
  )
}

export default ProtectedChatPage
