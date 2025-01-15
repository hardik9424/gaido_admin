// 'use client'

// import React, { useState, useEffect } from 'react'

// import { useFormik } from 'formik'
// import {
//   Paper,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   OutlinedInput,
//   Chip,
//   Box,
//   CircularProgress,
//   Typography,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   TablePagination,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   LinearProgress,
//   CardHeader
// } from '@mui/material'
// import { ToastContainer, toast } from 'react-toastify'

// import { Edit, Delete, Add, PermIdentity } from '@mui/icons-material'

// import UserListCards from './cards'

// import RoleCards from '../../../../views/apps/roles/RoleCards'

// import 'react-toastify/dist/ReactToastify.css'
// import { getAllPermission, createRole, getAllRoles, deleteRole, editRole } from '@/app/api'
// import ProtectedRoutes from '@/components/ProtectedRoute'

// const CreateRolePage = () => {
//   const [availablePermissions, setAvailablePermissions] = useState([])
//   const [roles, setRoles] = useState([])
//   const [submitting, setSubmitting] = useState(false)
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(5)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [addPermissionDialogOpen, setAddPermissionDialogOpen] = useState(false)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // State for delete confirmation dialog
//   const [selectedRole, setSelectedRole] = useState({})
//   const [permissionsToAdd, setPermissionsToAdd] = useState([])
//   const [roleToDelete, setRoleToDelete] = useState(null) // Role to be deleted
//   const [loading, setLoading] = useState(false)
//   const [listOfPermission, setListOfPermission] = useState([])

//  const [userRole, setUserRole] = useState('')

//  useEffect(() => {
//    const userRole = localStorage.getItem('user')
//    if (userRole) {
//      const parsedData = JSON.parse(userRole)
//      setUserRole(parsedData.role)
//    } else {
//      setUserRole('')
//    }
//  }, [])

//  useEffect(() => {
//    setLoading(true)
//    const fetchPermissionsAndRoles = async () => {
//      try {
//        const permissionsResponse = await getAllPermission()
//        setAvailablePermissions(permissionsResponse?.data?.data)
//        fetchRoles()
//      } catch (error) {
//        toast.error('Failed to fetch data')
//      } finally {
//        setLoading(false)
//      }
//    }
//    fetchPermissionsAndRoles()
//  }, [])
//  // const handleAddPermissionToRole = selectedIds => {
//  //   const updatedPermissions = availablePermissions
//  //     .filter(permission => selectedIds.includes(permission.id)) // Filter selected permissions
//  //     .map(permission => ({ id: permission.id, name: permission.name })) // Ensure we get both ID and name

//  //   setPermissionsToAdd(updatedPermissions)
//  // }
//  const handleAddPermissionToRole = selectedIds => {
//    const updatedPermissions = availablePermissions
//      .filter(permission => selectedIds.includes(permission.id)) // Filter selected permissions
//      .map(permission => ({ id: permission.id, name: permission.name })) // Include both ID and name

//    // Avoid duplicates by merging with the current list
//    const mergedPermissions = [
//      ...selectedRole.permissions.map(id => ({
//        id,
//        name: availablePermissions.find(permission => permission.id === id)?.name
//      })),
//      ...updatedPermissions.filter(newPermission => !selectedRole.permissions.includes(newPermission.id))
//    ]

//    setPermissionsToAdd(mergedPermissions)
//  }

//  const fetchRoles = async () => {
//    try {
//      const rolesResponse = await getAllRoles()
//      setRoles(rolesResponse?.data?.data)
//    } catch (error) {
//      toast.error('Failed to fetch roles')
//    }
//  }

//  const formik = useFormik({
//    initialValues: {
//      role: '',
//      permissions: []
//    },
//    onSubmit: async values => {
//      setLoading(true)
//      setSubmitting(true)
//      try {
//        const roleData = {
//          roleName: values.role,
//          permissionIds: values.permissions // Sending only IDs
//        }
//        await createRole(roleData)
//        toast.success('Role created successfully')
//        fetchRoles()
//        formik.resetForm()
//      } catch (error) {
//        toast.error('Failed to create role')
//      } finally {
//        setSubmitting(false)
//        setLoading(false)
//      }
//    }
//  })

