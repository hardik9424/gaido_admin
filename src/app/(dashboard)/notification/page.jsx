'use client'

import React, { useEffect, useState, useCallback } from 'react'

import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox
} from '@mui/material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import CustomTextField from '@core/components/mui/TextField'
import { getAllUsers, sendNotification } from '../../api'

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

const NotificationPage = () => {
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers()
      console.log('users', response)
      if (response.status === 200) {
        setUsers(response?.data?.data)
      }
    } catch (error) {
      toast.error('error')
      setUsers([])
    }
  }
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const imageUpload = async () => {
    try {
      uploadImage()
    } catch (error) {}
  }

  const handleSelectAllClick = event => {
    console.log(event.target.checked)
    if (event.target.checked) {
      const filteredUsers = users
        .filter(user => user?.name?.toLowerCase().includes(globalFilter.toLowerCase()))
        .map(user => user.id)
      setSelectedUsers(filteredUsers)
      const newSelectedUsers = filteredUsers?.map(user => user.id)
      setSelectedUsers(filteredUsers)
    } else {
      setSelectedUsers([])
    }
  }

  // const handleCheckboxClick = (event, id) => {
  //   const selectedIndex = selectedUsers?.indexOf(id)
  //   let newSelectedUsers = []

  //   if (selectedIndex === -1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers, id)
  //   } else if (selectedIndex === 0) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1))
  //   } else if (selectedIndex === selectedUsers.length - 1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1))
  //   } else if (selectedIndex > 0) {
  //     newSelectedUsers = newSelectedUsers.concat(
  //       selectedUsers.slice(0, selectedIndex),
  //       selectedUsers.slice(selectedIndex + 1)
  //     )
  //   }

  //   setSelectedUsers(newSelectedUsers)
  // }
  const handleCheckboxClick = (event, id) => {
    event.stopPropagation() // Prevent row click from triggering

    // Toggle the user's selection
    setSelectedUsers(
      prevSelected =>
        prevSelected.includes(id)
          ? prevSelected.filter(userId => userId !== id) // Deselect user
          : [...prevSelected, id] // Select user
    )
  }

  const isSelected = id => selectedUsers.indexOf(id) !== -1

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // const handleSubmit = async event => {
  //   event.preventDefault()

  //   // Get the title and message values from the form
  //   const title = event.target.title.value // Use the 'name' attribute from the TextField
  //   const message = event.target.message.value

  //   if (!title || !message) {
  //     toast.error('Please provide both title and message.')
  //     return
  //   }

  //   if (selectedUsers.length === 0) {
  //     toast.error('Please select at least one user to send a notification.')
  //     return
  //   }

  //   setSubmitting(true)

  //   // Prepare data for the API call
  //   const data = {
  //     title,
  //     message,
  //     userIds: selectedUsers
  //   }

  //   try {
  //     console.log('data', data)
  //     const response = await sendNotification(data)

  //     if (response.status === 200) {
  //       toast.success('Notification sent successfully')
  //       setSelectedUsers([]) // Clear selected users
  //       event.target.reset() // Clear form fields
  //     } else {
  //       toast.error('Failed to send notification.')
  //     }
  //   } catch (error) {
  //     console.error('Error sending notification:', error)
  //     toast.error('Error sending notification')
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }
  const handleSubmit = async event => {
    event.preventDefault()
    console.log('uid', selectedUsers)

    // Get the title and message values from the form
    const title = event.target.title.value // Use the 'name' attribute from the TextField
    const message = event.target.message.value

    if (!title || !message) {
      toast.error('Please provide both title and message.')
      return
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user to send a notification.')
      return
    }

    setSubmitting(true)

    // Extract FCM tokens of selected users
    const selectedUserDetails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => ({
        userId: user.id,
        fcmToken: user.fcmToken
      }))
    const validUsers = selectedUserDetails.filter(user => user.fcmToken)
    if (validUsers.length === 0) {
      toast.error('No valid FCM tokens available for selected users.')
      setSubmitting(false)
      return
    }

    // Prepare data for the API call
    const data = {
      title,
      message,
      users: validUsers
    }

    try {
      console.log('Notification payload:', data)
      const response = await sendNotification(data)

      if (response.status === 200) {
        toast.success('Notification sent successfully')
        setSelectedUsers([]) // Clear selected users
        event.target.reset() // Clear form fields
      } else {
        toast.error('Failed to send notification.')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('Error sending notification')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingUsers) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <Box sx={{ paddingBottom: 6 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search User'
        />
      </Box>

      <ToastContainer />
      <Typography variant='h5' gutterBottom>
        Send Notification
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length <
                            users?.filter(user => user?.name?.toLowerCase().includes(globalFilter.toLowerCase())).length
                        }
                        checked={
                          users?.filter(user => user?.name?.toLowerCase().includes(globalFilter.toLowerCase())).length >
                            0 &&
                          selectedUsers.length ===
                            users.filter(user => user?.name?.toLowerCase().includes(globalFilter.toLowerCase())).length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all users' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Users</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter(user => user?.name?.toLowerCase().includes(globalFilter.toLowerCase()))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(user => {
                      const isItemSelected = isSelected(user.id)
                      return (
                        <TableRow
                          key={user.id}
                          hover
                          role='checkbox'
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isItemSelected}
                              onChange={event => handleCheckboxClick(event, user.id)}
                              inputProps={{ 'aria-labelledby': user.id }}
                            />
                          </TableCell>
                          <TableCell component='th' id={user._id} scope='row'>
                            {user?.name}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component='div'
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth margin='normal' label='Title' name='title' />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth margin='normal' label='Message' name='message' multiline rows={4} />
                </Grid>
                <Grid item xs={12}>
                  <Button color='primary' variant='contained' fullWidth type='submit' disabled={submitting}>
                    {submitting ? <CircularProgress size={24} /> : 'Send Notification'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default NotificationPage
