'use client'


import React, { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  TablePagination,
  TextField,
  LinearProgress,
  CardHeader
} from '@mui/material'

import { toast, ToastContainer } from 'react-toastify'

import { OtherHouses } from '@mui/icons-material'

import {
  getAllAppointments,
  getAllAppointmentsHouse,
  getVetByClinicId,
  updateAppointment,
  updateAppointmentStatus
} from '@/app/api'
import 'react-toastify/dist/ReactToastify.css'

import ProtectedRoutes from '@/components/ProtectedRoute'

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([]) // Separate filtered list
  const [statusValues, setStatusValues] = useState({})
  const [searchQuery, setSearchQuery] = useState('') // Query state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animated Placeholder Data
  const [animateData] = useState(['Search users'])
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchAllAppointments = async () => {
    setLoading(true)
    try {
      const response = await getAllAppointments()
      const appointmentsData = response?.data?.data || []
      setAppointments(appointmentsData)
      setFilteredAppointments(appointmentsData) // Initialize filtered appointments
    } catch (error) {
      console.error('Error fetching appointments:', error)
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

  const handleSearch = event => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    // Filter appointments based on the user name
    const filtered = appointments.filter(appointment => appointment.User?.name.toLowerCase().includes(query))

    setFilteredAppointments(filtered)
    setPage(0) // Reset to the first page on new search
  }

  const handleStatusChange = async (id, value) => {
    if (!value) {
      toast.error('Status is required')
      return
    }

    try {
      setLoading(true)
      const payload = {
        appointmentId: id,
        status: value
      }

      const response = await updateAppointmentStatus(payload)

      if (response?.status === 200 && response.data?.success) {
        toast.success('Appointment Updated Successfully')
        setStatusValues(prev => ({ ...prev, [id]: value }))
        fetchAllAppointments() // Refresh data
      } else {
        toast.error(response.data?.message || 'Failed to update appointment status')
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
      toast.error('An error occurred while updating the appointment status')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  return (
    <Box sx={{ padding: 2 }}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange for the track
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'orange' // Orange for the progress bar
            }
          }}
          variant='indeterminate'
        />
      )}
      <CardHeader
        avatar={<OtherHouses color='primary' fontSize='large' />} // Icon before title
        title='In-Clinc Booking'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'View or Update Status'}
      />

      <ToastContainer position='top-right' autoClose={3000} />

      {/* Search Bar */}
      <TextField
        onClick={() => {
          setClicked(true)
        }}
        onBlur={() => {
          setClicked(false)
        }}
        value={searchQuery}
        onChange={handleSearch}
        placeholder=''
        variant='outlined'
        fullWidth
        sx={{ marginBottom: 2 }}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Pet</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Booking Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Vet</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Datetime Slot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(appointment => (
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
                  key={appointment.id}
                >
                  <TableCell>
                    <Box>
                      <Typography>{appointment.User?.name}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1 }}>
                        <Typography variant='caption'>{appointment?.User?.email}</Typography>
                        <Typography variant='caption'>{appointment?.User?.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography>{appointment.Pet?.name}</Typography>
                      <Typography variant='caption'>Type: {appointment?.Pet?.type}</Typography>
                      <Typography variant='caption'>Breed: {appointment?.Pet?.breed}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.bookingReasons || 'N/A'}</TableCell>

                  <TableCell>
                    <Select
                      value={statusValues[appointment.id] || appointment.status}
                      onChange={e => handleStatusChange(appointment.id, e.target.value)}
                      fullWidth
                    >
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='confirmed'>Confirmed</MenuItem>
                      <MenuItem value='completed'>Completed</MenuItem>
                      <MenuItem value='cancelled'>Cancelled</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Typography>{appointment.Vet ? appointment.Vet.name : 'No Vet Assigned'}</Typography>
                  </TableCell>

                  <TableCell>{appointment.Payment?.status || 'N/A'}</TableCell>
                  <TableCell>{new Date(appointment.datetimeSlot).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align='center'>
                  No appointments available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredAppointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

const ProtectedChatPage = () => {
  return (
    <ProtectedRoutes requiredPermission='Appointments'>
      <AppointmentPage />
    </ProtectedRoutes>
  )
}

export default ProtectedChatPage
