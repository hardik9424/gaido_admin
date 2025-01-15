'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
  Tooltip,
  Pagination,
  CardContent,
  Card,
  CardMedia
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

import ProtectedRoute from '@components/ProtectedRoute'

import { getIndustryList, createIndustry, deleteIndustry, editIndustry, uploadFile, adminDetails } from '@/app/api'
import CustomTextField from '@/@core/components/mui/TextField'

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
      details: content?.htmlContent // Set the HTML content
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

  const handleImageUpload = async file => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Upload the image to the server (S3 or your backend)
      const response = await uploadFile(formData)
      console.log('Image Upload Response:', response)

      if (response.status === 200) {
        const imageUrl = response.data.data.fileUrl
        console.log('Uploaded Image URL:', imageUrl)

        if (imageUrl) {
          const quill = quillRef.current.getEditor() // Access Quill editor instance from ref
          const index = quill.getLength() // Get the current content length
          console.log('Editor Length:', index)

          // Insert image at the end of the editor content
          quill.insertEmbed(index, 'image', imageUrl)

          // Optionally update formData with updated HTML content
          const updatedHtmlContent = quill.root.innerHTML // Get the updated HTML content
          console.log('Updated HTML content', updatedHtmlContent)

          setFormData(prevState => ({
            ...prevState,
            details: updatedHtmlContent // Update details in formData
          }))
        } else {
          toast.error('Error: Image URL is undefined')
        }
      } else {
        toast.error('Error uploading image')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

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
        details: industry.htmlContent || '' // If 'details' exist, otherwise set it as empty
        // isImportant: industry.isImportant || false
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
        htmlContent: formData.details
      }

      try {
        let response
        if (editingIndex) {
          const editedPayload = {
            _id: editingIndex,
            name: formData.name,
            description: formData.description,
            htmlContent: formData.details
          }
          // If we are editing, call the editIndustry API
          response = await editIndustry(editedPayload)
        } else {
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
              '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
            }}
            // disabled={!permissions?.create}
            disabled={!permissions?.create}
          >
            Add Industry
          </Button>
        }
      />
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
              <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Details</TableCell>
              <TableCell sx={{ width: '5%', fontWeight: 'bold' }}>Actions</TableCell>
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
                        variant='outlined'
                        sx={{
                          background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                          color: 'white',
                          '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
                        }}
                        onClick={() => handleViewDetails(industry)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        disabled={!permissions?.edit}
                        color='primary'
                        onClick={() => handleOpenModal(industry)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton disabled={!permissions.edit} color='secondary' onClick={() => handleDelete(industry)}>
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
            {/* Industry Description Input */}
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
                        ['code-block'],
                        ['clean']
                      ],
                      handlers: {
                        image: imageHandler
                      }
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
                    'code-block'
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
