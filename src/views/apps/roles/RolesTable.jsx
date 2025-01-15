'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  ListItemText,
  Select
} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import { styled } from '@mui/material/styles'


import CloseIcon from '@mui/icons-material/Close'
// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { deleteAdminRole, deleteRole, editRoles, getAllPermissions, getAllRoles } from '@/app/api'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import { Delete, Recycling } from '@mui/icons-material'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const userRoleObj = {
  admin: { icon: 'tabler-crown', color: 'primary' },
  author: { icon: 'tabler-device-desktop', color: 'error' },
  editor: { icon: 'tabler-edit', color: 'warning' },
  maintainer: { icon: 'tabler-chart-pie', color: 'info' },
  subscriber: { icon: 'tabler-user', color: 'success' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const RolesTable = () => {
  // States
  const [alreadyAssignedRoles, setAlreadyAssignedRoles] = useState([])
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [role, setRole] = useState('')
  const [permissionsList, setPermissionsList] = useState([])
  const [roleName, setRoleName] = useState('')

  const [rowSelection, setRowSelection] = useState({})
  const [selectedPermissions, setSelectedPermissions] = useState([]) // Store selected permissions

  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [openEditModal, setEditModalOpen] = useState(false)
  const [permissionToAdd, setPermissionToAdd] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState('') // Add state for selected roleId
  const [permissionIds, setPermissionIds] = useState([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false) // State for confirmation dialog
  const [deleteId, setDeleteId] = useState('')

  // Hooks
  const { lang: locale } = useParams()
  const fetchRoles = async () => {
    try {
      // Fetch data from API
      const response = await getAllRoles()
      console.log('rolesl', response.data.data.data)
      if (response.status === 200) {
        setData(response.data.data.data)
        // setAlreadyAssignedRoles(response.data.data.permissions)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await getAllPermissions()
      console.log('per', response.data.data)
      if (response.status && response.data) {
        setPermissionsList(response.data.data) // Populate permissions list
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  // Handle selecting a permission
  // const handlePermissionSelect = permission => {
  //   console.log('select', permission)
  //   setSelectedPermissions(prev => [
  //     ...prev,
  //     { ...permission, read: false, edit: false, create: false } // Add read, edit, create actions to each permission
  //   ])
  //   setPermissionToAdd(prev => [...prev, permission])
  // }
  const handlePermissionSelect = permission => {
    console.log('alreadyAssignedRoles:', alreadyAssignedRoles)

    // Check if the permission is already in permissionToAdd or alreadyAssignedRoles to avoid duplicates
    const isAlreadyAdded = [
      ...permissionToAdd,
      ...alreadyAssignedRoles.map(role => role.permission) // Use the permission ObjectId from alreadyAssignedRoles
    ].some(permId => permId === permission._id) // Compare by _id

    // If the permission is not already added, add it to the permissionToAdd state
    if (!isAlreadyAdded) {
      setPermissionToAdd(prev => [
        ...prev,
        { ...permission, read: false, edit: false, create: false } // Add read, edit, create actions to each permission
      ])
    }
  }

  // Handle removing selected permission

  // const handlePermissionRemove = permissionId => {
  //   // Remove permission from the permissionToAdd list
  //   const updatedPermissions = permissionToAdd.filter(permission => permission._id !== permissionId)
  //   setPermissionToAdd(updatedPermissions) // Update the state with the new list

  //   // Re-add the removed permission to the permissionsList only if it's not already there
  //   const removedPermission = permissionToAdd.find(permission => permission._id === permissionId)

  //   if (removedPermission) {
  //     // Check if permission already exists in permissionsList to avoid duplicates
  //     if (!permissionsList.some(permission => permission._id === removedPermission._id)) {
  //       setPermissionsList(prev => [...prev, removedPermission])
  //     }
  //   }
  // }
  const handlePermissionRemove = permissionId => {
    // Remove permission from the permissionToAdd list
    const updatedPermissions = permissionToAdd.filter(permission => permission._id !== permissionId)
    setPermissionToAdd(updatedPermissions)

    // Re-add the removed permission to the permissionsList only if it's not already there
    const removedPermission = permissionToAdd.find(permission => permission._id === permissionId)
    if (removedPermission) {
      // Check if permission already exists in permissionsList to avoid duplicates
      if (!permissionsList.some(permission => permission._id === removedPermission._id)) {
        setPermissionsList(prev => [...prev, removedPermission])
      }
    }
  }

  // Fetch roles data
  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])
  // const handleSubmit = async () => {
  //   console.log('ar', alreadyAssignedRoles)
  //   // Create the final permissions list
  //   const updatedPermissions = [
  //     ...permissionToAdd.map(permission => ({
  //       _id: permission._id, // Use _id for the new permissions
  //       read: permission.read,
  //       edit: permission.edit,
  //       create: permission.create
  //     }))
  //   ]

  //   // Prepare the payload for the API call, adding roleId and name
  //   const payload = {
  //     roleId: selectedRoleId, // Assuming `selectedRoleId` is the ID of the role being edited or updated
  //     name: roleName, // The role name
  //     permissionsToAdd: updatedPermissions // The list of permissions with their actions (read, edit, create, delete)
  //   }

  //   console.log('Payload to be sent:', payload)

  //   try {
  //     // Call the API to edit the role
  //     const response = await editRoles(payload)
  //     if (response.status === 200) {
  //       console.log('Role updated successfully:', response.data)
  //       // Optionally, close the modal or reset state
  //       setEditModalOpen(false)
  //       // Re-fetch roles or handle the UI updates
  //       fetchRoles() // Fetch roles again if needed
  //     } else {
  //       console.error('Error updating role:', response.message)
  //     }
  //   } catch (error) {
  //     console.error('Error submitting role:', error)
  //   }
  // }
  const handlePermissionActionChange = (permissionId, action) => {
    console.log(permissionId, action)
    // Update the permission's action (read, edit, create) in permissionToAdd
    setAlreadyAssignedRoles(prev =>
      prev.map(
        perm =>
          perm.permission === permissionId
            ? {
                ...perm,
                [action]: !perm[action] // Toggle the action (read, edit, create)
              }
            : perm // Leave other permissions unchanged
      )
    )
  }

  // const handleSubmit = async () => {
  //   console.log('Submitting updated permissions:', permissionToAdd)

  //   // Prepare the payload for the API call
  //   const updatedPermissions = [
  //     ...permissionToAdd.map(permission => ({
  //       _id: permission._id, // Use _id for the new permissions
  //       read: permission.read,
  //       edit: permission.edit,
  //       create: permission.create,
  //       delete: permission.delete // Assuming you also want to add the delete permission
  //     }))
  //   ]

  //   const payload = {
  //     roleId: selectedRoleId, // Assuming `selectedRoleId` is the ID of the role being edited or updated
  //     name: roleName, // The role name
  //     permissionsToAdd: updatedPermissions // The list of permissions with their actions (read, edit, create, delete)
  //   }

  //   console.log('Payload to be sent:', payload)

  //   try {
  //     // Call the API to edit the role
  //     if (updatedPermissions.length > 0) {
  //     }
  //     const response = await editRoles(payload)
  //     if (response.status === 200) {
  //       console.log('Role updated successfully:', response.data)
  //       setEditModalOpen(false)
  //       fetchRoles() // Re-fetch roles again if needed
  //     } else {
  //       console.error('Error updating role:', response.message)
  //     }
  //   } catch (error) {
  //     console.error('Error submitting role:', error)
  //   }
  // }
  const handleSubmit = async () => {
    // console.log('Submitting updated permissions:', permissionToAdd, alreadyAssignedRoles, selectedCheckbox)
    console.log('ids', permissionIds)
    if (permissionIds.length > 0) {
      try {
        const response = await deleteRole({ roleId: selectedRoleId, permissionIds: permissionIds })
        if (response.status === 200) {
          toast.success(response.data.message)
          setEditModalOpen(false)
          fetchRoles()
          return
        }
      } catch (error) {
        toast.error(error.message)
        return
      }
    }

    // Prepare the payload for the API call by filtering permissions with any changed action (read, edit, create)
    const updatedPermissions = permissionToAdd
      .filter(permission => permission.read || permission.edit || permission.create) // Only include permissions with changes
      .map(permission => ({
        _id: permission._id, // Use _id for the new permissions
        read: permission.read,
        edit: permission.edit,
        create: permission.create
      }))

    const alreadyAdded = alreadyAssignedRoles.map(permission => ({
      _id: permission.permission,
      read: permission.read,
      edit: permission.edit,
      create: permission.create
    }))

    // if (updatedPermissions.length === 0) {
    //   console.log('No changes to permissions.')
    //   return // If no changes, don't submit anything
    // }

    const payload = {
      roleId: selectedRoleId, // The ID of the role being edited
      name: roleName, // The name of the role
      permissionsToAdd: updatedPermissions // The list of modified permissions
    }
    const previousPayload = {
      roleId: selectedRoleId, // The ID of the role being edited
      name: roleName, // The name of the role
      permissionsToAdd: alreadyAdded // The list of modified permissions
    }

    console.log('Payload to be sent:', payload)

    try {
      // Call the API to update the role

      const response = await editRoles(previousPayload)
      if (response.status === 200) {
        console.log('Role updated successfully:', response.data)
        setEditModalOpen(false)
        fetchRoles()
      }
    } catch (error) {
      console.error('Error submitting role:', error)
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Role Name',
        cell: ({ getValue }) => <Typography>{getValue()}</Typography>
      },
      {
        accessorKey: 'permissions', // Permissions
        header: 'Permissions',
        cell: ({ getValue }) => {
          const permissions = getValue()
          return (
            <div>
              {permissions?.map((permission, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2, // Increase gap between name and chip
                    marginBottom: 2, // Add spacing between rows
                    padding: 2, // Add padding around each permission block
                    backgroundColor: '#f9f9f9', // Light background for each permission block
                    borderRadius: 2, // Rounded corners for each permission block
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)' // Subtle shadow
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: '#333', // Darker color for name
                      flexShrink: 0 // Ensure name doesn't shrink
                    }}
                  >
                    {permission.name}
                  </Typography>

                  <Chip
                    label={Object.entries(permission)
                      .filter(([key, value]) => key !== 'permission' && key !== 'name' && value === true)
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ')}
                    sx={{
                      backgroundColor: '#e0f7fa', // Light teal background for chip
                      color: '#00695c', // Teal text color
                      fontWeight: '500' // Slightly bold text
                    }}
                  />
                </Box>
              ))}
            </div>
          )
        }
      },
      {
        accessorKey: 'actions', // Actions
        header: 'Actions',
        cell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: 1 // Space between action buttons
              // justifyContent: 'flex-end' // Align actions to the end
            }}
          >
            <IconButton
              aria-label='edit'
              onClick={() => {
                setEditModalOpen(true)
                console.log('row', row.original.permissions)

                setAlreadyAssignedRoles(row.original.permissions)
                handleEditRole(row)
              }}
            >
              <i className='tabler-edit' style={{ color: '#1976d2' }} />
            </IconButton>
            <IconButton aria-label='delete' onClick={() => handleDelete(row.original)}>
              <i className='tabler-trash' style={{ color: '#d32f2f' }} />
            </IconButton>
          </Box>
        )
      }
    ],
    [setData]
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter, // Apply fuzzy filter
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter, // Update global filter
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtered rows
    getPaginationRowModel: getPaginationRowModel()
  })

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }
  const handleClose = () => {
    // setOpen(false)
    setEditModalOpen(false)
  }
  const handlePermissionChange = event => {
    console.log('eee', event.target.value)

    const per = filteredPermissions.filter(permission => permission._id === event.target.value[0])

    const newPermission = [
      ...alreadyAssignedRoles,
      {
        permission: event.target.value[0],
        name: per[0].name,
        read: true,
        edit: true,
        create: true
      }
    ]

    setAlreadyAssignedRoles(newPermission)

    //setSelectedPermissions(event.target.value)
  }
  const togglePermission = id => {
    const arr = selectedCheckbox

    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  // Filter the permissions to show only those already assigned or added
  // Filter the permissions to show only those already assigned or added
  const filteredPermissions = permissionsList?.filter(permission =>
    alreadyAssignedRoles?.filter(assignedPermission => assignedPermission.permission === permission._id)
  )
  const handleEditRole = role => {
    console.log('r', role.original)
    setSelectedRoleId(role.original._id) // Set the selected roleId
    setRoleName(role.original.name) // Set the role name
  }

  const handleDeleteRole = role => {
    console.log('item', role)
    setPermissionIds(prev => [...prev, role?.permission])
    const updatedPermissions = alreadyAssignedRoles.filter(
      assignedPermission => assignedPermission.permission !== role.permission
    )

    // Update the state to reflect the UI changes
    setAlreadyAssignedRoles(updatedPermissions)
  }
  const handleDelete = role => {
    console.log('ind', role)
    setDeleteId(role._id)
    setDeleteConfirmOpen(true) // Open confirmation dialog before delete
  }

  const confirmDelete = async () => {
    const payload = {
      roleId: deleteId
    }
    const response = await deleteAdminRole(payload)
    if (response.status === 200) {
      toast.success(response.data.message)
      fetchRoles()
      setDeleteConfirmOpen(false) // Close confirmation dialog
    } else {
      toast.error(response.data.message)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false) // Close confirmation dialog
    // fetchRoles()
  }

  return (
    <>
      <Card>
        <ToastContainer />
        <CardContent className='flex justify-between flex-col gap-4 items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-2'>
            <Typography>Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>
          <div className='flex gap-4 flex-col !items-start is-full sm:flex-row sm:is-auto sm:items-center'>
            <DebouncedInput
              value={globalFilter ?? ''}
              className='is-[250px]'
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Role'
            />
            {/* <CustomTextField
              select
              value={role || ''}
              onChange={e => setRole(e.target.value)}
              id='roles-app-role-select'
              className='is-[160px]'
              SelectProps={{ displayEmpty: true }}
            >
              {data?.map(role => (
                <MenuItem key={role._id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </CustomTextField> */}
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={openEditModal}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton
          onClick={() => {
            setEditModalOpen(false)
          }}
          disableRipple
        >
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          {'Edit Role'}
          <Typography component='span' className='flex flex-col text-center'>
            Set Role Permissions
          </Typography>
        </DialogTitle>
        <form onSubmit={e => e.preventDefault()}>
          <DialogContent className='overflow-visible flex flex-col gap-6 pbs-0 sm:pli-16'>
            <CustomTextField
              label='Role Name'
              variant='outlined'
              fullWidth
              placeholder='Enter Role Name'
              // defaultValue={title}
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel> Add Permissions</InputLabel>
              <Select
                multiple
                value={selectedPermissions}
                onChange={handlePermissionChange}
                // renderValue={selected => selected.join(', ')}
                renderValue={selected =>
                  selected.map(id => permissionsList.find(permission => permission._id === id)?.name).join(', ')
                }
                label='Permissions'
              >
                {console.log('fl', filteredPermissions)}
                {filteredPermissions?.map(item => (
                  <MenuItem key={item._id} value={item._id} onClick={() => handlePermissionSelect(item)}>
                    <Checkbox
                      checked={alreadyAssignedRoles.some(i => {
                        return item._id == i.permission && (i.read === true || i.edit === true || i.create === true)
                      })}
                    />

                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant='h5' className='min-is-[225px]'>
              Role Permissions
            </Typography>
            <div className='overflow-x-auto'>
              <table className={tableStyles.table}>
                <tbody>
                  {alreadyAssignedRoles?.map((item, index) => {
                    {
                      console.log('al', alreadyAssignedRoles)
                    }
                    const id = item?.permission?.toLowerCase().split(' ').join('-')
                    return (
                      <tr key={id} className='border-be'>
                        <td className='pis-0 flex items-center gap-2'>
                          {item?.name ? (
                            <IconButton aria-label='delete'>
                              <Delete
                                className='tabler-trash'
                                style={{ color: '#d32f2f' }}
                                onClick={() => handleDeleteRole(item)}
                                fontSize='small'
                              />
                            </IconButton>
                          ) : null}
                          <Typography
                            className='font-medium whitespace-nowrap flex-grow min-is-[225px]'
                            color='text.primary'
                          >
                            {item.name}
                          </Typography>
                        </td>

                        <td className='!text-end pie-0'>
                          <FormGroup className='flex-row justify-end flex-nowrap gap-6'>
                            <FormControlLabel
                              className='mie-0'
                              control={
                                <Checkbox
                                  id={`${item.permission}-read`}
                                  // onChange={() => togglePermission(`${id}-read`)}
                                  onChange={() => {
                                    handlePermissionActionChange(item.permission, 'read')
                                    togglePermission(`${item.permission}-read`)
                                  }}
                                  checked={item.read}
                                />
                              }
                              label='Read'
                            />
                            <FormControlLabel
                              className='mie-0'
                              control={
                                <Checkbox
                                  id={`${item.permission}-edit`}
                                  // onChange={() => togglePermission(`${id}-edit`)}
                                  onChange={() => {
                                    handlePermissionActionChange(item.permission, 'edit')
                                    togglePermission(`${item.permission}-edit`)
                                  }}
                                  checked={item.edit}
                                />
                              }
                              label='Edit'
                            />
                            <FormControlLabel
                              className='mie-0'
                              control={
                                <Checkbox
                                  id={`${item.permission}-create`}
                                  // onChange={() => togglePermission(`${id}-create`)}
                                  onChange={() => {
                                    handlePermissionActionChange(item.permission, 'create')
                                    togglePermission(`${item.permission}-create`)
                                  }}
                                  checked={item.create}
                                />
                              }
                              label='Create'
                            />
                          </FormGroup>
                        </td>
                      </tr>
                    )
                  })}
                  {console.log('add', permissionToAdd)}
                  {/* {alreadyAssignedRoles?.map(permission => (
                    <tr key={permission._id} className='border-be'>
                      <td className='pis-0 flex items-center gap-2'>
                        <Typography
                          className='font-medium whitespace-nowrap flex-grow min-is-[225px]'
                          color='text.primary'
                        >
                          {permission.name}
                        </Typography>
                      </td>

                      <td className='!text-end pie-0'>
                        <FormGroup className='flex-row justify-end flex-nowrap gap-6'>
                          <FormControlLabel
                            className='mie-0'
                            control={
                              <Checkbox
                                checked={permission.read}
                                onChange={() => handlePermissionActionChange(permission._id, 'read')}
                              />
                            }
                            label='Read'
                          />
                          <FormControlLabel
                            className='mie-0'
                            control={
                              <Checkbox
                                checked={permission.edit}
                                onChange={() => handlePermissionActionChange(permission._id, 'edit')}
                              />
                            }
                            label='Edit'
                          />
                          <FormControlLabel
                            className='mie-0'
                            control={
                              <Checkbox
                                checked={permission.create}
                                onChange={() => handlePermissionActionChange(permission._id, 'create')}
                              />
                            }
                            label='Create'
                          />
                        </FormGroup>
                        <Button onClick={() => handlePermissionRemove(permission._id)}>Remove</Button>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </DialogContent>

          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            <Button variant='contained' type='submit' onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant='tonal'
              type='reset'
              color='secondary'
              onClick={() => {
                setEditModalOpen(false)
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete} maxWidth='xs' fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this Role?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color='primary' variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RolesTable
