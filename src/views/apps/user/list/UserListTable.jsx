import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import Link from 'next/link'

import PetsIcon from '@mui/icons-material/Pets'

import Countup from 'react-countup'

import { AnimatePresence, motion } from 'framer-motion'

import PersonIcon from '@mui/icons-material/Person'

import {
  Box,
  Card,
  CardHeader,
  TablePagination,
  Avatar,
  Button,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  ListItemAvatar,
  IconButton
} from '@mui/material'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

// Next Imports
import EditIcon from '@mui/icons-material/Edit'

import CloseIcon from '@mui/icons-material/Close'

import { ToastContainer, toast } from 'react-toastify'

import { Group, PersonPinCircleOutlined } from '@mui/icons-material'

import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@components/TablePaginationComponent'

import { getusers, blockUser, unblockUser, updatePawPoints, appUserList } from '@/app/api'

import 'react-toastify/dist/ReactToastify.css'

import Unauthorized from '../../../../../Unauthorized'

const UserListTable = () => {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [isBlocking, setIsBlocking] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPets, setSelectedPets] = useState([])
  const [pawEdit, setPawEdit] = useState(false)
  const [editingPawPoints, setEditingPawPoints] = useState(null)
  const [openReferredModal, setOpenReferredModal] = useState(false)
  const [referredUsernames, setReferredUsernames] = useState([])
  const [clicked, setClicked] = useState(false)
  const [openBlockMoadal, setOpenBlockModal] = useState(false)
  const [blockModal, setBlockModal] = useState(false)
  const [alreadyBlockedModules, setAlreadyBlockedModules] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')

  // Animated Placeholder Data
  const [animateData] = useState(['Search users', 'Search content', 'Search posts'])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [editingUser, setEditingUser] = useState(null) // Store the user being edited
  const [pawPointsValue, setPawPointsValue] = useState('') // PawPoints value
  const [openPawPointsModal, setOpenPawPointsModal] = useState(false) // Modal state
  const [userRole, setUserRole] = useState('') //for allowing users to edit or delete
  const [access, setAccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])

  // Function to open the modal and prefill PawPoints
  const handleOpenPawPointsModal = user => {
    setEditingUser(user)
    setPawPointsValue(user.pawPoints || '') // Prefill the current PawPoints value
    setOpenPawPointsModal(true)
  }

  // Function to close the modal
  const handleClosePawPointsModal = () => {
    setEditingUser(null)
    setPawPointsValue('')
    setOpenPawPointsModal(false)
  }

  // Function to handle PawPoints update
  const handleUpdatePawPoints = async () => {
    if (!editingUser) return

    const payload = { pawPoints: pawPointsValue }

    try {
      const response = await updatePawPoints(editingUser.id, payload)
      if (response.status === 200) {
        toast.success('PawPoints updated successfully')
        fetchAllUsers() // Refresh the data
        handleClosePawPointsModal()
      }
    } catch (error) {
      toast.error('Failed to update PawPoints')
    }
  }

  const handleBlockDialogOpen = data => {
    setBlockModal(true)
    try {
      console.log('block', data)
      if (data) {
        setAlreadyBlockedModules(data?.blocked)
        setSelectedUserId(data.id)
      }
    } catch (error) {
      setAlreadyBlockedModules([])
    }
  }

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const response = await appUserList()
      console.log('rr', response.data)
      if (response?.data?.data) {
        console.log('apppp', response.data.data)
        setData(response?.data?.data)
      } else if (response?.status === 403 || response?.data?.message === 'Access denied') {
        toast.error('You are not authorized to access this resource')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % animateData.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [animateData])

  const handleOpenDialog = (user, blocking) => {
    setSelectedUser(user)
    setIsBlocking(blocking)
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setIsBlocking(false)
  }
  const handleOpenPetDialog = pets => {
    setSelectedPets(pets)
    setOpenPetDialog(true)
  }
  const handleEditPawPoints = user => {
    setEditingPawPoints(user.id)
  }

  const handleClosePetDialog = () => {
    setOpenPetDialog(false)
    setSelectedPets([])
  }
  const handleToggleBlockConfirm = async () => {
    const payload = { module: 'ALL' }
    try {
      if (isBlocking) {
        const response = await blockUser(selectedUser.id, payload)
        if (response.data.success) {
          toast.success(`User blocked for the whole app`)
          setData(prevData => prevData.map(u => (u.id === selectedUser.id ? { ...u, blocked: ['ALL'] } : u)))
        }
      } else {
        const response = await unblockUser(selectedUser.id, payload)
        if (response) {
          toast.success(`User unblocked`)
          fetchAllUsers()
        }
      }
    } catch (error) {
      toast.error('Failed to toggle block status')
    }
    handleCloseDialog()
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])
  const globalFilterFn = (row, _, filterValue) => {
    const { name, email, phone } = row.original || {}
    const searchTerm = filterValue.toLowerCase() // Convert filterValue to lowercase for case-insensitive search

    // Safely check if the fields exist and convert them to lowercase if they do, otherwise use an empty string
    return (
      (name ? name.toLowerCase() : '').includes(searchTerm) ||
      (email ? email.toLowerCase() : '').includes(searchTerm) ||
      (phone ? phone.toLowerCase() : '').includes(searchTerm)
    )
  }

  const handleToggleBlock = async user => {
    const payload = { module: 'ALL' }
    try {
      if (user.blocked.length > 0) {
        const response = await unblockUser(user.id, payload)
        if (response) {
          toast.success(`User unblocked`)
          fetchAllUsers()
        }
      } else {
        const response = await blockUser(user.id, payload)
        if (response.data.success) {
          toast.success(`User blocked for the whole app`)
          setData(prevData => prevData.map(u => (u.id === user.id ? { ...u, blocked: ['ALL'] } : u)))
        }
      }
    } catch (error) {
      toast.error('Failed to toggle block status')
    }
  }

  const truncateText = (text, maxLength = 20) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  const handleClick = value => {
    console.log('got', value)
    setPawEdit(true)
    return
  }
  const handlePawPointsChange = async (userId, value) => {
    const user = data?.find(user => user.id === userId)
    if (!user || Number(user.pawPoints) === Number(value)) {
      setEditingPawPoints(null)
      return
    }
    console.log('to', userId, value)
    const payload = {
      pawPoints: value
    }
    try {
      const response = await updatePawPoints(userId, payload)

      // setData(prevData => prevData.map(user => (user.id === userId ? { ...user, pawPoints: value } : user)))
      if (response.status == 200) {
        fetchAllUsers()
        toast.success('PawPoints updated successfully')
        setEditingPawPoints(null)
      }
    } catch (error) {
      toast.error('Failed to update PawPoints')
    }
  }
  const getRowStyle = index => ({
    backgroundColor: index % 2 === 0 ? '#f3f3f3' : '#ffffff', // Alternating row color
    '&:hover': {
      backgroundColor: '#d9e9f7' // Hover color
    }
  })
  const handleOpenReferredModal = users => {
    console.log('opned')
    const usernames = users.map(user => user.name || user.email || 'N/A')
    setReferredUsernames(usernames)
    setOpenReferredModal(true)
  }

  const handleCloseReferredModal = () => {
    setOpenReferredModal(false)
    setReferredUsernames([])
  }
  const handleBlockModalClose = () => {
    setOpenBlockModal(false)
    setBlockModal(false)
  }

  const columns = useMemo(
    () => [
      {
        header: 'User',
        accessorKey: 'name',
        cell: ({ row }) => (
          <Box display='flex' flexDirection='column'>
            <Box display='flex' alignItems='center'>
              <Avatar src={row?.original?.profilePicture || '/default-avatar.png'} alt={row.original.name} />
              <Tooltip title={row?.original?.name || 'N/A'}>
                <Typography variant='body1' sx={{ marginLeft: 2 }}>
                  {truncateText(row.original.name)}
                </Typography>
              </Tooltip>
            </Box>
            <Typography variant='body2' sx={{ marginLeft: 7, color: 'gray' }}>
              Gender: {row?.original?.gender || 'N/A'}
            </Typography>
            <Typography variant='body2' sx={{ marginLeft: 7, color: 'gray' }}>
              DOB: {row.original.dateOfBirth ? new Date(row.original.dateOfBirth).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        )
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => (
          <Tooltip title={row?.original?.email || 'N/A'}>
            <Typography>{truncateText(row.original.email)}</Typography>
          </Tooltip>
        )
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => (
          <Tooltip title={row?.original?.mobile || 'N/A'}>
            <Typography>{truncateText(row.original.mobile)}</Typography>
          </Tooltip>
        )
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => (
          <Tooltip title={row?.original?.mobile || 'N/A'}>
            <Typography>{truncateText(row.original.mobile)}</Typography>
          </Tooltip>
        )
      },

      // {
      //   header: 'Active',
      //   accessorKey: 'active',
      //   cell: ({ row }) => (
      //     <Button
      //       variant='contained'
      //       size='small'
      //       color={row.original.blocked.length > 0 ? 'success' : 'error'}
      //       onClick={() => handleBlockDialogOpen(row.original)}
      //       disabled={userRole !== 'superadmin' && userRole !== 'admin'}
      //     >
      //       {row.original.blocked.length > 0 ? 'Unblock' : 'Block'}
      //     </Button>
      //   )
      // },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <IconButton
            // disabled={userRole !== 'superadmin' && userRole !== 'admin'}
            onClick={() => handleOpenPawPointsModal(row.original)}
            color='primary'
            aria-label='edit paw points'
          >
            <EditIcon />
          </IconButton>
        )
      }
    ],
    [editingPawPoints, userRole]
  )

  const blockModules = ['veterinary', 'community', 'shop', 'match', 'all']

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter }, // This connects the global filter to the table state
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn // Adding custom global filter function
  })

  // const handleBlock = async () => {
  //   try {
  //     // API payload
  //     const payload = {
  //       // userId: selectedUser.id, // Assuming `selectedUser` contains the user's ID
  //       blockedModules: alreadyBlockedModules
  //     }

  //     console.log('Saving blocked modules:', payload)
  //     console.log(selectedUserId)

  //     // Call the API to update blocked modules
  //     const response = await blockUser(selectedUserId, payload)

  //     if (response.status === 200) {
  //       toast.success('Blocked modules updated successfully')
  //       fetchAllUsers() // Refresh the user list after successful API call
  //       handleBlockModalClose() // Close the modal
  //     } else {
  //       toast.error('Failed to update blocked modules')
  //     }
  //   } catch (error) {
  //     console.error('Error saving blocked modules:', error)
  //     toast.error('An error occurred while saving blocked modules')
  //   }
  // }
  const handleBlock = async () => {
    try {
      // Identify modules to block (newly added to `alreadyBlockedModules`)
      const blockResponse = await blockUser(selectedUserId, {
        blockedModules: alreadyBlockedModules // Pass modules to block
      })

      console.log('REsonss', blockResponse)

      if (blockResponse.status === 200) {
        toast.success(`Updated successfully`)
      } else {
        toast.error(`Failed to block modules`)
      }

      // Refresh user list after updates
      fetchAllUsers()
      handleBlockModalClose()
    } catch (error) {
      console.error('Error updating modules:', error)
      toast.error('An error occurred while updating modules')
    }
  }

  return (
    <>
      <ToastContainer />
      <Card>
        <CardHeader
          avatar={<Group color='primary' fontSize='large' />} // Icon before title
          title='App Users'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'View and Edit '}
        />
        <Box display='flex' p={3} justifyContent='space-between'>
          <CustomTextField
            value={globalFilter ?? ''}
            onClick={() => {
              setClicked(true)
            }}
            onBlur={() => {
              setClicked(false)
            }}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder=''
            InputProps={{
              startAdornment: (
                <>
                  {!clicked ? (
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        width: '200px'
                      }}
                    >
                      <AnimatePresence>
                        <motion.div
                          key={animateData[currentIndex]}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 0, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 120,
                            damping: 14
                          }}
                          style={{
                            fontSize: '16px',
                            color: 'rgba(0, 0, 0, 0.6)',
                            position: 'absolute',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {animateData[currentIndex]}
                        </motion.div>
                      </AnimatePresence>
                    </Box>
                  ) : null}
                </>
              )
            }}
          />
        </Box>
        <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr
                  key={headerGroup.id}
                  style={{
                    backgroundColor: '#E0E0E0,',
                    '&:hover': {
                      backgroundColor: '#E0E0E0', // Hover effect
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
                      cursor: 'pointer',
                      '& td': {
                        transform: 'scale(0.9)', // Zoom-out effect
                        transition: 'transform 0.1  s ease'
                      }
                    }
                  }}
                >
                  {headerGroup.headers.map(header => (
                    <th
                      style={{
                        color: 'black', // White text

                        borderBottom: '2px solid #ddd' // Border for separation
                      }}
                      key={header.id}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              style={{
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
            >
              {table.getRowModel().rows.map(row => (
                <tr
                  // style={{
                  //   backgroundColor: '#E0E0E0,',
                  //   '&:hover': {
                  //     backgroundColor: '#E0E0E0', // Hover effect
                  //     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
                  //     cursor: 'pointer',
                  //     '& td': {
                  //       transform: 'scale(0.95)', // Zoom-out effect
                  //       transition: 'transform 0.3s ease'
                  //     }
                  //   }
                  // }}
                  style={{
                    backgroundColor: '',
                    transition: 'transform 0.3s ease',

                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget.style.transform = 'scale(0.95)'),
                      (e.currentTarget.style.backgroundColor = '#E0E0E0')
                    e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget.style.backgroundColor = 'white'),
                      (e.currentTarget.style.boxShadow = 'none'),
                      (e.currentTarget.style.transform = 'scale(1)')
                  }}
                  key={row.id}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
      <Dialog open={''} onClose={handleCloseDialog}>
        <DialogTitle>{isBlocking ? 'Block User' : 'Unblock User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to {isBlocking ? 'block' : 'unblock'} this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleToggleBlockConfirm} color='secondary'>
            {isBlocking ? 'Block' : 'Unblock'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReferredModal} onClose={handleCloseReferredModal}>
        <DialogTitle>Referred Users</DialogTitle>
        <DialogContent>
          <DialogContentText>List of users referred by this user:</DialogContentText>
          <List>
            {referredUsernames.map((username, index) => (
              <ListItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: index % 2 === 0 ? 'grey.100' : 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    transition: 'background-color 0.3s ease'
                  }
                }}
                key={index}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={username}
                  primaryTypographyProps={{
                    fontWeight: 'light',
                    fontSize: '1rem'
                  }}
                />
              </ListItem>
            ))}
          </List>
          <IconButton
            aria-label='close'
            onClick={handleCloseReferredModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>

      <Dialog open={blockModal} onClose={handleBlockModalClose}>
        <DialogTitle>Manage Blocked Modules</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Below are the modules the user is already blocked in. You can add or remove blocks as needed.
          </DialogContentText>
          <List>
            {blockModules.map((module, index) => {
              const isBlocked = alreadyBlockedModules.includes(module)
              return (
                <ListItem key={index} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isBlocked}
                        onChange={e => {
                          const updatedModules = e.target.checked
                            ? [...alreadyBlockedModules, module]
                            : alreadyBlockedModules.filter(m => m !== module)
                          setAlreadyBlockedModules(updatedModules) // Update state
                        }}
                      />
                    }
                    label={
                      <ListItemText
                        primary={module}
                        secondary={isBlocked ? 'Currently Blocked' : 'Not Blocked'}
                        primaryTypographyProps={{ style: { fontWeight: isBlocked ? 'bold' : 'normal' } }}
                      />
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBlockModalClose} color='secondary'>
            Cancel
          </Button>

          <Button
            onClick={() => {
              handleBlock()
            }}
            color='primary'
            variant='contained'
          >
            Save Changess
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPawPointsModal} onClose={handleClosePawPointsModal}>
        <DialogTitle>Edit PawPoints</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update PawPoints for <strong>{editingUser?.name}</strong>
          </DialogContentText>
          <TextField
            fullWidth
            label='PawPoints'
            type='number'
            value={pawPointsValue}
            onChange={e => setPawPointsValue(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePawPointsModal} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleUpdatePawPoints} color='primary' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserListTable
