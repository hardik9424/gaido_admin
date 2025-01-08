'use client'
export const dynamicParams = true
import React, { useEffect, useState, useCallback } from 'react'

import Link from 'next/link'

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  TablePagination
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PostPage = () => {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState([
    { _id: '1', thought: 'Sample Post 1', media: '', community: { name: 'Community 1' }, user: { name: 'User 1' } },
    { _id: '2', thought: 'Sample Post 2', media: '', community: { name: 'Community 2' }, user: { name: 'User 2' } }
  ])
  const [newPost, setNewPost] = useState({ name: '', media: '', community: '' })
  const [mediaName, setMediaName] = useState('')
  const [communities, setCommunities] = useState([
    { _id: '1', name: 'Community 1' },
    { _id: '2', name: 'Community 2' }
  ])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setNewPost({ name: '', media: '', community: '' })
    setMediaName('')
    setMediaUrl('')
    setEditingPost(null)
  }, [])

  const handleChange = useCallback(e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (!newPost.community || !mediaUrl) {
      toast.error('Please select a community and upload an image or video')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        _id: new Date().toISOString(),
        thought: newPost.name,
        media: mediaUrl,
        community: communities.find(comm => comm._id === newPost.community),
        user: { name: 'Your User Name' }
      }

      if (editingPost) {
        setPosts(prev =>
          prev.map(post => (post._id === editingPost._id ? { ...post, ...payload, media: mediaUrl } : post))
        )
        toast.success('Post updated successfully')
      } else {
        setPosts(prev => [payload, ...prev])
        toast.success('Post created successfully')
      }

      handleClose()
    } catch (error) {
      toast.error('Failed to create/update post')
    } finally {
      setSubmitting(false)
    }
  }, [newPost, mediaUrl, handleClose, editingPost, communities])

  const handleMediaChange = e => {
    const file = e.target.files[0]
    if (file) {
      setMediaName(file.name)
      setMediaUrl(URL.createObjectURL(file))
    }
  }

  const handleEdit = post => {
    setNewPost({ name: post.thought, media: post.media, community: post.community._id })
    setMediaName(post.media.split('/').pop())
    setMediaUrl(post.media)
    setEditingPost(post)
    setOpen(true)
  }

  const handleDelete = () => {
    setPosts(posts.filter(post => post._id !== postIdToDelete))
    toast.success('Post deleted successfully')
    setDeleteDialogOpen(false)
  }

  const openDeleteDialog = postId => {
    setPostIdToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setPostIdToDelete(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const renderMedia = mediaUrl => {
    if (mediaUrl?.match(/\.(jpeg|jpg|gif|png)$/)) {
      return <img src={mediaUrl} alt='media' width='100' height='100' style={{ objectFit: 'cover' }} />
    } else if (mediaUrl?.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <video width='100' height='100' controls>
          <source src={mediaUrl} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )
    } else {
      return 'No Image'
    }
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto' }}>
      <ToastContainer />
      <Button variant='contained' color='warning' onClick={handleOpen} sx={{ mt: 2, mb: 2 }}>
        Add New Post
      </Button>
      <Paper sx={{ mt: 4, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Media</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Community</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Posted By</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post, index) => (
              <TableRow key={index}>
                <TableCell>{renderMedia(post.media)}</TableCell>
                <TableCell>
                  <Link href={`post/${post._id}`}>
                    <Typography variant='body2'>{post?.thought}</Typography>
                  </Link>
                </TableCell>
                <TableCell>{post?.community?.name}</TableCell>
                <TableCell>{post?.user?.name}</TableCell>
                <TableCell>
                  <Box display='flex'>
                    <IconButton onClick={() => handleEdit(post)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => openDeleteDialog(post._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={posts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin='dense'
            label='Thought'
            type='text'
            fullWidth
            name='name'
            value={newPost.name}
            onChange={handleChange}
          />
          <FormControl variant='outlined' fullWidth margin='normal'>
            <InputLabel>Community</InputLabel>
            <Select name='community' value={newPost.community} onChange={handleChange} label='Community'>
              {communities.map(community => (
                <MenuItem key={community._id} value={community._id}>
                  {community.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InputLabel style={{ marginTop: 12 }}>Upload Image or Video</InputLabel>
          {mediaUrl && (
            <Box mt={2} display='flex' justifyContent='center'>
              {renderMedia(mediaUrl)}
            </Box>
          )}
          {mediaName && (
            <Box mt={1}>
              <Typography variant='body2'>Selected file: {mediaName}</Typography>
            </Box>
          )}
          <Button variant='contained' component='label' color='warning' style={{ marginTop: 10 }}>
            Choose File
            <input accept='image/*,video/*' type='file' onChange={handleMediaChange} hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='warning' disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : editingPost ? 'Update Post' : 'Add Post'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth='sm' fullWidth>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='warning'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PostPage