//  const handleAddPermissionOpen = role => {
//    setSelectedRole(role)
//    setPermissionsToAdd([])
//    setAddPermissionDialogOpen(true)
//  }

//  const handleAddPermission = async () => {
//    setSubmitting(true)
//    try {
//      const updatedPermissionIds = [...selectedRole.permissions, ...permissionsToAdd]
//      await editRole({ id: selectedRole.id, roleName: selectedRole.name, permissionIds: updatedPermissionIds })
//      toast.success('Permissions added successfully')
//      fetchRoles()
//      setAddPermissionDialogOpen(false)
//    } catch (error) {
//      toast.error('Failed to add permissions')
//    } finally {
//      setSubmitting(false)
//    }
//  }

//  const handleEditOpen = role => {
//    setSelectedRole({
//      id: role.id,
//      name: role.name,
//      permissions: role.permissions ? role.permissions.map(p => p.id) : [] // Store IDs instead of names
//    })
//    setEditDialogOpen(true)
//    setPermissionsToAdd([]) // Clear the permissions to add in case user adds new ones
//  }

//  // For removing permissions from the role
//  const handleRemovePermission = permissionId => {
//    setSelectedRole(prevRole => ({
//      ...prevRole,
//      permissions: prevRole.permissions.filter(id => id !== permissionId) // Remove permission from selectedRole
//    }))
//  }

//  // const handleAddPermissionToRole = permissionId => {
//  //   setPermissionsToAdd(prev => {
//  //     ;[...prev, permissionId]
//  //   })
//  //   console.log(permissionId)
//  //   // Avoid adding duplicate permissions
//  //   if (!selectedRole.permissions.includes(permissionId)) {
//  //     setSelectedRole(prevRole => ({
//  //       ...prevRole,
//  //       permissions: [...prevRole.permissions, permissionId]
//  //     }))
//  //   }
//  // }

//  // const handleEditRoleSubmit = async () => {
//  //   setSubmitting(true)
//  //   setLoading(true)
//  //   try {
//  //     // Submit the updated permissions (both removed and added)
//  //     await editRole({
//  //       id: selectedRole.id,
//  //       roleName: selectedRole.name,
//  //       permissionIds: selectedRole.permissions // Send updated permission list
//  //     })
//  //     toast.success('Role updated successfully')
//  //     fetchRoles()
//  //     setEditDialogOpen(false) // Close dialog after success
//  //   } catch (error) {
//  //     toast.error('Failed to update role')
//  //   } finally {
//  //     setSubmitting(false)
//  //     setLoading(false)
//  //   }
//  // }

//  // Handle delete role button click
//  const handleEditRoleSubmit = async () => {
//    setSubmitting(true)
//    setLoading(true)
//    try {
//      // Merge existing and new permissions
//      const allPermissions = [
//        ...new Set([
//          ...selectedRole.permissions, // Existing permissions
//          ...permissionsToAdd.map(permission => permission.id) // Newly added permissions
//        ])
//      ]

//      const payload = {
//        id: selectedRole.id,
//        roleName: selectedRole.name,
//        permissionIds: allPermissions // Send merged permissions
//      }

//      await editRole(payload) // API call
//      toast.success('Role updated successfully')
//      fetchRoles()
//      setEditDialogOpen(false) // Close dialog
//    } catch (error) {
//      toast.error('Failed to update role')
//    } finally {
//      setSubmitting(false)
//      setLoading(false)
//    }
//  }

//  const handleDeleteOpen = role => {
//    setRoleToDelete(role)
//    setDeleteDialogOpen(true) // Open the confirmation dialog
//  }

//  // Confirm deletion
//  const handleDeleteRole = async () => {
//    setLoading(true)
//    if (roleToDelete) {
//      setSubmitting(true)
//      try {
//        await deleteRole(roleToDelete.id) // Call the deleteRole API
//        toast.success('Role deleted successfully')
//        fetchRoles() // Refresh the roles list
//        setDeleteDialogOpen(false) // Close the confirmation dialog
//      } catch (error) {
//        toast.error('Failed to delete role')
//      } finally {
//        setSubmitting(false)
//        setLoading(false)
//      }
//    }
//  }
//  const handleRemovePermissionFromCreate = id => {
//    formik.setFieldValue(
//      'permissions',
//      formik.values.permissions.filter(permissionId => permissionId !== id)
//    )
//  }

