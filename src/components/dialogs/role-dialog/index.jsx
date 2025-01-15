// 'use client'

// // React Imports
// import { useState, useEffect } from 'react'

// // MUI Imports
// import Dialog from '@mui/material/Dialog'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import Typography from '@mui/material/Typography'
// import Checkbox from '@mui/material/Checkbox'
// import FormGroup from '@mui/material/FormGroup'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import DialogActions from '@mui/material/DialogActions'
// import Button from '@mui/material/Button'

// import CloseIcon from '@mui/icons-material/Close'

// import { Select, MenuItem, InputLabel, FormControl, Checkbox as MUICheckbox, ListItemText, Box } from '@mui/material'

// //api imports
// import { getAllPermissions, createRole } from '@/app/api'

// // Component Imports
// import DialogCloseButton from '../DialogCloseButton'
// import CustomTextField from '@core/components/mui/TextField'

// // Style Imports
// import tableStyles from '@core/styles/table.module.css'

// const defaultData = [
//   'User Management',
//   'Content Management',
//   'Disputes Management',
//   'Database Management',
//   'Financial Management',
//   'Reporting',
//   'API Control',
//   'Repository Management',
//   'Payroll'
// ]

// const RoleDialog = ({ open, setOpen, title }) => {
//   // States
//   const [permissionsList, setPermissionsList] = useState([])
//   const [roleName, setRoleName] = useState('') // Role name
//   const [selectedPermissions, setSelectedPermissions] = useState([]) // Store selected permissions
//   const [assignedPermissions, setAssignedPermissions] = useState([]) // Permissions already assigned to the role

//   const [selectedCheckbox, setSelectedCheckbox] = useState([])

//   const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)

//   const fetchPermissions = async () => {
//     try {
//       const response = await getAllPermissions()
//       console.log('per', response.data.data)
//       if (response.status && response.data) {
//         setPermissionsList(response.data.data) // Populate permissions list
//       }
//     } catch (error) {
//       console.error('Error fetching permissions:', error)
//     }
//   }
//   const handlePermissionChange = event => {
//     setSelectedPermissions(event.target.value) // Update selected permissions
//   }
//   const availablePermissions = permissionsList.filter(permission => !assignedPermissions.includes(permission._id))
//   useEffect(() => {
//     if (open) {
//       fetchPermissions()
//     }
//   }, [open])

//   const handleClose = () => {
//     setOpen(false)
//   }

//   const togglePermission = id => {
//     const arr = selectedCheckbox

//     if (selectedCheckbox.includes(id)) {
//       arr.splice(arr.indexOf(id), 1)
//       setSelectedCheckbox([...arr])
//     } else {
//       arr.push(id)
//       setSelectedCheckbox([...arr])
//     }
//   }

//   // const handleSelectAllCheckbox = () => {
//   //   if (isIndeterminateCheckbox) {
//   //     setSelectedCheckbox([])
//   //   } else {
//   //     defaultData.forEach(row => {
//   //       const id = (typeof row === 'string' ? row : row.title).toLowerCase().split(' ').join('-')

//   //       togglePermission(`${id}-read`)
//   //       togglePermission(`${id}-edit`)
//   //       togglePermission(`${id}-create`)
//   //     })
//   //   }
//   // }
//   const handleSelectAllCheckbox = () => {
//     if (isIndeterminateCheckbox || selectedCheckbox.length === permissionsList.length * 3) {
//       setSelectedCheckbox([])
//     } else {
//       const allPermissions = permissionsList
//         .map(permission => {
//           const id = permission.name.toLowerCase().split(' ').join('-')
//           return [`${id}-read`, `${id}-edit`, `${id}-create`]
//         })
//         .flat()
//       setSelectedCheckbox(allPermissions)
//     }
//   }

//   useEffect(() => {
//     if (selectedCheckbox.length > 0 && selectedCheckbox.length < permissionsList.length * 3) {
//       setIsIndeterminateCheckbox(true)
//     } else {
//       setIsIndeterminateCheckbox(false)
//     }
//   }, [selectedCheckbox])

