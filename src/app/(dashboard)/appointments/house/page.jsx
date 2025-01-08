// 'use client'

// import React, { useEffect, useState } from 'react'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Select,
//   MenuItem,
//   CircularProgress,
//   TablePagination
// } from '@mui/material'
// import { toast, ToastContainer } from 'react-toastify'

// import 'react-toastify/dist/ReactToastify.css'
// import { getAllAppointmentsHouse, getAllVets, updateAppointment, updateAppointmentStatus } from '@/app/api'

// const InHouseAppointmentPage = () => {
//   const [appointments, setAppointments] = useState([])
//   const [statusValues, setStatusValues] = useState({})
//   const [vets, setVets] = useState([])
//   const [loadingVets, setLoadingVets] = useState(false)

//   // Pagination state
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(5)

//   const fetchInHouseAppointments = async () => {
//     try {
//       const response = await getAllAppointmentsHouse()
//       setAppointments(response?.data?.data || [])
//     } catch (error) {
//       console.error('Error fetching in-house appointments:', error)
//     }
//   }

//   const fetchAllVets = async () => {
//     setLoadingVets(true)
//     try {
//       const response = await getAllVets()
//       setVets(response?.data?.data || [])
//     } catch (error) {
//       console.error('Error fetching vets:', error)
//     } finally {
//       setLoadingVets(false)
//     }
//   }

//   const handleVetChange = async (appointmentId, vetId) => {
//     try {
//       await updateAppointment(appointmentId, { vetId })
//       fetchInHouseAppointments()
//       toast.success('Vet assignment updated successfully!')
//     } catch (error) {
//       console.error('Error updating vet assignment:', error)
//       toast.error('Failed to update vet assignment.')
//     }
//   }

//   const handleStatusChange = async (id, value) => {
//     if (!value) {
//       toast.error('Status is required')
//       return
//     }
//     const payload = {
//       appointmentId: id,
//       status: value
//     }
//     try {
//       const response = await updateAppointmentStatus(payload)
//       if (response?.status === 200 && response.data?.success) {
//         toast.success('Appointment status updated successfully')
//         setStatusValues(prev => ({ ...prev, [id]: value }))
//         fetchInHouseAppointments()
//       } else {
//         toast.error(response.data?.message || 'Failed to update appointment status')
//       }
//     } catch (error) {
//       console.error('Error updating appointment status:', error)
//       toast.error('An error occurred while updating the appointment status')
//     }
//   }

