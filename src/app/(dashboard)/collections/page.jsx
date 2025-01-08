'use client'

import React, { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  CardHeader
} from '@mui/material'
import { Edit, Delete, Collections } from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { createCollection, deleteCollection, getAllCollections, updateCollection, uploadImage } from '@/app/api'

const CollectionsTable = () => {
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('') // "add" or "edit"
  const [currentCategory, setCurrentCategory] = useState({ id: '', title: '', image: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [userRole, setUserRole] = useState('')
  const fetchAllCollections = async () => {
    try {
      const response = await getAllCollections()
      console.log('get', response)
      if (response.status === 200) {
        //     const categoriesData = response.data.data.categories.map(item => ({
        //       id: item.node.id,
        //       title: item.node.title || 'n/a',
        //       image: item?.node?.image?.src || 'n/a'
        //     }))
        //     setCategories(categoriesData)
        //   }
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])

  const handleDialogOpen = (type, category = {}) => {
    setDialogType(type)
    setCurrentCategory(category)
    setImagePreview(category.image || null)
    setSelectedImage(null)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setCurrentCategory({ id: '', title: '', image: '' })
    setImagePreview(null)
    setSelectedImage(null)
  }

  useEffect(() => {
    fetchAllCollections()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // const handleDialogOpen = (type, category = {}) => {
  //   setDialogType(type)
  //   setCurrentCategory(category)
  //   setImagePreview(category.image || null)
  //   setSelectedImage(null) // Reset selected image
  //   setOpenDialog(true)
  // }

  // const handleDialogClose = () => {
  //   setOpenDialog(false)
  //   setCurrentCategory({ id: '', title: '', image: '' })
  //   setImagePreview(null)
  //   setSelectedImage(null)
  // }

  const handleImageChange = async event => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadImage(formData)
      console.log('image', response)
      if (response?.data?.data?.fileUrl) {
        setCurrentCategory(prev => ({ ...prev, image: response.data.data.fileUrl }))
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
    }
  }

  const handleSave = async () => {
    if (!currentCategory.title || !currentCategory.image) {
      toast.error('Please provide both title and image URL.')
      return
    }

    setSubmitting(true)

    try {
      if (dialogType === 'add') {
        const response = await createCollection(currentCategory)
        if (response.status === 200) {
          toast.success('Collection Created')
          fetchAllCollections()
        } else {
          toast.error('Failed Creating Collection')
        }
      } else if (dialogType === 'edit') {
        const editResponse = await updateCollection(currentCategory)
        if (editResponse.status === 200) {
          toast.success('Collection Updated')
          fetchAllCollections()
        } else {
          toast.error('Error updating Collection')
        }
      }
      fetchAllCollections()
      handleDialogClose()
    } catch (error) {
      console.error('Error saving collection:', error)
      toast.error('Error saving collection')
    } finally {
      setSubmitting(false)
    }
  }

  // const handleDelete = async id => {
  //   const payload = {
  //     id: id
  //   }
  //   try {
  //     await deleteCollection(payload) // Replace with actual delete API
  //     fetchAllCollections()
  //   } catch (error) {
  //     console.error('Error deleting collection:', error)
  //   }
  // }
  const handleDelete = async () => {
    try {
      await deleteCollection({ id: deleteId })
      toast.success('Collection Deleted')
      fetchAllCollections()
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Error deleting collection')
    } finally {
      setConfirmDialogOpen(false)
      setDeleteId(null)
    }
  }
  const openConfirmDialog = id => {
    setDeleteId(id)
    setConfirmDialogOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setDeleteId(null)
  }

  return (
    <>
      <ToastContainer />
      <Box sx={{ padding: 4, maxWidth: '1200px', margin: 'auto' }}>
        <CardHeader
          avatar={<Collections color='primary' fontSize='large' />} // Icon before title
          title='Collection Managment'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'Create or Edit Collections'}
        />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant='contained' color='primary' onClick={() => handleDialogOpen('add')} sx={{ marginBottom: 2 }}>
            Add Collection
          </Button>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Image</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
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
                    key={category.id}
                  >
                    <TableCell>{category?.title}</TableCell>
                    <TableCell>
                      <img
                        src={category?.image?.src || 'n/a'}
                        alt={category?.title}
                        style={{ width: '50px', height: '50px', borderRadius: '8px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <TableCell>
                        <IconButton
                          disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                          color=''
                          onClick={() => handleDialogOpen('edit', category)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                          color='secondary'
                          onClick={() => openConfirmDialog(category.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            count={categories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{dialogType === 'add' ? 'Add Collection' : 'Edit Collection'}</DialogTitle>
          <DialogContent>
            <TextField
              label='Title'
              fullWidth
              margin='normal'
              value={currentCategory.title}
              onChange={e => setCurrentCategory(prev => ({ ...prev, title: e.target.value }))}
            />
            <Button variant='contained' component='label' sx={{ marginBottom: 2 }} fullWidth>
              Upload Image
              <input type='file' accept='image/*' hidden onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <Box mt={2}>
                <Typography variant='body2'>Image Preview:</Typography>
                <img src={imagePreview} alt='Preview' style={{ width: '100%', maxHeight: '200px' }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSave} color='primary' disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this collection?</DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>Cancel</Button>
            <Button onClick={handleDelete} color='secondary'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default CollectionsTable