//   const formatPermissions = () => {
//     const permissionActions = selectedCheckbox.reduce((acc, checkboxId) => {
//       const [id, action] = checkboxId.split('-')
//       const permissionId = permissionsList.find(
//         permission => permission.name.toLowerCase().split(' ').join('-') === id
//       )?._id

//       if (permissionId) {
//         const existingPermission = acc.find(permission => permission.permission === permissionId)
//         if (existingPermission) {
//           existingPermission[action] = true
//         } else {
//           acc.push({ permission: permissionId, [action]: true })
//         }
//       }
//       return acc
//     }, [])

//     console.log('lists', permissionActions)

//     return permissionActions
//   }
//   const handleSubmit = async () => {
//     try {
//       const permissions = formatPermissions()
//       const data = {
//         name: roleName,
//         permissions: permissions
//       }
//       console.log('send data', data)
//       const response = await createRole(data)
//       if (response.status) {
//         console.log('Role created successfully:', response.data)
//         setOpen(false) // Close dialog on
//         fetchPermissions()
//       } else {
//         console.error('Error creating role:', response.message)
//       }
//     } catch (error) {
//       console.error('Error submitting role:', error)
//     }
//   }

//   return (
//     <Dialog
//       fullWidth
//       maxWidth='md'
//       scroll='body'
//       open={open}
//       onClose={handleClose}
//       sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
//     >
//       <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
//         <i className='tabler-x' />
//       </DialogCloseButton>
//       <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
//         {title ? 'Edit Role' : 'Add Role'}
//         <Typography component='span' className='flex flex-col text-center'>
//           Set Role Permissions
//         </Typography>
//       </DialogTitle>
//       <form onSubmit={e => e.preventDefault()}>
//         <DialogContent className='overflow-visible flex flex-col gap-6 pbs-0 sm:pli-16'>
//           <CustomTextField
//             label='Role Name'
//             variant='outlined'
//             fullWidth
//             placeholder='Enter Role Name'
//             // defaultValue={title}
//             value={roleName}
//             onChange={e => setRoleName(e.target.value)}
//           />

//           <Typography variant='h5' className='min-is-[225px]'>
//             Role Permissions
//           </Typography>
//           <div className='overflow-x-auto'>
//             <table className={tableStyles.table}>
//               <tbody>
//                 {permissionsList?.map((item, index) => {
//                   const id = item.name.toLowerCase().split(' ').join('-')
//                   return (
//                     <tr key={index} className='border-be'>
//                       <td className='pis-0 flex items-center gap-2'>
//                         {/* {item?.nam ? <CloseIcon fontSize='small' /> : null} */}
//                         {console.log('titile', title)}
//                         <Typography
//                           className='font-medium whitespace-nowrap flex-grow min-is-[225px]'
//                           color='text.primary'
//                         >
//                           {item.name}
//                         </Typography>
//                       </td>
//                       <td className='!text-end pie-0'>
//                         <FormGroup className='flex-row justify-end flex-nowrap gap-6'>
//                           <FormControlLabel
//                             className='mie-0'
//                             control={
//                               <Checkbox
//                                 id={`${id}-read`}
//                                 onChange={() => togglePermission(`${id}-read`)}
//                                 checked={selectedCheckbox.includes(`${id}-read`)}
//                               />
//                             }
//                             label='Read'
//                           />
//                           <FormControlLabel
//                             className='mie-0'
//                             control={
//                               <Checkbox
//                                 id={`${id}-edit`}
//                                 onChange={() => togglePermission(`${id}-edit`)}
//                                 checked={selectedCheckbox.includes(`${id}-edit`)}
//                               />
//                             }
//                             label='Edit'
//                           />
//                           <FormControlLabel
//                             className='mie-0'
//                             control={
//                               <Checkbox
//                                 id={`${id}-create`}
//                                 onChange={() => togglePermission(`${id}-create`)}
//                                 checked={selectedCheckbox.includes(`${id}-create`)}
//                               />
//                             }
//                             label='Create'
//                           />
//                         </FormGroup>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </DialogContent>
//         <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
//           <Button variant='contained' type='submit' onClick={handleSubmit}>
//             Submit
//           </Button>
//           <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   )
// }

// export default RoleDialog

'use client'

