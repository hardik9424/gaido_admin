// // import React, { useState, useEffect } from 'react'

// // import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography } from '@mui/material'

// // import { getAllChats } from '@/app/api'

// // const ChatDialog = ({ open, onClose, otherPetName, petId, matchId }) => {
// //   const [messages, setMessages] = useState([])
// //   const [newMessage, setNewMessage] = useState('')
// //   const [replyId, setReplyId] = useState('')

// //   // Fetch chat messages filtered by matchId
// //   const fetchAllChats = async matchId => {
// //     try {
// //       const response = await getAllChats(matchId)
// //       if (response && response?.data) {
// //         const filteredMessages = response?.data?.data?.filter(chat => chat.matchId === matchId)
// //         setMessages(filteredMessages)
// //         setReplyId(filteredMessages.receiverId)
// //       }
// //     } catch (error) {
// //       console.log('Error fetching chats:', error)
// //     }
// //   }

// //   useEffect(() => {
// //     console.log('new', matchId)
// //     if (matchId && open) {
// //       fetchAllChats(matchId)
// //     }
// //   }, [matchId, open])

// //   const handleSendMessage = () => {
// //     // if (!newMessage.trim()) return
// //     // // Logic to send a new message via your API here (e.g., POST request)
// //     // const newChatMessage = {
// //     //   id: Date.now(),
// //     //   senderId: petId, // Pet sending the message
// //     //   message: newMessage,
// //     //   matchId: matchId // Ensure this message is tied to the matchId
// //     // }
// //     // setMessages([...messages, newChatMessage]) // Temporarily add the new message to the chat
// //     // setNewMessage('') // Clear input field
// //   }

// //   return (
// //     <Dialog open={open} onClose={onClose} fullWidth>
// //       <DialogTitle>Chat with {otherPetName}'s Owner</DialogTitle>
// //       <DialogContent>
// //         <Box sx={{ height: '300px', overflowY: 'auto', marginBottom: 2 }}>
// //           {console.log(messages)}
// //           {messages.map((msg, index) => (
// //             <Box key={index} textAlign={msg.senderId === petId ? 'right' : 'left'}>
// //               <Typography
// //                 variant='body2'
// //                 sx={{
// //                   background: msg.senderId === petId ? '#e0f7fa' : '#fff59d',
// //                   padding: 1,
// //                   borderRadius: '8px',
// //                   display: 'inline-block',
// //                   maxWidth: '80%',
// //                   margin: '5px 0'
// //                 }}
// //               >
// //                 {msg.message}
// //               </Typography>
// //             </Box>
// //           ))}
// //           {/* {messages.map((msg, index) => (
// //             <Box key={index} textAlign={msg.receiverId === replyId ? 'right' : 'left'}>
// //               <Typography
// //                 variant='body2'
// //                 sx={{
// //                   background: msg.receiverId === petId ? '#e0f7fa' : '#fff59d',
// //                   padding: 1,
// //                   borderRadius: '8px',
// //                   display: 'inline-block',
// //                   maxWidth: '80%',
// //                   margin: '5px 0'
// //                 }}
// //               >
// //                 {msg.message}
// //               </Typography>
// //             </Box>
// //           ))} */}
// //         </Box>
// //         <TextField
// //           fullWidth
// //           placeholder='Type a message...'
// //           value={newMessage}
// //           onChange={e => setNewMessage(e.target.value)}
// //         />
// //         <Button variant='contained' color='primary' onClick={handleSendMessage} sx={{ marginTop: 2 }}>
// //           Send
// //         </Button>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }

// // export default ChatDialog

// 'use client'

// import React, { useState, useEffect } from 'react'

// import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography } from '@mui/material'

// import { getAllChats } from '@/app/api'

// const ChatDialog = ({ open, onClose, otherPetName, petId, matchId }) => {
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState('')
//   const [replyId, setReplyId] = useState('')

//   // Fetch chat messages filtered by matchId
//   const fetchAllChats = async matchId => {
//     try {
//       const response = await getAllChats(matchId)
//       if (response && response.data) {
//         const filteredMessages = response.data.data.filter(chat => chat.matchId === matchId)
//         setMessages(filteredMessages)
//         setReplyId(filteredMessages.map(msg => msg.receiverId))
//       }
//     } catch (error) {
//       console.log('Error fetching chats:', error)
//     }
//   }

//   useEffect(() => {
//     if (matchId && open) {
//       fetchAllChats(matchId)
//     }
//   }, [matchId, open])

//   const handleSendMessage = () => {
//     // if (!newMessage.trim()) return
//     // const newChatMessage = {
//     //   id: Date.now(), // Temporarily use timestamp as id
//     //   senderId: petId, // The current pet is sending the message
//     //   message: newMessage,
//     //   matchId: matchId // The matchId for the chat
//     // }
//     // // Add the new message to the messages state
//     // setMessages([...messages, newChatMessage])
//     // setNewMessage('') // Clear input field
//   }

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       {console.log('fix', open)}
//       <DialogTitle>Chat with {otherPetName} </DialogTitle>
//       <DialogContent>
//         <Box sx={{ height: '300px', overflowY: 'auto', marginBottom: 2 }}>
//           {messages.map((msg, index) => (
//             <Box key={index} textAlign={msg.senderId === petId ? 'right' : 'left'}>
//               <Typography
//                 variant='body2'
//                 sx={{
//                   background: msg.senderId === petId ? '#e0f7fa' : '#fff59d',
//                   padding: 1,
//                   borderRadius: '8px',
//                   display: 'inline-block',
//                   maxWidth: '80%',
//                   margin: '5px 0'
//                 }}
//               >
//                 {msg.message}
//               </Typography>
//             </Box>
//           ))}
//           {console.log('see', messages)}
//           {/* {messages.map((msg, index) => (
//             <Box key={index} textAlign={msg.receiverId === replyId ? 'right' : 'left'}>
//               <Typography
//                 variant='body2'
//                 sx={{
//                   background: msg.receiverId === replyId ? '#e0f7fa' : '#fff59d',
//                   padding: 1,
//                   borderRadius: '8px',
//                   display: 'inline-block',
//                   maxWidth: '80%',
//                   margin: '5px 0'
//                 }}
//               >
//                 {msg.message}
//               </Typography>
//             </Box>
//           ))} */}
//         </Box>
//         <TextField
//           fullWidth
//           placeholder='Type a message...'
//           value={newMessage}
//           onChange={e => setNewMessage(e.target.value)}
//         />
//         {/* <Button variant='contained' color='primary' onClick={handleSendMessage} sx={{ marginTop: 2 }}>
//           Send
//         </Button> */}
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default ChatDialog

const ChatDialog = () => {
  return <></>
}

export default ChatDialog