//  return (
//    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 1200, margin: '0 auto', padding: 2 }}>
//      {loading && (
//        <LinearProgress
//          sx={{
//            position: 'fixed',
//            top: 0,
//            left: 0,
//            right: 0,
//            zIndex: 1200,
//            backgroundColor: 'rgba(255, 165, 0, 0.2)'
//          }}
//        />
//      )}
//      <ToastContainer />
//      {/* <UserListCards /> */}
//      {/* <RoleCards /> */}
//      <CardHeader
//        avatar={<PermIdentity color='primary' fontSize='large' />} // Icon before title
//        title='Create Role'
//        titleTypographyProps={{
//          variant: 'h5', // Set the text size
//          color: 'textPrimary', // Optional: Change text color
//          fontWeight: 'bold' // Optional: Make it bold
//        }}
//        subheader={'Create Admin User Roles '}
//      />

//      <form onSubmit={formik.handleSubmit}>
//        <TextField
//          label='Role Name'
//          variant='outlined'
//          name='role'
//          value={formik.values.role}
//          onChange={formik.handleChange}
//          fullWidth
//        />
//        {/* <FormControl fullWidth sx={{ mt: 2 }}>
//           <InputLabel id='permission-label'>Permissions</InputLabel>
//           <Select
//             labelId='permission-label'
//             id='permission'
//             multiple
//             name='permissions'
//             value={formik.values.permissions}
//             onChange={formik.handleChange}
//             input={<OutlinedInput id='select-multiple-chip' label='Permissions' />}
//             renderValue={selected => (
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                 {selected.map(value => (
//                   <Chip key={value} label={availablePermissions.find(perm => perm.id === value)?.name || value} />
//                 ))}
//               </Box>
//             )}
//           >
//             {availablePermissions.map(permission => (
//               <MenuItem key={permission.id} value={permission.id}>
//                 {permission.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl> */}
//        <FormControl fullWidth sx={{ mt: 2 }}>
//          <InputLabel id='permission-label'>Permissions</InputLabel>
//          <Select
//            labelId='permission-label'
//            id='permission'
//            multiple
//            name='permissions'
//            value={formik.values.permissions} // Selected permissions
//            onChange={formik.handleChange} // Handle adding permissions
//            input={<OutlinedInput id='select-multiple-chip' label='Permissions' />}
//            renderValue={selected => (
//              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                {selected.map(value => {
//                  const permission = availablePermissions.find(perm => perm.id === value)
//                  return (
//                    <Chip
//                      key={value}
//                      label={permission?.name || value}
//                      onDelete={() => handleRemovePermissionFromCreate(value)} // Cross icon handler
//                    />
//                  )
//                })}
//              </Box>
//            )}
//          >
//            {availablePermissions.map(permission => (
//              <MenuItem key={permission.id} value={permission.id}>
//                {permission.name}
//              </MenuItem>
//            ))}
//          </Select>
//        </FormControl>

//        <Button
//          disabled={userRole !== 'superadmin' && userRole !== 'admin'}
//          variant='contained'
//          sx={{ backgroundColor: '#ff9c1e', mt: 2 }}
//          type='submit'
//          //  disabled={submitting}
//        >
//          {submitting ? <CircularProgress size={24} /> : 'Create Role'}
//        </Button>
//      </form>

//      <TableContainer component={Paper} sx={{ mt: 4 }}>
//        <Table>
//          <TableHead>
//            <TableRow>
//              <TableCell>Role Name</TableCell>
//              <TableCell>Permissions</TableCell>
//              <TableCell>Actions</TableCell>
//            </TableRow>
//          </TableHead>
//          <TableBody>
//            {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(role => (
//              <TableRow
//                sx={{
//                  backgroundColor: '#E0E0E0,',
//                  '&:hover': {
//                    backgroundColor: '#E0E0E0', // Hover effect
//                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
//                    cursor: 'pointer',
//                    '& td': {
//                      transform: 'scale(0.95)', // Zoom-out effect
//                      transition: 'transform 0.3s ease'
//                    }
//                  }
//                }}
//                key={role.id}
//              >
//                <TableCell>{role?.name}</TableCell>
//                <TableCell>{role?.permissions?.map(p => p.name).join(', ')}</TableCell>
//                <TableCell>
//                  <IconButton
//                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
//                    onClick={() => handleEditOpen(role)}
//                  >
//                    <Edit />
//                  </IconButton>

//                  <IconButton
//                    disabled={userRole !== 'superadmin' && userRole !== 'admin'}
//                    onClick={() => handleDeleteOpen(role)}
//                  >
//                    <Delete />
//                  </IconButton>
//                </TableCell>
//              </TableRow>
//            ))}
//          </TableBody>
//        </Table>
//        <TablePagination
//          rowsPerPageOptions={[5, 10, 25]}
//          component='div'
//          count={roles.length}
//          rowsPerPage={rowsPerPage}
//          page={page}
//          onPageChange={(event, newPage) => setPage(newPage)}
//          onRowsPerPageChange={event => setRowsPerPage(parseInt(event.target.value, 10))}
//        />
//      </TableContainer>

//      {/* Delete Confirmation Dialog */}
//      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//        <DialogTitle>Delete Role</DialogTitle>
//        <DialogContent>
//          <Typography>
//            Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>?
//          </Typography>
//        </DialogContent>
//        <DialogActions>
//          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//          <Button onClick={handleDeleteRole} disabled={submitting}>
//            {submitting ? <CircularProgress size={24} /> : 'Delete'}
//          </Button>
//        </DialogActions>
//      </Dialog>

//      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
//        <DialogTitle>Edit Role</DialogTitle>
//        {/* <Typography>Edit Role</Typography> */}
//        <DialogContent>
//          <TextField
//            label='Role Name'
//            variant='outlined'
//            name='role'
//            value={selectedRole.name}
//            onChange={e => setSelectedRole({ ...selectedRole, name: e.target.value })}
//            fullWidth
//            sx={{ mb: 2, mt: 2 }}
//          />

//          {/* Display the list of current permissions with a "remove" option */}
//          <Box sx={{ mb: 4 }}>
//            <Typography variant='subtitle1'>Current Permissions</Typography>
//            {selectedRole?.permissions?.length === 0 ? (
//              <Typography>No permissions assigned</Typography>
//            ) : (
//              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                {selectedRole?.permissions?.map(permissionId => {
//                  const permission = availablePermissions.find(p => p.id === permissionId)

//                  return (
//                    <Chip
//                      key={permissionId}
//                      label={permission?.name}
//                      onDelete={() => handleRemovePermission(permissionId)}
//                      sx={{ mb: 1 }}
//                    />
//                  )
//                })}
//              </Box>
//            )}
//          </Box>

//          {/* Select to add new permissions */}
//          <FormControl fullWidth>
//            <InputLabel id='add-permission-label'>Add Permissions</InputLabel>
//            <Select
//              labelId='add-permission-label'
//              value={permissionsToAdd.map(permission => permission.id)} // Map to IDs for Select value
//              onChange={e => handleAddPermissionToRole(e.target.value)}
//              input={<OutlinedInput label='Add Permissions' />}
//              multiple
//              renderValue={selectedIds => (
//                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                  {selectedIds.map(id => {
//                    const permission = availablePermissions.find(p => p.id === id)
//                    return <Chip key={id} label={permission?.name || id} />
//                  })}
//                </Box>
//              )}
//            >
//              {availablePermissions.map(permission => (
//                <MenuItem key={permission.id} value={permission.id}>
//                  {permission.name}
//                </MenuItem>
//              ))}
//            </Select>
//          </FormControl>
//        </DialogContent>
//        <DialogActions>
//          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//          <Button onClick={handleEditRoleSubmit} disabled={submitting}>
//            {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
//          </Button>
//        </DialogActions>
//      </Dialog>
//    </Box>
//  )
// }

// export default CreateRolePage

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import RoleCards from '@/views/apps/roles/RoleCards'
import RolesTable from '@/views/apps/roles/RolesTable'

const Roles = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' className='mbe-1'>
          Roles List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that depending on assigned role an administrator
          can have access to what he need
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RoleCards />
      </Grid>
      <Grid item xs={12} className='!pbs-12'>
        <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>
        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
      </Grid>
      <Grid item xs={12}>
        <RolesTable />
      </Grid>
    </Grid>
  )
}

export default Roles
