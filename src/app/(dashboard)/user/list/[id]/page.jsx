// 'use client'

// import React, { useEffect, useState, useCallback } from 'react'

// import { useParams } from 'next/navigation'

// import {
//   Grid,
//   Card,
//   CardHeader,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Avatar,
//   Box,
//   Button,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   List,
//   ListItem,
//   ListItemText
// } from '@mui/material'
// import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material'

// import { toast, ToastContainer } from 'react-toastify'

// import 'react-toastify/dist/ReactToastify.css'
// import { getPetByUserId, getUserProfile, blockUser, unblockUser } from '@/app/api'

// // Utility function to truncate text
// const truncateText = (text, maxLength) => {
//   return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
// }

// // Utility function to render media (images, videos, PDFs)
// const renderMedia = (url, size = '100%') => {
//   if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
//     return (
//       <img
//         src={url}
//         alt='certificate'
//         style={{ width: size, height: 'auto', borderRadius: '8px', marginBottom: '8px' }}
//       />
//     )
//   }
//   if (url.endsWith('.mp4')) {
//     return (
//       <video controls style={{ width: size, borderRadius: '8px', marginBottom: '8px' }}>
//         <source src={url} type='video/mp4' />
//         Your browser does not support the video tag.
//       </video>
//     )
//   }
//   if (url.endsWith('.pdf')) {
//     return (
//       <Button variant='contained' color='primary' href={url} target='_blank' style={{ marginBottom: '8px' }}>
//         View PDF
//       </Button>
//     )
//   }
//   return null
// }

// const UserDetailPage = () => {
//   const [userData, setUserData] = useState(null)
//   const [petsData, setPetsData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(0)
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [blockDialogOpen, setBlockDialogOpen] = useState(false)
//   const [unblockDialogOpen, setUnblockDialogOpen] = useState(false)
//   const [selectedModule, setSelectedModule] = useState('All')

//   const { id } = useParams()

//   const fetchUserData = useCallback(async () => {
//     try {
//       const response = await getUserProfile(id)
//       if (response?.data?.data) {
//         setUserData(response.data.data)
//       } else {
//         throw new Error('User data not found')
//       }
//     } catch (error) {
//       toast.error('Error fetching user data')
//     }
//   }, [id])

//   const fetchPetsData = useCallback(async () => {
//     try {
//       const response = await getPetByUserId(id)
//       if (response?.data?.data) {
//         setPetsData(response.data.data)
//       } else {
//         throw new Error('No pets data found')
//       }
//     } catch (error) {
//       toast.error('Error fetching pets data')
//     }
//   }, [id])

//   useEffect(() => {
//     fetchUserData()
//     fetchPetsData()
//     setLoading(false)
//   }, [id, fetchUserData, fetchPetsData])

//   const handleNextPet = () => {
//     if (currentPage < petsData.length - 1) {
//       setCurrentPage(currentPage + 1)
//       setCurrentImageIndex(0)
//     }
//   }

//   const handlePreviousPet = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1)
//       setCurrentImageIndex(0)
//     }
//   }

//   const handleNextImage = images => {
//     if (currentImageIndex < images.length - 1) {
//       setCurrentImageIndex(currentImageIndex + 1)
//     }
//   }

//   const handlePreviousImage = () => {
//     if (currentImageIndex > 0) {
//       setCurrentImageIndex(currentImageIndex - 1)
//     }
//   }

//   const handleBlockUser = async () => {
//     const payload = { module: selectedModule }
//     try {
//       const response = await blockUser(id, payload)
//       if (response.data.success) {
//         toast.success(`User blocked from ${selectedModule}`)
//         setBlockDialogOpen(false)
//       } else {
//         throw new Error(response.data.message || 'Failed to block user')
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || 'Error blocking user')
//     }
//   }

//   const handleUnblockUser = async () => {
//     const payload = { module: selectedModule }
//     try {
//       const response = await unblockUser(id, payload)
//       if (response.data.success) {
//         toast.success(`User unblocked from ${selectedModule}`)
//         setUnblockDialogOpen(false)
//       } else {
//         throw new Error(response.data.message || 'Failed to unblock user')
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || 'Error unblocking user')
//     }
//   }

//   if (loading) {
//     return (
//       <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
//         <CircularProgress />
//       </Grid>
//     )
//   }

//   if (!userData) {
//     return (
//       <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
//         <Typography variant='h6'>No user data found.</Typography>
//       </Grid>
//     )
//   }

//   const currentPet = petsData[currentPage]
//   const currentImage = currentPet?.images?.[currentImageIndex] || ''
//   const {
//     name,
//     email,
//     phone,
//     profilePicture,
//     active,
//     createdAt,
//     updatedAt,
//     Appointments,
//     Payments,
//     gender,
//     lifetimePawpoints,
//     pawPoints,
//     referralCode,
//     referredById,
//     shopifyCustomerId,
//     subscriptionId
//   } = userData
//   const handleOpenBlockDialog = () => {
//     setBlockDialogOpen(true)
//   }

