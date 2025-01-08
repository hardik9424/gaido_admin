'use client'

import React, { useState, useEffect } from 'react'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  CardHeader
} from '@mui/material'

import { useFormik } from 'formik'
import { Edit, Delete, PeopleAltTwoTone, Visibility, VisibilityOff } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'

import 'react-toastify/dist/ReactToastify.css'
import { getAllRoles, getAllAdminsUsers, createAdminUser, deleteAdminUser, editAdminUserDetails } from '@/app/api'

const AdminUserTable = () => {
  const theme = useTheme()
  const [dropdownRoles, setDropdownRoles] = useState([])
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [userIdToEdit, setUserIdToEdit] = useState(null) // Store the ID of the user being edited
  const [editFormValues, setEditFormValues] = useState({ role: '' }) // Role to edit
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [erros, setErrors] = useState({})
  const [editedRole, setEditedRole] = useState('')
  const [editUserDetailsDialogOpen, setEditUserDetailsDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [userDetailsToEdit, setUserDetailsToEdit] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  })

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev)
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

  const validate = () => {
    const tempErrors = {}
    const { firstName, lastName, email, mobile, role, password } = formik.values

    if (!firstName) {
      tempErrors.firstName = 'First Name is required'
    }
    if (!lastName) {
      tempErrors.lastName = 'Last Name is required'
    }
    if (!email) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid'
    }
    if (!mobile) {
      tempErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(mobile)) {
      tempErrors.mobile = 'Mobile number is invalid'
    }
    if (!role) {
      tempErrors.role = 'Role is required'
    }
    if (!password) {
      tempErrors.password = 'Password is required'
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be greater than 8 characters'
    }

    setErrors(tempErrors) // Update component state with the validation errors
    return Object.keys(tempErrors).length === 0 // Return true if no errors
  }
  const handleEditUserDetailsSubmit = async () => {
    console.log('ud', userIdToEdit)
    setLoading(true)
    try {
      const payload = {
        userId: userIdToEdit, // Include user ID
        name: `${userDetailsToEdit.firstName} ${userDetailsToEdit.lastName}`,
        mobile: userDetailsToEdit.mobile,
        email: userDetailsToEdit.email,
        password: userDetailsToEdit.password
      }
      console.log('payload', payload)

      // Include password only if it's provided
      // if (userDetailsToEdit.password) {
      //   payload.password = userDetailsToEdit.password
      // }

      const response = await editAdminUserDetails(payload)
      console.log('API Response:', response)

      toast.success('User details updated successfully')
      fetchAdminUsers() // Refresh the admin users list
      setEditUserDetailsDialogOpen(false) // Close dialog
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchAdminUsers()
  }, [])
  const handleEditUserDetailsOpen = user => {
    console.log('opned', user)
    setUserIdToEdit(user._id) // Store user ID for the edit
    const [firstName, lastName] = user.name.split(' ')
    setUserDetailsToEdit({
      firstName,
      lastName,
      email: user.email,
      mobile: user.mobileNumber,
      password: user.password
    })
    setEditUserDetailsDialogOpen(true)
  }

  const fetchRoles = async () => {
    setRolesLoading(true)
    setLoading(true)
    try {
      const result = await getAllRoles()
      setDropdownRoles(result.data.data.data)
    } catch (error) {
      toast.error('Error fetching roles')
    } finally {
      setRolesLoading(false)
      setLoading(false)
    }
  }

  const fetchAdminUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllAdminsUsers()
      setAdminUsers(response?.data?.data)

      console.log('ud', response.data)
    } catch (error) {
      toast.error('Error fetching admin users')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = event => {
    const { name, values } = e.target
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      role: ''
    },
    onSubmit: async (values, { resetForm }) => {
      if (!validate()) return
      setLoading(true)
      try {
        const payload = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          roleId: values.role
        }

        await createAdminUser(payload)
        toast.success('Admin user created successfully')
        fetchAdminUsers()
        resetForm()
      } catch (error) {
        toast.error('Failed to create admin user')
      } finally {
        setLoading(false)
      }
    }
  })

  const handleEditOpen = user => {
    console.log('clicking', user)
    setEditedRole(user?.role)
    setEditFormValues({ role: user?.role })
    setUserIdToEdit(user._id) // Store user ID for the edit
    setEditDialogOpen(true) // Open the edit dialog
  }

  const handleEditSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        roleIds: editFormValues.role
      }

      await editUser(userIdToEdit, payload) // Call the editUser API
      toast.success('Admin user role updated successfully')
      fetchAdminUsers()
      setEditDialogOpen(false) // Close dialog on success
    } catch (error) {
      toast.error('Failed to update admin user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const data = {
        userId: userIdToDelete
      }

      const response = await deleteAdminUser(data)
      if (response.status === 200) {
        toast.success('Admin user deleted successfully')
        fetchAdminUsers()
      } else {
        toast.error('Failed to delete admin user')
      }
    } catch (error) {
      toast.error('Failed to delete admin user')
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => setRowsPerPage(parseInt(event.target.value, 10))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 1200,
        margin: 'auto',
        mt: 4
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(255, 165, 0, 0.2)'
          }}
        />
      )}

      <ToastContainer />
      <CardHeader
        avatar={<PeopleAltTwoTone color='primary' fontSize='large' />} // Icon before title
        title='Create User'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'Create Admin User'}
      />

      <Paper sx={{ padding: theme.spacing(4), width: '100%', marginBottom: 4 }}>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='First Name'
                name='firstName'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={!!erros.firstName} // Display error style if there's an error
                helperText={erros.firstName} // Show error message if available
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='Last Name'
                name='lastName'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={!!erros.lastName} // Display error style if there's an error
                helperText={erros.lastName} // Show error message if available
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='Email'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                error={!!erros.email}
                helperText={erros.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='Mobile Number'
                name='mobile'
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={!!erros.mobile}
                helperText={erros.mobile}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='Password'
                type='password'
                name='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                error={!!erros.password}
                helperText={erros.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel id='role-select-label'>Role</InputLabel>
                <Select
                  labelId='role-select-label'
                  id='role-select'
                  name='role'
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label='Role'
                  disabled={rolesLoading}
                  error={!!erros.role}
                  helperText={erros.role}
                >
                  {dropdownRoles.map(role => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            // style={{ backgroundColor: '#FFA500' }}
            style={{
              background: 'linear-gradient(90deg, #11817B, #031B1A)',
              color: 'white', // Ensure the text is visible on the gradient
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px', // Optional: Add some rounding
              transition: 'all 0.3s ease' // Smooth transition for the hover effect
            }}
            variant='contained'
            fullWidth
            type='submit'
            sx={{ mt: 2 }}
            onMouseEnter={e => {
              e.target.style.background = 'linear-gradient(90deg, #031B1A, #11817B)' // Change gradient on hover
            }}
            onMouseLeave={e => {
              e.target.style.background = 'linear-gradient(90deg, #11817B, #031B1A)' // Revert back to original gradient
            }}

            // disabled={loading}
            // disabled={userRole !== 'superadmin' && userRole !== 'admin'}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Admin User'}
          </Button>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ width: '100%', marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Read/Write</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
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
                key={user.id}
              >
                <TableCell>{user?.name}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.mobile}</TableCell>
                <TableCell>{user?.role}</TableCell>
                {/* <TableCell>{user?.role !== 'superadmin' && user?.role !== 'admin' ? 'Read' : 'Write'}</TableCell> */}
                <TableCell>
                  <IconButton
                    // disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleEditOpen(user)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    // disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                    onClick={() => handleEditUserDetailsOpen(user)}
                  >
                    <PeopleAltTwoTone />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setUserIdToDelete(user._id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={adminUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this admin user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Admin User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin='normal'>
            <InputLabel id='edit-role-select-label'>Role</InputLabel>
            <Select
              labelId='edit-role-select-label'
              value={editFormValues?.role}
              onChange={e => setEditFormValues({ ...editFormValues, role: e.target.value })}
              label='Role'
              disabled={rolesLoading}
            >
              {dropdownRoles.map(role => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editUserDetailsDialogOpen} onClose={() => setEditUserDetailsDialogOpen(false)}>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='First Name'
                value={userDetailsToEdit.firstName}
                onChange={e => setUserDetailsToEdit({ ...userDetailsToEdit, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin='normal'
                label='Last Name'
                value={userDetailsToEdit.lastName}
                onChange={e => setUserDetailsToEdit({ ...userDetailsToEdit, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin='normal'
                label='Email'
                value={userDetailsToEdit.email}
                onChange={e => setUserDetailsToEdit({ ...userDetailsToEdit, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin='normal'
                label='Password'
                value={userDetailsToEdit.password}
                onChange={e => setUserDetailsToEdit({ ...userDetailsToEdit, password: e.target.value })}
                placeholder='**********'
                type={passwordVisible ? 'text' : 'password'}
              />
              <IconButton
                edge='end'
                onClick={togglePasswordVisibility}
                disabled={userDetailsToEdit.password === ''}
                aria-label='toggle password visibility'
              >
                {passwordVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin='normal'
                label='Mobile Number'
                value={userDetailsToEdit.mobile}
                onChange={e => setUserDetailsToEdit({ ...userDetailsToEdit, mobile: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDetailsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditUserDetailsSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save Changess'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUserTable
