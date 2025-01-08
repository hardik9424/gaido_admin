// 'use client'

// import React, { useState } from 'react'

// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   Box,
//   Collapse,
//   IconButton,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent
// } from '@mui/material'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ChatIcon from '@mui/icons-material/Chat'

// const PetMatchProfile = ({ match }) => {
//   const [expanded, setExpanded] = useState(false)
//   const [openChat, setOpenChat] = useState(false)

//   const handleExpandClick = () => {
//     setExpanded(!expanded)
//   }

//   const handleOpenChat = () => {
//     setOpenChat(true)
//   }

//   const handleCloseChat = () => {
//     setOpenChat(false)
//   }

//   return (
//     <Card sx={{ maxWidth: 800, margin: '20px auto' }}>
//       <CardContent>
//         <Typography variant='h6' gutterBottom>
//           Match ID: {match.id}
//         </Typography>
//         <Box display='flex' justifyContent='space-between'>
//           {/* Display My Pet */}
//           <Box flex='1' textAlign='center'>
//             <Avatar
//               alt={match.myPet.name}
//               src={match.myPet.images[0]}
//               sx={{ width: 120, height: 120, margin: 'auto' }}
//             />
//             <Typography variant='subtitle1'>{match.myPet.name}</Typography>
//             <Typography variant='body2'>Breed: {match.myPet.breed}</Typography>
//             <Typography variant='body2'>Bio: {match.myPet.bio}</Typography>
//           </Box>

//           <Typography variant='h5' sx={{ alignSelf: 'center' }}>
//             vs
//           </Typography>

//           {/* Display Other Pet */}
//           <Box flex='1' textAlign='center'>
//             <Avatar
//               alt={match.otherPet.name}
//               src={match.otherPet.images[0]}
//               sx={{ width: 120, height: 120, margin: 'auto' }}
//             />
//             <Typography variant='subtitle1'>{match.otherPet.name}</Typography>
//             <Typography variant='body2'>Breed: {match.otherPet.breed}</Typography>
//             <Typography variant='body2'>Bio: {match.otherPet.bio}</Typography>
//           </Box>
//         </Box>

//         <Box display='flex' justifyContent='space-between' marginTop={2}>
//           <Button variant='contained' color='primary' onClick={handleExpandClick} endIcon={<ExpandMoreIcon />}>
//             View More
//           </Button>
//           <Button variant='contained' color='secondary' onClick={handleOpenChat} endIcon={<ChatIcon />}>
//             Open Chat
//           </Button>
//         </Box>
//       </CardContent>

//       {/* Expandable content */}
//       <Collapse in={expanded} timeout='auto' unmountOnExit>
//         <CardContent>
//           <Typography variant='h6' gutterBottom>
//             More Information
//           </Typography>
//           <Box display='flex' justifyContent='space-between'>
//             <Box flex='1' textAlign='center'>
//               <Typography variant='body2'>KCI Certified: {match.myPet.kciCertified ? 'Yes' : 'No'}</Typography>
//               <Typography variant='body2'>Neutered: {match.myPet.neutered ? 'Yes' : 'No'}</Typography>
//             </Box>

//             <Box flex='1' textAlign='center'>
//               <Typography variant='body2'>KCI Certified: {match.otherPet.kciCertified ? 'Yes' : 'No'}</Typography>
//               <Typography variant='body2'>Neutered: {match.otherPet.neutered ? 'Yes' : 'No'}</Typography>
//             </Box>
//           </Box>

//           {/* Add other important details like vaccination card, etc */}
//         </CardContent>
//       </Collapse>

//       {/* Chat dialog */}
//       <Dialog open={openChat} onClose={handleCloseChat} fullWidth>
//         <DialogTitle>Chat with {match.otherPet.name}'s Owner</DialogTitle>
//         <DialogContent>
//           {/* You can implement your chat UI here */}
//           <Typography variant='body2'>This is where the chat history or chat functionality will appear.</Typography>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   )
// }

// // Sample usage with mapped data
// // const PetMatchProfiles = ({ matches }) => {
// //   return (
// //     <Box>
// //       {matches.map(match => (
// //         <PetMatchProfile key={match.id} match={match} />
// //       ))}
// //     </Box>
// //   )
// // }

// export default PetMatchProfile

const PetsPage = () => {
  return <></>
}

export default PetsPage