//   useEffect(() => {
//     fetchInHouseAppointments()
//     fetchAllVets()
//   }, [])

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = event => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Typography variant='h4' gutterBottom>
//         In-House Appointments List
//       </Typography>
//       <ToastContainer position='top-right' autoClose={3000} />
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User</TableCell>
//               <TableCell>Pet</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Booking Reason</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Package</TableCell>
//               <TableCell>Assigned Vet</TableCell>
//               <TableCell>Assign Vet</TableCell>
//               <TableCell>Payment</TableCell>
//               <TableCell>Address</TableCell>
//               <TableCell>Datetime Slot</TableCell>
//               <TableCell>Notes</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {appointments.length > 0 ? (
//               appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(appointment => (
//                 <TableRow key={appointment.id}>
//                   <TableCell>
//                     <Box>
//                       <Typography>{appointment.User.name}</Typography>
//                       <Typography display='block' variant='caption'>
//                         {appointment.User.email}
//                       </Typography>
//                       <Typography display='block' variant='caption'>
//                         {appointment.User.phone}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography>{appointment.Pet.name}</Typography>
//                       <Typography variant='caption'>Type: {appointment.Pet.type}</Typography>
//                       <Typography variant='caption'>Breed: {appointment.Pet.breed}</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>{appointment.type}</TableCell>
//                   <TableCell>{appointment.bookingReasons || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Select
//                       value={statusValues[appointment.id] || appointment.status}
//                       onChange={e => handleStatusChange(appointment.id, e.target.value)}
//                       sx={{ paddingRight: '15px !important' }}
//                     >
//                       <MenuItem value='pending'>Pending</MenuItem>
//                       <MenuItem value='confirmed'>Confirmed</MenuItem>
//                       <MenuItem value='completed'>Completed</MenuItem>
//                       <MenuItem value='cancelled'>Cancelled</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     {appointment.Package ? (
//                       <Box>
//                         <Typography>{appointment.Package.name}</Typography>
//                         <Typography variant='caption'>Price: {appointment.Package.price}</Typography>
//                       </Box>
//                     ) : (
//                       'No Package'
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography>{appointment.Vet ? appointment.Vet.name : 'No Vet Assigned'}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     {loadingVets ? (
//                       <CircularProgress size={24} />
//                     ) : (
//                       <Select
//                         value={appointment.vetId || ''}
//                         onChange={e => handleVetChange(appointment.id, e.target.value)}
//                         fullWidth
//                       >
//                         {vets.length > 0 ? (
//                           vets.map(vet => (
//                             <MenuItem key={vet.id} value={vet.id}>
//                               {vet.name}
//                             </MenuItem>
//                           ))
//                         ) : (
//                           <MenuItem value=''>No Vets Available</MenuItem>
//                         )}
//                       </Select>
//                     )}
//                   </TableCell>
//                   <TableCell>{appointment.Payment?.status || 'No Payment'}</TableCell>
//                   <TableCell>
//                     {appointment.Address ? (
//                       <Box>
//                         <Typography>{appointment.Address.streetName}</Typography>
//                         <Typography variant='caption'>Landmark: {appointment.Address.landmark}</Typography>
//                       </Box>
//                     ) : (
//                       'No Address'
//                     )}
//                   </TableCell>
//                   <TableCell>{new Date(appointment.datetimeSlot).toLocaleString()}</TableCell>
//                   <TableCell>{appointment.notes || 'No Notes'}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={12} align='center'>
//                   No in-house appointments available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component='div'
//         count={appointments.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   )
// }

// export default InHouseAppointmentPage

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
  CircularProgress,
  TablePagination,
  TextField,
  LinearProgress,
  CardHeader
} from '@mui/material'

import { HouseSharp } from '@mui/icons-material'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { getAllAppointmentsHouse, getAllVets, updateAppointment, updateAppointmentStatus } from '@/app/api'

const InHouseAppointmentPage = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([]) // For filtered results
  const [searchQuery, setSearchQuery] = useState('') // Search query state
  const [statusValues, setStatusValues] = useState({})
  const [vets, setVets] = useState([])
  const [loadingVets, setLoadingVets] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animated Placeholder Data
  const [animateData] = useState(['Search users', 'Search pets'])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const fetchInHouseAppointments = async () => {
    setLoading(true)
    try {
      const response = await getAllAppointmentsHouse()
      const appointmentData = response?.data?.data || []
      setAppointments(appointmentData)
      setFilteredAppointments(appointmentData) // Initialize filtered appointments
    } catch (error) {
      console.error('Error fetching in-house appointments:', error)
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
  const fetchAllVets = async () => {
    setLoadingVets(true)
    try {
      const response = await getAllVets()
      setVets(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching vets:', error)
    } finally {
      setLoadingVets(false)
    }
  }

  const handleSearch = event => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = appointments.filter(
      appointment =>
        appointment.User.name.toLowerCase().includes(query) || // Search by user name
        appointment.Pet.name.toLowerCase().includes(query) || // Search by pet name
        appointment.Address?.streetName.toLowerCase().includes(query) // Search by address
    )
    setFilteredAppointments(filtered)
    setPage(0) // Reset to first page after search
  }

  const handleVetChange = async (appointmentId, vetId) => {
    setLoading(true)
    try {
      await updateAppointment(appointmentId, { vetId })
      fetchInHouseAppointments()
      toast.success('Vet assignment updated successfully!')
    } catch (error) {
      console.error('Error updating vet assignment:', error)
      toast.error('Failed to update vet assignment.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, value) => {
    if (!value) {
      toast.error('Status is required')
      return
    }
    const payload = {
      appointmentId: id,
      status: value
    }
    setLoading(true)
    try {
      const response = await updateAppointmentStatus(payload)
      if (response?.status === 200 && response.data?.success) {
        toast.success('Appointment status updated successfully')
        setStatusValues(prev => ({ ...prev, [id]: value }))
        fetchInHouseAppointments()
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

  useEffect(() => {
    fetchInHouseAppointments()
    fetchAllVets()
  }, [])

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

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
        avatar={<HouseSharp color='primary' fontSize='large' />} // Icon before title
        title='In-House Bookings'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'View or Edit Status'}
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
        variant='outlined'
        fullWidth
        sx={{ marginBottom: 2 }}
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
              <TableCell>Package</TableCell>
              <TableCell>Assigned Vet</TableCell>
              <TableCell>Assign Vet</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Datetime Slot</TableCell>
              <TableCell>Notes</TableCell>
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
                      <Typography>{appointment.User.name}</Typography>
                      <Typography display='block' variant='caption'>
                        {appointment.User.email}
                      </Typography>
                      <Typography display='block' variant='caption'>
                        {appointment.User.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography>{appointment.Pet.name}</Typography>
                      <Typography variant='caption'>Type: {appointment.Pet.type}</Typography>
                      <Typography variant='caption'>Breed: {appointment.Pet.breed}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.bookingReasons || 'N/A'}</TableCell>
                  <TableCell>
                    <Select
                      value={statusValues[appointment.id] || appointment.status}
                      onChange={e => handleStatusChange(appointment.id, e.target.value)}
                      sx={{ paddingRight: '15px !important' }}
                    >
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='confirmed'>Confirmed</MenuItem>
                      <MenuItem value='completed'>Completed</MenuItem>
                      <MenuItem value='cancelled'>Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {appointment.Package ? (
                      <Box>
                        <Typography>{appointment.Package.name}</Typography>
                        <Typography variant='caption'>Price: {appointment.Package.regularPrice}</Typography>
                      </Box>
                    ) : (
                      'No Package'
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography>{appointment.Vet ? appointment.Vet.name : 'No Vet Assigned'}</Typography>
                  </TableCell>
                  <TableCell>
                    {loadingVets ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Select
                        value={appointment.vetId || ''}
                        onChange={e => handleVetChange(appointment.id, e.target.value)}
                        fullWidth
                      >
                        {vets.length > 0 ? (
                          vets.map(vet => (
                            <MenuItem key={vet.id} value={vet.id}>
                              {vet.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value=''>No Vets Available</MenuItem>
                        )}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>{appointment.Payment?.status || 'No Payment'}</TableCell>
                  <TableCell>
                    {appointment.Address ? (
                      <Box>
                        <Typography>{appointment.Address.streetName}</Typography>
                        <Typography variant='caption'>Landmark: {appointment.Address.landmark}</Typography>
                      </Box>
                    ) : (
                      'No Address'
                    )}
                  </TableCell>
                  <TableCell>{new Date(appointment.datetimeSlot).toLocaleString()}</TableCell>
                  <TableCell>{appointment.notes || 'No Notes'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align='center'>
                  No in-house appointments available
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

export default InHouseAppointmentPage
