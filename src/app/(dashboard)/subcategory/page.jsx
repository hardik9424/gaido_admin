'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import {
  TableContainer,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
  FormHelperText,
  TablePagination,
  Tooltip
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { ToastContainer, toast } from 'react-toastify'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import 'react-toastify/dist/ReactToastify.css'
import tableStyles from '@core/styles/table.module.css'
import { getAllSubCategory, createSubCategory, updateSubCategory } from '@/app/api/subcategory/getAllSubCategory'
import { uploadImage } from '@/app/api'

import { getAllCategories } from '@/app/api/category/getAllCategory'
import { deleteSubCategory } from '@/app/api/index'


const UserTable = () => {
  const theme = useTheme()
  const router = useRouter()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [mediaUrl, setMediaUrl] = useState('')
  const [dropdownCategories, setDropdownCategories] = useState([])
  const [refreshCategories, setRefreshCategories] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowSelection, setRowSelection] = useState({})
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [imageUploadloader, setImageUploadLoader] = useState(false)

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Subcategory',
        cell: ({ row }) => {
          const name = capitalizeWords(row.original.name)
          const wordCount = name.split(' ').length

          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                {wordCount > 3 || name.length > 15 ? (
                  <Tooltip title={name} arrow placement='top'>
                    <Typography
                      color='text.primary'
                      className='font-medium'
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px',
                        cursor: 'pointer'
                      }}
                    >
                      {name}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography color='text.primary' className='font-medium'>
                    {name}
                  </Typography>
                )}
              </div>
            </div>
          )
        }
      }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <img
              src={row.original.image}
              alt={row.original.name}
              style={{ width: '50px', height: '50px', borderRadius: '8px' }}
            />
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => {
          const category = dropdownCategories.find(cat => cat._id === row.original.category_id)

          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {category ? category.name : 'N/A'}
                </Typography>
              </div>
            </div>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton aria-label='edit' onClick={() => handleEditOpen(row.original)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label='delete' onClick={() => handleDeleteCategory(row.original)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [dropdownCategories]
  )
  const hasFormChanged = values => {
    if (!editingCategory) return true // No need to compare if not editing
    return (
      values.subCategory !== editingCategory.name ||
      values.selectedCategory !== editingCategory.category_id ||
      (values.image && values.image !== editingCategory.image) ||
      (mediaUrl && mediaUrl !== editingCategory.image)
    )
  }
  const formik = useFormik({
    initialValues: {
      subCategory: '',
      image: null,
      imagePreview: null,
      selectedCategory: ''
    },
    validationSchema: Yup.object({
      subCategory: Yup.string()
        .required('Sub-Category name is required')
        .trim()
        .matches(/^[a-zA-Z\s&]*$/, 'Category name can only contain letters, spaces, and ampersand (&)'),
      selectedCategory: Yup.string().required('Please select a category'),
      image: Yup.mixed().test('required', 'Image is required', (value, context) => {
        return editingCategory || value ? true : false
      })
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      if (imageUploadloader) return
      setSubmitting(true)
      if (!hasFormChanged(values)) {
        setSubmitting(false)
        handleClose()
        return
      }
      try {
        const token = localStorage.getItem('token')
        console.log(editingCategory)
        const payload = getPayload(values)
        console.log(payload)
        // const payload = {
        //   subCategoryId: editingCategory?._id,
        //   categoryId: editingCategory?.category_id || values.selectedCategory,
        //   name: values.subCategory,
        //   image: mediaUrl
        // }
        if (Object.keys(payload).length === 0) {
          // If no changes in the payload, close the form and stop submitting
          setSubmitting(false)
          handleClose()
          return
        }
        console.log(editingCategory, values)
        if (editingCategory) {
          await updateSubCategory(payload, token)
          toast.success('Sub-category updated successfully!')
          setEditingCategory(null)
        } else {
          await createSubCategory(payload, token)
          toast.success('Sub-category created successfully!')
        }

        setRefreshCategories(prev => !prev)
        handleClose()
        resetForm()
      } catch (error) {
        toast.error(error.response.data.message)
        console.error('Error creating/updating sub-category:', error)
      } finally {
        setSubmitting(false)
      }
    }
  })
  // const getPayload = values => {
  //   const payload = {}
  //   const isEdititng = Boolean(editingCategory)

  //   if (!isEdititng) {
  //     payload.name = values.subCategory
  //     payload.categoryId = values.selectedCategory
  //     payload.image = mediaUrl
  //   } else {
  //     if (editingCategory.name !== values.subCategory) {
  //       payload.name = values.subCategory
  //     }
  //     if (editingCategory.category_id !== values.selectedCategory) {
  //       payload.category_id = values.selectedCategory
  //     }
  //     if(!mediaUrl !== editingCategory?.image){
  //       payload.image =
  //     }
  //   }
  // }

  const getPayload = values => {
    const payload = {}

    // Check if category is being edited
    const isEditing = Boolean(editingCategory)

    // If not editing, always include name, categoryId, and image for new sub-category
    if (!isEditing) {
      payload.name = values.subCategory
      payload.categoryId = values.selectedCategory
      payload.image = mediaUrl // Assuming mediaUrl is the uploaded image URL
    } else {
      // If editing, check what has changed and only include those fields
      if (editingCategory.name !== values.subCategory) {
        payload.name = values.subCategory
      }

      if (editingCategory.category_id !== values.selectedCategory) {
        payload.categoryId = values.selectedCategory
      }

      if (mediaUrl !== editingCategory?.image) {
        payload.image = mediaUrl
      }

      // Always include subCategoryId when editing
      payload.subCategoryId = editingCategory._id
    }

    return payload
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const [subCategoryResult, categoryResult] = await Promise.all([getAllSubCategory(token), getAllCategories(token)])
      setCategories(subCategoryResult.data)
      setDropdownCategories(categoryResult.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Error fetching data!')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    document.title = 'SubCategory | Ships'
    fetchCategories()
  }, [refreshCategories, fetchCategories])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
    setMediaUrl('')
    setEditingCategory(null) // Reset editing state on close
  }

  const handleImageChange = async e => {
    const file = e.target.files[0]

    try {
      if (file) {
        formik.setFieldValue('image', file)
        const reader = new FileReader()

        reader.onloadend = () => {
          formik.setFieldValue('imagePreview', reader.result)
        }
        reader.readAsDataURL(file)
        const formData = new FormData()
        formData.append('file', file)
        setImageUploadLoader(true)
        const uploadResponse = await uploadImage(formData)
        const mediaUrl = uploadResponse.data.data.fileUrl

        setMediaUrl(mediaUrl)
        setImageUploadLoader(false)
      }
    } catch (error) {
      console.error('Error uploading media:', error)
      toast.error('Error uploading media')
    }
  }

  const handleDeleteCategory = category => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      await deleteSubCategory({ subcategory_id: categoryToDelete._id })
      setRefreshCategories(prev => !prev)
      toast.success('Sub-category deleted successfully!')
    } catch (error) {
      toast.error('Error deleting sub-category!')
      console.error('Error deleting sub-category:', error)
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const handleEditOpen = item => {
    console.log(item)
    setEditingCategory(item)
    setMediaUrl(item.image)
    formik.setFieldValue('subCategory', item.name)
    formik.setFieldValue('selectedCategory', item.category_id)
    formik.setFieldValue('imagePreview', item.image || '')
    formik.setFieldValue('image', item.image)
    setOpen(true)
  }

  const handleCategoryFilterChange = event => {
    setSelectedCategoryFilter(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredCategories = useMemo(() => {
    return selectedCategoryFilter
      ? categories.filter(category => category.category_id === selectedCategoryFilter)
      : categories
  }, [categories, selectedCategoryFilter])

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredCategories.slice(startIndex, endIndex)
  }, [filteredCategories, page, rowsPerPage])

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage
      }
    },
    manualPagination: true,
    pageCount: Math.ceil(filteredCategories.length / rowsPerPage),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const capitalizeWords = sentence => {
    return sentence
      .split(' ') // Split the sentence into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ') // Join the words back into a sentence
  }

  return (
    <>
      <ToastContainer />
      <Box display='flex' justifyContent='space-between' mb={2} flexDirection={isSmallScreen ? 'column' : 'row'}>
        <FormControl style={{ marginBottom: isSmallScreen ? 16 : 0 }}>
          <InputLabel id='category-filter-label'>Category</InputLabel>
          <Select
            labelId='category-filter-label'
            value={selectedCategoryFilter || 'All'}
            onChange={handleCategoryFilterChange}
            label='Filter'
            sx={{ minWidth: 300 }}
            autoWidth={true}
            renderValue={selected => {
              if (selected === '') {
                return <em>All</em>
              }
              const selectedCategory = dropdownCategories.find(category => category._id === selected)
              return selectedCategory ? selectedCategory.name : <em>All</em>
            }}
          >
            <MenuItem value=''>All</MenuItem>
            {dropdownCategories?.map(category => (
              <MenuItem key={category._id} value={category._id}>
                {category?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          onClick={handleClickOpen}
          className='is-full sm:is-auto'
          sx={{ height: 48, width: isSmallScreen ? '100%' : 'auto' }}
        >
          Add New Sub Category
        </Button>
      </Box>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
          <CircularProgress />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
          <Typography variant='h6' color={theme.palette.primary.main}>
            No data available
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxHeight: '450px',
            overflow: 'auto'
          }}
        >
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className='flex items-center cursor-pointer select-none'
                            onClick={header.column.getToggleSortingHandler()}
                            style={{ padding: '12px 24px', borderBottom: '2px solid #f0f0f0' }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={table.getVisibleFlatColumns().length}
                      className='text-center'
                      style={{ padding: '24px' }}
                    >
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} style={{ padding: '12px 24px' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Sub Category' : 'Add New Sub Category'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Name'
              type='text'
              fullWidth
              name='subCategory'
              value={formik.values.subCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subCategory && Boolean(formik.errors.subCategory)}
              helperText={formik.touched.subCategory && formik.errors.subCategory}
            />
            <FormControl fullWidth margin='dense'>
              <InputLabel id='category-select-label'>Category</InputLabel>
              <Select
                labelId='category-select-label'
                id='category-select'
                name='selectedCategory'
                value={formik.values.selectedCategory}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
              >
                {dropdownCategories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <InputLabel style={{ marginTop: 12 }} htmlFor='fileInput'>
              Upload Image
            </InputLabel>
            {formik.values.imagePreview && (
              <Box mt={2} display='flex' justifyContent='center'>
                <img
                  src={formik.values.imagePreview}
                  alt='Preview'
                  style={{ width: 100, height: 100, borderRadius: '8px' }}
                />
              </Box>
            )}
            {formik.touched.image && formik.errors.image && (
              <FormHelperText error>{formik.errors.image}</FormHelperText>
            )}
            <FormControl fullWidth margin='dense'>
              <Button variant='contained' component='label'>
                {imageUploadloader ? 'Loading...' : 'Choose File'}
                <input
                  id='fileInput'
                  accept='image/*'
                  type={imageUploadloader ? '' : 'file'}
                  onChange={e => (imageUploadloader ? '' : handleImageChange(e))}
                  hidden
                />
              </Button>
              {formik.values.image && typeof formik.values.image === 'object' && (
                <FormHelperText>Selected file: {formik.values.image.name}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit' disabled={imageUploadloader}>
              {/* {submitting ? <CircularProgress size={24} /> : 'Save'} */}
              {'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this sub-category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteCategory} color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ProtectedChatPage = () => {
  return (
    <ProtectedRoutes requiredPermission='subcategory'>
      <UserTable />
    </ProtectedRoutes>
  )
}

export default ProtectedChatPage