//   const handleOpenUnblockDialog = () => {
//     setUnblockDialogOpen(true)
//   }

//   return (
//     <>
//       <ToastContainer />
//       <Grid container spacing={6}>
//         <Grid item xs={12} lg={4} md={5}>
//           <Card>
//             <CardContent>
//               <Box display='flex' flexDirection='column' alignItems='center'>
//                 <Avatar src={profilePicture} alt={name} sx={{ width: 100, height: 100, marginBottom: 2 }} />
//                 <Typography variant='h5'>{truncateText(name, 20)}</Typography>
//                 <Typography variant='body2'>{email}</Typography>
//                 <Typography variant='body2'>{phone}</Typography>
//                 <Typography variant='body2' color={active ? 'green' : 'red'}>
//                   {active ? 'Active' : 'Blocked'}
//                 </Typography>
//                 <Typography variant='body2'>Joined: {new Date(createdAt).toLocaleDateString()}</Typography>
//                 <Typography variant='body2'>Last Updated: {new Date(updatedAt).toLocaleDateString()}</Typography>
//                 {userData?.active === true ? (
//                   <Button variant='contained' color='secondary' onClick={handleOpenBlockDialog}>
//                     Block User
//                   </Button>
//                 ) : (
//                   <Button variant='contained' color='secondary' onClick={handleOpenUnblockDialog}>
//                     Unblock User
//                   </Button>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} lg={8} md={7}>
//           {currentPet ? (
//             <Card>
//               <CardHeader title={currentPet.name} subheader={`Breed: ${currentPet.breed} | Type: ${currentPet.type}`} />
//               <CardContent>
//                 <Typography variant='body2' sx={{ marginBottom: '8px' }}>
//                   Bio: {currentPet.bio}
//                 </Typography>

//                 <Box display='flex' justifyContent='center' alignItems='center'>
//                   <IconButton onClick={() => handlePreviousImage(currentPet.images)} disabled={currentImageIndex === 0}>
//                     <ArrowBackIos />
//                   </IconButton>
//                   {currentImage && (
//                     <img
//                       src={currentImage}
//                       alt='Pet'
//                       style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }}
//                     />
//                   )}
//                   <IconButton
//                     onClick={() => handleNextImage(currentPet.images)}
//                     disabled={currentImageIndex === currentPet.images.length - 1}
//                   >
//                     <ArrowForwardIos />
//                   </IconButton>
//                 </Box>

//                 {currentPet.kciCertification && (
//                   <Box mt={2}>
//                     <Typography variant='subtitle2'>KCI Certification:</Typography>
//                     {renderMedia(currentPet.kciCertification, '60%')}
//                   </Box>
//                 )}
//                 {currentPet.dewormingCard && (
//                   <Box mt={2}>
//                     <Typography variant='subtitle2'>Deworming Card:</Typography>
//                     {renderMedia(currentPet.dewormingCard, '60%')}
//                   </Box>
//                 )}
//                 {currentPet.vaccinationCard && (
//                   <Box mt={2}>
//                     <Typography variant='subtitle2'>Vaccination Card:</Typography>
//                     {renderMedia(currentPet.vaccinationCard, '60%')}
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           ) : (
//             <Typography>No pets associated with this user.</Typography>
//           )}

//           <Box display='flex' justifyContent='space-between' sx={{ marginTop: '16px' }}>
//             <Button variant='contained' onClick={handlePreviousPet} disabled={currentPage === 0}>
//               Previous Pet
//             </Button>
//             <Button variant='contained' onClick={handleNextPet} disabled={currentPage === petsData.length - 1}>
//               Next Pet
//             </Button>
//           </Box>
//         </Grid>

//         <Grid item xs={12}>
//           <Card>
//             <CardHeader title='Appointments' />
//             <CardContent>
//               {Appointments.length > 0 ? (
//                 <List>
//                   {Appointments.map(appointment => (
//                     <ListItem key={appointment.id}>
//                       <ListItemText
//                         primary={`Appointment for Pet ID: ${appointment.petId}`}
//                         secondary={`Status: ${appointment.status}, Slot: ${new Date(
//                           appointment.datetimeSlot
//                         ).toLocaleString()}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               ) : (
//                 <Typography>No appointments found.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12}>
//           <Card>
//             <CardHeader title='Payments' />
//             <CardContent>
//               {Payments.length > 0 ? (
//                 <List>
//                   {Payments.map(payment => (
//                     <ListItem key={payment.id}>
//                       <ListItemText
//                         primary={`Payment Amount: ₹${payment.amount}`}
//                         secondary={`Status: ${payment.status}, Order ID: ${payment.rpOrderId}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               ) : (
//                 <Typography>No payments found.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
//         <DialogTitle>Block User</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to block this user?</Typography>
//           <FormControl fullWidth margin='normal'>
//             <InputLabel id='module-select-label'>Block From</InputLabel>
//             <Select
//               labelId='module-select-label'
//               value={selectedModule}
//               onChange={e => setSelectedModule(e.target.value)}
//             >
//               <MenuItem value='All'>All</MenuItem>
//               <MenuItem value='Community'>Community</MenuItem>
//               <MenuItem value='Posts'>Posts</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBlockDialogOpen(false)} color='primary'>
//             Cancel
//           </Button>
//           <Button onClick={handleBlockUser} color='secondary'>
//             Block User
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={unblockDialogOpen} onClose={() => setUnblockDialogOpen(false)}>
//         <DialogTitle>Unblock User</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to unblock this user?</Typography>
//           <FormControl fullWidth margin='normal'>
//             <InputLabel id='module-select-label'>Unblock From</InputLabel>
//             <Select
//               labelId='module-select-label'
//               value={selectedModule}
//               onChange={e => setSelectedModule(e.target.value)}
//             >
//               <MenuItem value='All'>All</MenuItem>
//               <MenuItem value='Community'>Community</MenuItem>
//               <MenuItem value='Posts'>Posts</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUnblockDialogOpen(false)} color='primary'>
//             Cancel
//           </Button>
//           <Button onClick={handleUnblockUser} color='secondary'>
//             Unblock User
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// }

// export default UserDetailPage

'use client'
export const dynamicParams = true

import React, { useEffect, useState, useCallback } from 'react'

import { useParams } from 'next/navigation'

import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  IconButton
} from '@mui/material'
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { getPetByUserId } from '@/app/api'

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Utility function to render media (images, videos, PDFs)
const renderMedia = (url, size = '200px') => {
  if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
    return <img src={url} alt='pet' style={{ width: size, height: 'auto', borderRadius: '8px', marginBottom: '8px' }} />
  }
  if (url.endsWith('.mp4')) {
    return (
      <video controls style={{ width: size, height: 'auto', borderRadius: '8px', marginBottom: '8px' }}>
        <source src={url} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    )
  }
  return null
}