// React Imports
import { useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Checkbox as MUICheckbox
} from '@mui/material'

// Icon Imports
import CloseIcon from '@mui/icons-material/Close'

// API Imports
import { getAllPermissions, createRole } from '@/app/api'

const RoleDialog = ({ open, setOpen, title }) => {
  // States
  const [permissionsList, setPermissionsList] = useState([]) // Available permissions
  const [selectedPermissions, setSelectedPermissions] = useState([]) // Selected permissions
  const [roleName, setRoleName] = useState('') // Role name

  const [permissionActions, setPermissionActions] = useState({}) // Permission action states (read, edit, create)

  // Fetch permissions from API
  const fetchPermissions = async () => {
    try {
      const response = await getAllPermissions()

      if (response.status === 200) {
        setPermissionsList(response.data.data) // Populate permissions list
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  useEffect(() => {
    if (open) {
      fetchPermissions()
    }
  }, [open])

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false)
    setSelectedPermissions([])
    setRoleName('')
    setPermissionActions({})
  }

  // Handle selecting a permission from the dropdown
  const handlePermissionSelect = event => {
    const { value } = event.target
    setSelectedPermissions(value)

    // Add default actions (read, edit, create) for new selections
    const updatedActions = { ...permissionActions }
    value.forEach(permissionId => {
      if (!updatedActions[permissionId]) {
        updatedActions[permissionId] = { read: false, edit: false, create: false }
      }
    })
    setPermissionActions(updatedActions)
  }

  // Handle toggling permission actions
  const togglePermissionAction = (permissionId, action) => {
    setPermissionActions(prev => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [action]: !prev[permissionId][action]
      }
    }))
  }

  // Handle removing a selected permission
  const handlePermissionRemove = permissionId => {
    setSelectedPermissions(prev => prev.filter(id => id !== permissionId))
    setPermissionActions(prev => {
      const updatedActions = { ...prev }
      delete updatedActions[permissionId]
      return updatedActions
    })
  }

  // Format permissions for API
  const formatPermissions = () => {
    return selectedPermissions.map(permissionId => ({
      permission: permissionId,
      ...permissionActions[permissionId]
    }))
  }

  // Handle submitting the role
  const handleSubmit = async () => {
    try {
      const formattedPermissions = formatPermissions()
      const data = {
        name: roleName,
        permissions: formattedPermissions,
        isDeleted: false
      }

      const response = await createRole(data)
      if (response.status === 200) {
        toast.success(response.data.message)
        console.log('Role created successfully:', response.data)
        setOpen(false)
        fetchPermissions()
      } else {
        toast.error(response.data.message)
        console.error('Error creating role:', response.message)
      }
    } catch (error) {
      console.error('Error submitting role:', error)
    }
  }

  return (
    <>
      <ToastContainer />
      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle>
          {'Add Role'}
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Typography variant='h6'>Role Details</Typography>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role Name</InputLabel>
              <OutlinedInput
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder='Enter role name'
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={selectedPermissions}
                onChange={handlePermissionSelect}
                input={<OutlinedInput />}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map(id => {
                      const permission = permissionsList.find(perm => perm._id === id)
                      return (
                        <Chip key={id} label={permission?.name || id} onDelete={() => handlePermissionRemove(id)} />
                      )
                    })}
                  </Box>
                )}
              >
                {permissionsList?.map(permission => (
                  <MenuItem key={permission._id} value={permission._id}>
                    <MUICheckbox checked={selectedPermissions.includes(permission._id)} />
                    <ListItemText primary={permission.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant='h6'>Permission Actions</Typography>
            {selectedPermissions.map(permissionId => {
              const permission = permissionsList.find(perm => perm._id === permissionId)
              return (
                <Box key={permissionId} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ flex: 1 }}>{permission?.name}</Typography>
                  <FormGroup row>
                    {['read', 'edit', 'create'].map(action => (
                      <FormControlLabel
                        key={action}
                        control={
                          <Checkbox
                            checked={permissionActions[permissionId]?.[action] || false}
                            onChange={() => togglePermissionAction(permissionId, action)}
                          />
                        }
                        label={action.charAt(0).toUpperCase() + action.slice(1)}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoleDialog
