import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Tooltip,
  CardHeader,
  Box,
  TextField,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions
} from '@mui/material'

import { PostAdd } from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { blockUser, unblockUser } from '@/app/api'
import UserListCards from '@/views/apps/user/list/UserListCards'

const PostTable = ({ posts, handleEdit, handleDelete }) => {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)


  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const truncateText = (text, maxLength = 30) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const toggleBlockUser = async (post, userid) => {
    try {
      setLoading(true)
      const data = { module: 'community' }

      if (post.active) {
        await blockUser(userid, data)
        toast.success(`${post.user} has been successfully blocked from Community`)
      } else {
        await unblockUser(userid, data)
        toast.success(`${post.user} has been successfully unblocked from Community`)
      }

      post.active = !post.active
    } catch (error) {
      toast.error('Error while toggling block/unblock status')
    } finally {
      setLoading(false)
    }
  }

  const filteredData = posts?.filter(post => {
    return (
      post.user.toLowerCase().includes(debounceSearch?.toLowerCase()) ||
      post.content.toLowerCase().includes(debounceSearch?.toLowerCase())
    )
  })

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleOpenConfirmDialog = post => {
    setSelectedPost(post)
    setOpenConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setSelectedPost(null)
    setOpenConfirmDialog(false)
  }
  const handleConfirmBlock = async () => {
    if (!selectedPost) return
    try {
      setLoading(true)
      const data = { module: 'community' }

      if (selectedPost.active) {
        await blockUser(selectedPost.user_id, data)
        toast.success(`${selectedPost.user} has been successfully blocked from Community`)
      } else {
        await unblockUser(selectedPost.user_id, data)
        toast.success(`${selectedPost.user} has been successfully unblocked from Community`)
      }

      selectedPost.active = !selectedPost.active
    } catch (error) {
      toast.error('Error while toggling block/unblock status')
    } finally {
      setLoading(false)
      handleCloseConfirmDialog()
    }
  }

  return (
    <>
      {/* <UserListCards />s */}
      <CardHeader
        avatar={<PostAdd color='primary' fontSize='large' />} // Icon before title
        title='Posts'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'View or Edit Posts'}
      />
      <ToastContainer />
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          variant='outlined'
          placeholder='Search by user or content'
          fullWidth
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>No. of Comments</TableCell>
              <TableCell>No. of Likes</TableCell>
              <TableCell>No. of Reports</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(post => (
              <TableRow key={post.id}>
                <TableCell>
                  <Avatar
                    src={post?.profilePicture || '/default-avatar.png'}
                    alt={post?.user}
                    sx={{ marginRight: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={post?.user}>{post?.user}</Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={post?.content}>
                    <Link href={`community/${post.id}`}>{truncateText(post.content)}</Link>
                  </Tooltip>
                </TableCell>
                <TableCell>{post.noOfComments}</TableCell>
                <TableCell>{post.noOfLikes}</TableCell>
                <TableCell>{post.noOfReports}</TableCell>
                <TableCell>
                  <Button
                    variant='h3'
                    // onClick={() => toggleBlockUser(post, post.user_id)}
                    onClick={() => handleOpenConfirmDialog(post)}
                    // disabled={loading}
                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    sx={{
                      backgroundColor: post.active ? 'red' : 'green',
                      color: 'white',
                      ':hover': {
                        backgroundColor: post.active ? 'red' : 'green'
                      }
                    }}
                  >
                    {post.active ? 'Block' : 'Unblock'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <TablePagination
        component='div'
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{selectedPost?.active ? 'Confirm Block' : 'Confirm Unblock'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedPost?.active ? 'block' : 'unblock'} <strong>{selectedPost?.user}</strong>{' '}
            from Community?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color='secondary'>
            Cancel
          </Button>
          <Button
            disabled={userRole !== 'superadmin' && userRole !== 'admin'}
            onClick={handleConfirmBlock}
            color='primary'
            variant='contained'
            // disabled={loading}
          >
            {selectedPost?.active ? 'Block' : 'Unblock'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PostTable