const UserDetailPage = () => {
  const [petsData, setPetsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { id } = useParams()

  const fetchPetsData = useCallback(async () => {
    try {
      const response = await getPetByUserId(id)
      console.log('got', response)
      if (response?.data?.data) {
        setPetsData(response?.data?.data)
      } else {
        throw new Error('No pets data found')
      }
    } catch (error) {
      toast.error('Error fetching pets data')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    console.log()
    fetchPetsData()
    setLoading(false)
  }, [id, fetchPetsData])

  const handleNextPet = () => {
    if (currentPage < petsData.length - 1) {
      setCurrentPage(currentPage + 1)
      setCurrentImageIndex(0)
    }
  }

  const handlePreviousPet = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      setCurrentImageIndex(0)
    }
  }

  const handleNextImage = images => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  if (loading) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (!petsData.length) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <Typography variant='h6'>No pets data found.</Typography>
      </Grid>
    )
  }

  const currentPet = petsData[currentPage]
  const currentImage = currentPet?.images?.[currentImageIndex] || ''

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {currentPet && (
            <Card>
              <CardHeader
                title={`${currentPet.name} (${currentPet.type})`}
                subheader={`Breed: ${currentPet.breed} | Gender: ${currentPet.gender}`}
              />
              <CardContent>
                <Typography variant='body2'>Bio: {currentPet.bio}</Typography>
                <Typography variant='body2'>Color: {currentPet.colour}</Typography>
                <Typography variant='body2'>Source: {currentPet.source}</Typography>
                <Typography variant='body2'>Neutered: {currentPet.neutered ? 'Yes' : 'No'}</Typography>
                <Typography variant='body2'>KCI Certified: {currentPet.kciCertified ? 'Yes' : 'No'}</Typography>
                <Typography variant='body2'>Temperament: {currentPet.temperament || 'N/A'}</Typography>

                <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
                  <IconButton onClick={() => handlePreviousImage(currentPet.images)} disabled={currentImageIndex === 0}>
                    <ArrowBackIos />
                  </IconButton>
                  {currentImage && renderMedia(currentImage, '400px')}
                  <IconButton
                    onClick={() => handleNextImage(currentPet.images)}
                    disabled={currentImageIndex === currentPet.images.length - 1}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </Box>

                <Box mt={2}>
                  <Typography variant='subtitle2'>Date of Birth:</Typography>
                  <Typography>{new Date(currentPet.dateOfBirth).toLocaleDateString()}</Typography>
                </Box>
              </CardContent>
            </Card>
          )}
          <Box display='flex' justifyContent='space-between' mt={3}>
            <Button variant='contained' onClick={handlePreviousPet} disabled={currentPage === 0}>
              Previous Pet
            </Button>
            <Button variant='contained' onClick={handleNextPet} disabled={currentPage === petsData.length - 1}>
              Next Pet
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default UserDetailPage
