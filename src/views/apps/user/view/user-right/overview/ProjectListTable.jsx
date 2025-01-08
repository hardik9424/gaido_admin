'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import dynamic from 'next/dynamic'

import {
  Typography,
  Card,
  CardHeader,
  MenuItem,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

// Third-party Imports
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Component Imports
import { ToastContainer, toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

// API Imports
import { getUserById, updateCategory, deleteCategory, uploadImage } from '@/app/api'

// Style Imports
import 'react-toastify/dist/ReactToastify.css'

// Debounced Input Component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
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

// const ProjectListTable = () => {
//   const router = useRouter()
//   const [data, setData] = useState([])
//   const [globalFilter, setGlobalFilter] = useState('')
//   const [open, setOpen] = useState(false)
//   const [editingCategory, setEditingCategory] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(5)

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       const userId = localStorage.getItem('id')

//       if (!userId) {
//         router.push('/login')

//         return
//       }

//       try {
//         const userDetailsResponse = await getUserById(userId)

//         if (userDetailsResponse) {
//           const formattedData = userDetailsResponse?.data?.data[0].categories.map(category => ({
//             id: category._id,
//             name: category.name,
//             image: category.image
//           }))

//           setData(formattedData || null)
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         toast.error('Failed to load data. Please try again later.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [router])

//   const filteredData = useMemo(() => {
//     return data.filter(category => category.name.toLowerCase().includes(globalFilter.toLowerCase()))
//   }, [data, globalFilter])

//   const handleDeleteCategory = async categoryId => {
//     try {
//       await deleteCategory({ id: categoryId })
//       setData(prevData => prevData.filter(category => category.id !== categoryId))
//       toast.success('Category deleted successfully')
//     } catch (error) {
//       console.error('Error deleting category:', error)
//       toast.error('Failed to delete category. Please try again later.')
//     }
//   }

//   const handleEditOpen = category => {
//     setEditingCategory(category)
//     setOpen(true)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setEditingCategory(null)
//   }

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       image: null,
//       imagePreview: null
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Category name is required'),
//       image: Yup.mixed().required('Image is required')
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       setLoading(true)

//       try {
//         let imageUrl = editingCategory.image

//         if (values.image && values.image instanceof File) {
//           const formData = new FormData()

//           formData.append('file', values.image)
//           const uploadResponse = await uploadImage(formData)

//           imageUrl = uploadResponse.data.data.fileUrl
//         }

//         const payload = {
//           category_id: editingCategory.id,
//           name: values.name,
//           image: imageUrl
//         }

//         await updateCategory(payload)
//         setData(prevData =>
//           prevData.map(category =>
//             category.id === editingCategory.id ? { ...category, name: values.name, image: imageUrl } : category
//           )
//         )
//         toast.success('Category updated successfully')
//         resetForm()
//         handleClose()
//       } catch (error) {
//         console.error('Error updating category:', error)
//         toast.error('Failed to update category. Please try again later.')
//       } finally {
//         setLoading(false)
//       }
//     }
//   })

//   useEffect(() => {
//     if (editingCategory) {
//       formik.setValues({
//         name: editingCategory.name,
//         image: editingCategory.image,
//         imagePreview: editingCategory.image
//       })
//     }
//   }, [editingCategory])

//   const handleImageChange = e => {
//     const file = e.target.files[0]

//     formik.setFieldValue('image', file)
//     const reader = new FileReader()

//     reader.onloadend = () => {
//       formik.setFieldValue('imagePreview', reader.result)
//     }

//     if (file) {
//       reader.readAsDataURL(file)
//     }
//   }

//   if (loading) {
//     return (
//       <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
//         <CircularProgress />
//       </Box>
//     )
//   }
//   const handleSearchChange = value => {
//     setGlobalFilter(value)
//     setPage(0) // Reset page to 0 whenever the search term changes
//   }
//   return (
//     <Card>
//       <ToastContainer />
//       <CardHeader title="User's Categories" className='flex flex-wrap gap-4' />
//       <div className='flex items-center justify-between p-6 gap-4'>
//         <div className='flex items-center gap-2'>
//           {/* <Typography>Show</Typography> */}
//           {/* <CustomTextField
//             select
//             value={rowsPerPage}
//             onChange={e => setRowsPerPage(Number(e.target.value))}
//             className='is-[70px]'
//           >
//             <MenuItem value={5}>5</MenuItem>
//             <MenuItem value={7}>7</MenuItem>
//             <MenuItem value={10}>10</MenuItem>
//           </CustomTextField> */}
//         </div>
//         <DebouncedInput value={globalFilter ?? ''} onChange={handleSearchChange} placeholder='Search Category' />
//       </div>
//       <TableContainer component={Box} className='overflow-x-auto'>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Image</TableCell>
//               {/* <TableCell>Actions</TableCell> */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data
//               .filter(category => category.name.toLowerCase().includes(globalFilter.toLowerCase()))
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map(category => (
//                 <TableRow key={category.id}>
//                   <TableCell>
//                     <div className='flex items-center gap-4'>
//                       {/* <CustomAvatar src={category.image} size={34} /> */}
//                       <div className='flex flex-col'>
//                         <Typography className='font-medium' color='text.primary'>
//                           {category?.name}
//                         </Typography>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <img src={category?.image} alt={category?.name} width={50} height={50} />
//                   </TableCell>
//                   {/* <TableCell>
//                     <div className="flex items-center gap-2">
//                       <IconButton onClick={() => handleEditOpen(category)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton onClick={() => handleDeleteCategory(category.id)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </div>
//                   </TableCell> */}
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component='div'
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(_, newPage) => {
//           setPage(newPage)
//         }}
//         onRowsPerPageChange={event => {
//           setRowsPerPage(parseInt(event.target.value, 10))
//           setPage(0)
//         }}
//       />
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
//         <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin='dense'
//               label='Category Name'
//               type='text'
//               fullWidth
//               name='name'
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.name && Boolean(formik.errors.name)}
//               helperText={formik.touched.name && formik.errors.name}
//             />
//             <Button variant='contained' component='label' sx={{ mt: 2 }}>
//               Choose File
//               <input type='file' hidden onChange={handleImageChange} />
//             </Button>
//             {formik.values.imagePreview && (
//               <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
//                 <img src={formik.values.imagePreview} alt='Preview' style={{ width: 100, height: 100 }} />
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type='submit' variant='contained' color='primary'>
//               {editingCategory ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Card>
//   )
// }

// export default ProjectListTable
const ProjectListTable = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('') // State to track user input for search
  const [globalFilter, setGlobalFilter] = useState('') // State to filter data
  const [open, setOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const userId = localStorage.getItem('id')

      if (!userId) {
        router.push('/login')

        return
      }

      try {
        const userDetailsResponse = await getUserById(userId)

        if (userDetailsResponse) {
          const formattedData = userDetailsResponse?.data?.data[0].categories?.map(category => ({
            id: category._id,
            name: category.name,
            image: category.image
          }))

          setData(formattedData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Update globalFilter and reset page when searchTerm changes
  useEffect(() => {
    setGlobalFilter(searchTerm)
    setPage(0)
  }, [searchTerm])

  // Filtering logic before pagination
  const filteredData = useMemo(() => {
    return data.filter(category => category.name.toLowerCase().includes(globalFilter.toLowerCase()))
  }, [data, globalFilter])

  const handleDeleteCategory = async categoryId => {
    try {
      await deleteCategory({ id: categoryId })
      setData(prevData => prevData.filter(category => category.id !== categoryId))
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category. Please try again later.')
    }
  }

  const handleEditOpen = category => {
    setEditingCategory(category)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingCategory(null)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      image: null,
      imagePreview: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
      image: Yup.mixed().required('Image is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)

      try {
        let imageUrl = editingCategory.image

        if (values.image && values.image instanceof File) {
          const formData = new FormData()

          formData.append('file', values.image)
          const uploadResponse = await uploadImage(formData)

          imageUrl = uploadResponse.data.data.fileUrl
        }

        const payload = {
          category_id: editingCategory.id,
          name: values.name,
          image: imageUrl
        }

        await updateCategory(payload)
        setData(prevData =>
          prevData.map(category =>
            category.id === editingCategory.id ? { ...category, name: values.name, image: imageUrl } : category
          )
        )
        toast.success('Category updated successfully')
        resetForm()
        handleClose()
      } catch (error) {
        console.error('Error updating category:', error)
        toast.error('Failed to update category. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (editingCategory) {
      formik.setValues({
        name: editingCategory.name,
        image: editingCategory.image,
        imagePreview: editingCategory.image
      })
    }
  }, [editingCategory])

  const handleImageChange = e => {
    const file = e.target.files[0]

    formik.setFieldValue('image', file)
    const reader = new FileReader()

    reader.onloadend = () => {
      formik.setFieldValue('imagePreview', reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Card>
      <ToastContainer />
      <CardHeader title="User's Categories" className='flex flex-wrap gap-4' />
      <div className='flex items-center justify-between p-6 gap-4'>
        <div className='flex items-center gap-2'>
          {/* <Typography>Show</Typography> */}
          {/* <CustomTextField
            select
            value={rowsPerPage}
            onChange={e => setRowsPerPage(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </CustomTextField> */}
        </div>
        <DebouncedInput
          value={searchTerm ?? ''}
          onChange={value => setSearchTerm(String(value))} // Update searchTerm instead of globalFilter directly
          placeholder='Search Category'
        />
      </div>
      <TableContainer component={Box} className='overflow-x-auto'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className='flex items-center gap-4'>
                    {/* <CustomAvatar src={category.image} size={34} /> */}
                    <div className='flex flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {category?.name}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <img src={category?.image} alt={category?.name} width={50} height={50} />
                </TableCell>
                {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <IconButton onClick={() => handleEditOpen(category)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCategory(category.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage)
        }}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10))
          setPage(0)
        }}
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Category Name'
              type='text'
              fullWidth
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Button variant='contained' component='label' sx={{ mt: 2 }}>
              Choose File
              <input type='file' hidden onChange={handleImageChange} />
            </Button>
            {formik.values.imagePreview && (
              <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
                <img src={formik.values.imagePreview} alt='Preview' style={{ width: 100, height: 100 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit' variant='contained' color='primary'>
              {editingCategory ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default ProjectListTable
