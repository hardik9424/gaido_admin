'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

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
  Select,
  MenuItem,
  CardContent,
  CardMedia,
  Card,
  Pagination
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Apartment } from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import ReactQuill from 'react-quill'

import Quill from 'quill'

import ImageUploader from 'quill-image-uploader'

import 'quill-image-uploader/dist/quill.imageUploader.min.css'

// import { htmlToMarkdown, markdownToHtml } from './Parser'

Quill.register('modules/imageUploader', ImageUploader)

import ProtectedRoute from '@components/ProtectedRoute'

import 'react-quill/dist/quill.snow.css'
import {
  getFunctions,
  getIndustryList,
  getJobRoles,
  createJobRoles,
  deleteJobRoles,
  updateJobRoles,
  uploadFile,
  adminDetails
} from '@/app/api'
import CustomTextField from '@/@core/components/mui/TextField'

const MainPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '', // For React Quill content
    industryId: '',
    functionId: '',
    htmlContent: ''
  })

  const [industries, setIndustries] = useState([]) // Stores the list of industries
  const [functions, setFunctions] = useState([]) // Stores the list of functions
  const [industryLists, setIndustriesLists] = useState([]) // Stores all job roles
  const [isFormValid, setIsFormValid] = useState({
    name: true,
    description: true,
    details: true,
    industryId: true,
    functionId: true
  })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false) // State for confirmation dialog
  const [deleteIndex, setDeleteIndex] = useState(null) // Track the industry to delete
  const [editingIndex, setEditingIndex] = useState(null)
  const [htmlContent, setHtmlContent] = useState('') // Stores the HTML content for the modal
  const [viewModalOpen, setViewModalOpen] = useState(false) // Controls the visibility of the modal
  const [totalItems, setTotalItems] = useState()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
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
      const industryPermissions = userPermissions.find(perm => perm.name === 'Functions')

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
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false) // Close the modal
    setHtmlContent('') // Clear the HTML content
  }

  const router = useRouter()
  const reactQuillRef = useRef()

  // Fetch all industries
  const fetchIndustries = async () => {
    setLoading(true)

    const limit = 1000
    try {
      const search = ''
      const response = await getIndustryList(page, 1000, search) // Get all industries without pagination
      console.log('ind', response.data.data)
      if (response.status === 200) {
        setIndustries(response.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all functions
  const fetchFunctions = async () => {
    setLoading(true)
    const page = 1
    const limit = 1000
    try {
      const response = await getFunctions(page, 1000, '') // Get all functions without pagination
      if (response.status === 200) {
        setFunctions(response.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndustries()
    fetchFunctions()
    fetchAllFunctionLists() // Ensure job roles are also fetched
  }, [])

  const fetchAllFunctionLists = async () => {
    setLoading(true)
    try {
      const response = await getJobRoles() // Fetch all job roles (no pagination)
      if (response.status === 200) {
        console.log('count', response.data.data.totalCount)

        setIndustriesLists(response.data.data)
        setTotalItems(response.data.data.totalCount)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

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
    const industryIdValid = data.industryId && data.industryId.trim() !== ''
    const functionIdValid = data.functionId && data.functionId.trim() !== ''

    const isValid = nameValid && descriptionValid && industryIdValid && functionIdValid

    // Mark all fields as touched
    setTouchedFields({
      name: true,
      description: true,
      industryId: true,
      functionId: true
    })

    // Update validation state
    setIsFormValid({
      name: nameValid,
      description: descriptionValid,
      industryId: industryIdValid,
      functionId: functionIdValid
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

  const handleCheckboxChange = e => {
    const { checked } = e.target
    setFormData(prevState => ({ ...prevState, isImportant: checked }))
  }

  const handleDetailsChange = value => {
    setFormData(prevState => ({ ...prevState, htmlContent: value }))
  }

  // Validation for name and description

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      details: '',
      isImportant: false,
      industryId: '',
      functionId: ''
    })
  }
  const handleOpenModal = industry => {
    if (industry) {
      console.log('Industry', industry)
      // Prefill the form data with the existing industry data for editing
      setFormData({
        name: industry?.name,
        description: industry?.description,
        details: industry?.htmlContent || '', // If 'details' exist, otherwise set it as empty
        // isImportant: industry.isImportant || false
        industryId: industry?.industry?._id || '',
        functionId: industry?.function?._id || '' // If 'functionId' exist, otherwise set it as empty
      })
      setEditingIndex(industry._id) // Save the index or ID to track which industry is being edited
    } else {
      // If no industry is passed, this means it's for adding a new industry, so reset the form
      setFormData({
        name: '',
        description: '',
        details: '',
        industryId: '',
        functionId: ''
      })
      setEditingIndex(null) // Reset editing index when adding a new industry
    }
    setOpenModal(true) // Open the modal
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  // Handle Delete Industry
  const handleDelete = industry => {
    console.log('data', industry)
    setDeleteIndex(industry._id)
    setDeleteConfirmOpen(true) // Open confirmation dialog before delete
  }

  const confirmDelete = async () => {
    const payload = {
      jobId: deleteIndex
    }
    try {
      const response = await deleteJobRoles(payload)
      if (response.status === 200) {
        toast.success(response.data.message)
        setDeleteConfirmOpen(false) // Close confirmation dialog
        setDeleteIndex(null)
        fetchAllFunctionLists()
      }
    } catch (error) {
      console.error(error)
      toast.error(response.data.message)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false) // Close confirmation dialog
    setDeleteIndex(null)
  }
  const handleSave = async () => {
    // const isValid = validateForm(formData)

    // if (!isValid) {
    //   toast.error('Please fill in all required fields.')
    //   return
    // }
    if (validateForm()) {
      const payload = {
        name: formData?.name,
        description: formData?.description,
        htmlContent: formData?.details,
        industryId: formData?.industryId,
        functionId: formData?.functionId
      }

      try {
        let response
        if (editingIndex) {
          const editedPayload = {
            _id: editingIndex,
            name: formData.name,
            description: formData?.description,
            htmlContent: formData?.details,
            industryId: formData?.industryId,
            functionId: formData?.functionId
          }
          // If we are editing, call the editIndustry API
          response = await updateJobRoles(editedPayload)
        } else {
          // If we are creating a new industry, call createIndustry API
          response = await createJobRoles(payload)
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
          toast.success(response?.data?.message)
          fetchAllFunctionLists()
        } else {
          // Handle unsuccessful response
          toast.error(response?.data?.message || 'Something went wrong')
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      }
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
        title='Job-Role Management'
        titleTypographyProps={{
          variant: 'h5',
          fontWeight: 'bold'
        }}
        subheader='Add, edit, or delete job roles'
        action={
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenModal}
            sx={{
              background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
              color: 'white',
              '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
            }}
            disabled={!permissions?.create}
          >
            Add Job Role
          </Button>
        }
      />
      <Box sx={{ paddingBottom: 6 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Jobs'
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
              <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Details</TableCell>
              <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Industry</TableCell>
              <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Function</TableCell>
              <TableCell sx={{ width: '5%', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {industryLists?.data
              ?.filter(job => job?.name?.toLowerCase().includes(globalFilter.toLowerCase()))
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
                  <TableCell>{industry.name}</TableCell>
                  <TableCell>{industry.description}</TableCell>
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
                  <TableCell>{industry.industry.name}</TableCell>
                  <TableCell>{industry.function.name}</TableCell>
                  <TableCell>
                    <IconButton disabled={!permissions?.edit} color='primary' onClick={() => handleOpenModal(industry)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton disabled={!permissions?.edit} color='secondary' onClick={() => handleDelete(industry)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit Job Role */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth='md'>
        <DialogTitle>{'Add Job Role'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <TextField
              label='Job Role Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              error={touchedFields.name && !isFormValid.name} // Show error only if touched
              helperText={touchedFields.name && !isFormValid.name ? 'Name is required' : ''} // Show helper text if touched and invalid
            />
            <TextField
              label='Description'
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
            {/* Industry Select */}
            <Grid item xs={12}>
              <TextField
                select
                label='Industry'
                name='industryId'
                value={formData.industryId}
                onChange={handleInputChange}
                fullWidth
                error={!isFormValid.industryId}
                helperText={!isFormValid.industryId ? 'Industry is required' : ''}
              >
                {industries?.industries?.map(industry => (
                  <MenuItem key={industry._id} value={industry._id}>
                    {industry.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Function Select */}
            <Grid item xs={12}>
              <TextField
                select
                label='Function'
                name='functionId'
                value={formData.functionId}
                onChange={handleInputChange}
                fullWidth
                error={!isFormValid.functionId}
                helperText={!isFormValid.functionId ? 'Function is required' : ''}
              >
                {functions?.data?.map(func => (
                  <MenuItem key={func._id} value={func._id}>
                    {func.name}
                  </MenuItem>
                ))}
              </TextField>
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

      <Box sx={{ marginTop: 3 }}>
        <Pagination
          count={Math.ceil(totalItems / rowsPerPage)}
          page={page}
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
                  __html: htmlContent?.replace(/<img.*?>/, '') // Remove the image from the HTML content
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
    <ProtectedRoute requiredPermission='Job Roles'>
      <MainPage />
    </ProtectedRoute>
  )
}

export default ProtectedChatPage
