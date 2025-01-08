'use client'

import React, { useState, useEffect } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  IconButton,
  CardHeader
} from '@mui/material'

import CountUp from 'react-countup'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { ToastContainer, toast } from 'react-toastify'

import { HouseSiding } from '@mui/icons-material'

import HospitalProfileForm from '@/components/hospitalprofile/HospitalProfile'

import { getAllVets, getAllHospital, deleteClinic, getAllMatches } from '@/app/api'
import CustomTextField from '@core/components/mui/TextField'

const ClinicManagemet = () => {
  const [hospitalProfiles, setHospitalProfiles] = useState([])

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingHospital, setEditingHospital] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [vetsData, setVetData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clinicToDelete, setClinicToDelete] = useState(null)
  const [userRole, setUserRole] = useState('')
  const DebouncedInput = ({ value: initialValue, onChange, debounce = 900, ...props }) => {
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

  const fetchAllMatches = async () => {
    try {
      const payload = {
        petID: ''
      }
      const response = await getAllMatches(payload)
      console.log(response)
    } catch (error) {}
  }
  const fetchHospitals = async () => {
    try {
      const hospitals = await getAllHospital()
      setHospitalProfiles(hospitals?.data?.data)
      const response = await getAllVets()
      setVetData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  useEffect(() => {
    fetchHospitals()
  }, [])

  const handleAddHospital = async newHospital => {
    if (editingHospital) {
      // setHospitalProfiles(
      //   hospitalProfiles?.map(hospital =>
      //     hospital.id === editingHospital.id ? { ...editingHospital, ...newHospital } : hospital
      //   )
      // )
      await fetchHospitals()
      setEditingHospital(null)
    } else {
      // setHospitalProfiles([...hospitalProfiles, { ...newHospital, id: Date.now() }])
      await fetchHospitals()
    }
    setModalOpen(false)
  }

  const handleEdit = hospital => {
    console.log('ed', hospital)
    setEditingHospital(hospital)
    setModalOpen(true)
  }

  const handleDeleteClinic = id => {
    console.log('del', id)
    setClinicToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteVet = async () => {
    try {
      const response = await deleteClinic(clinicToDelete)
      console.log('ddd', response)
      if (response.status === 200) {
        fetchHospitals()
        toast.success('Clinic deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete Clinic')
    }
    setDeleteDialogOpen(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    if (hospitalProfiles.length < 0) {
      setPage(0)
    }
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleModalClose = () => {
    setDeleteDialogOpen(false)
    setModalOpen(false)
    setVetData([])
  }

  const handleClodeEditModal = () => {
    setModalOpen(false)
    setEditingHospital(null)
  }

  // Apply the global filter to the hospitalProfiles
  const filteredHospitals = hospitalProfiles
    ?.filter(hospital => hospital.name.toLowerCase().includes(globalFilter.toLowerCase()))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  useEffect(() => {
    if (filteredHospitals?.length === 0 && page > 0) {
      setPage(0) // Reset to the first page
    }
  }, [filteredHospitals, page])

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <Box sx={{ padding: 2 }}>
        <CardHeader
          avatar={<HouseSiding color='primary' fontSize='large' />} // Icon before title
          title='Clinic Management'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'Add or Edit Clinic'}
        />
        <Box sx={{ paddingBottom: 6 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Hospital'
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant='contained' sx={{ backgroundColor: '#ff9c1e' }} onClick={() => setModalOpen(true)}>
            Add Hospital
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>

                <TableCell>Hospital Name</TableCell>
                <TableCell>Vets</TableCell>
                <TableCell>Timming</TableCell>
                <TableCell>Consulation Fees</TableCell>
                <TableCell>Regular Fees</TableCell>
                <TableCell>Silver Fees</TableCell>
                <TableCell>Gold Fees</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHospitals?.map(hospital => (
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
                  key={hospital.id}
                >
                  <TableCell>
                    {hospital.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={hospital.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginRight: '8px'
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{hospital.name}</TableCell>
                  <TableCell>{hospital.Vets?.map(vet => vet.name).join(', ') || 'No Vets Assigned'}</TableCell>
                  <TableCell>{hospital.timing}</TableCell>
                  <TableCell>{<CountUp start={0} end={hospital.fees} />}</TableCell>
                  <TableCell>{<CountUp start={0} end={hospital.regularFees} />}</TableCell>
                  <TableCell>{<CountUp start={0} end={hospital.silverFees} />}</TableCell>
                  <TableCell>{<CountUp start={0} end={hospital.goldFees} />}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => handleEdit(hospital)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => handleDeleteClinic(hospital.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component='div'
            count={
              hospitalProfiles?.filter(hospital => hospital.name.toLowerCase().includes(globalFilter.toLowerCase()))
                .length
            }
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={deleteDialogOpen} onClose={handleModalClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this clinic?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={confirmDeleteVet} color='secondary' autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal for Adding/Editing Hospital */}
        <Dialog open={isModalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth='sm'>
          <DialogTitle>{editingHospital ? 'Edit Hospital' : 'Add New Hospital'}</DialogTitle>
          <DialogContent>
            <HospitalProfileForm
              fecthHospital={fetchHospitals}
              fetchvets={getAllVets}
              vetsList={vetsData}
              onSubmit={handleAddHospital}
              initialData={editingHospital || {}}
              onClose={() => setModalOpen(false)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClodeEditModal(false)} color='secondary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ClinicManagemet
