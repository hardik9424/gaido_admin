// 'use client'

// import React, { useState, useEffect, useRef } from 'react'

// import { useRouter } from 'next/navigation'

// import axios from 'axios'
// import { PhotoCamera } from '@mui/icons-material'
// import { io } from 'socket.io-client'

// import {
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Paper,
//   TextField,
//   Button,
//   Avatar,
//   IconButton
// } from '@mui/material'

// import 'react-quill/dist/quill.snow.css'
// import { getAllUser } from '@/app/api'
// import ProtectedRoute from '@/components/ProtectedRoute'

// const ChatPage = () => {
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [messages, setMessages] = useState([])
//   const [message, setMessage] = useState('')
//   const [mediaFile, setMediaFile] = useState(null)
//   const [socket, setSocket] = useState(null)
//   const [mediaUrl, setMediaUrl] = useState('')
//   const [mediaPreview, setMediaPreview] = useState('')
//   const fileInputRef = useRef(null)

//   const router = useRouter()

//   const handleSendMessage = async () => {
//     const token = localStorage.getItem('token')
//     let media = mediaUrl

//     if (mediaFile) {
//       const formData = new FormData()
//       formData.append('file', mediaFile)

//       try {
//         const uploadResponse = await axios.post(
//           `https://ships-api.applore.in/v1/api/user/upload/upload_file`,
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//               Authorization: `Bearer ${token}`
//             }
//           }
//         )

//         media = uploadResponse?.data?.data?.fileUrl
//         setMediaUrl(media)
//       } catch (error) {
//         console.error('Error uploading media:', error)
//         return
//       }
//     }

//     if (socket && selectedUser) {
//       socket.emit('sendAdminMessage', {
//         senderId: 'admin',
//         receiverId: selectedUser._id,
//         message,
//         media
//       })

//       // setMessages(prevMessages => [
//       //   ...prevMessages,
//       //   { senderId: 'admin', receiverId: selectedUser._id, message, media }
//       // ])
//     }

//     setMessage('')
//     setMediaFile(null)
//     setMediaUrl('')
//     setMediaPreview('')
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   const loadChat = user => {
//     if (socket) {
//       socket.emit('joinAdminRoom', { senderId: 'admin', receiverId: user._id })
//       socket.emit('loadAdminChat', { senderId: 'admin', receiverId: user._id })
//     }
//   }

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getAllUser()
//         setUsers(response?.data?.data)
//       } catch (error) {
//         console.error('Error fetching users:', error)
//       }
//     }

//     fetchUsers()
//   }, [])

//   useEffect(() => {
//     const newSocket = io('wss://ships-api.applore.in/', {
//       extraHeaders: { 'ngrok-skip-browser-warning': 'any-value' }
//     })

//     newSocket.on('connect', () => {
//       setSocket(newSocket)
//     })

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (!socket) return

//     const handleLoadAdminUsers = item => {
//       setUsers(item)
//     }

//     const handleAdminMessageReceived = item => {
//       console.log('111', item)
//       setMessages(prevMessages => [...prevMessages, item])
//     }

//     const handleLoadAdminChat = item => {
//       console.log('11', item)
//       setMessages(item)
//     }

//     socket.on('loadAdminUsers', handleLoadAdminUsers)
//     socket.on('adminMessageReceived', handleAdminMessageReceived)
//     socket.on('loadAdminChat', handleLoadAdminChat)

//     return () => {
//       socket.off('loadAdminUsers', handleLoadAdminUsers)
//       socket.off('adminMessageReceived', handleAdminMessageReceived)
//       socket.off('loadAdminChat', handleLoadAdminChat)
//     }
//   }, [socket])

//   const handleFileChange = e => {
//     const file = e.target.files[0]
//     if (file) {
//       setMediaFile(file)
//       const previewUrl = URL.createObjectURL(file)
//       console.log(previewUrl)

//       setMediaPreview(previewUrl)
//     }
//   }

//   const renderMedia = mediaUrl => {
//     if (mediaUrl?.match(/\.(jpeg|jpg|gif|png)$/)) {
//       return <img src={mediaUrl} alt='media' style={{ maxWidth: '100%', maxHeight: '200px' }} />
//     } else if (mediaUrl?.match(/\.(mp4|webm|ogg)$/)) {
//       return (
//         <video style={{ maxWidth: '100%', maxHeight: '200px' }} controls>
//           <source src={mediaUrl} type='video/mp4' /> Your browser does not support the video tag.
//         </video>
//       )
//     }
//   }
//   const handleKeyPress = event => {
//     if (event.key === 'Enter') {
//       event.preventDefault()
//       handleSendMessage()
//     }
//   }

//   useEffect(() => {
//     return () => {
//       // Clean up the object URL to avoid memory leaks
//       if (mediaPreview) {
//         URL.revokeObjectURL(mediaPreview)
//       }
//     }
//   }, [mediaPreview])

//   return (
//     <Box sx={{ display: 'flex', height: '80vh' }}>
//       <Paper sx={{ width: '25%', borderRight: '1px solid #ccc', overflowY: 'auto', maxHeight: '100%' }}>
//         <List>
//           {users?.map(user => (
//             <ListItem
//               button
//               key={user._id}
//               onClick={() => {
//                 setSelectedUser(user)
//                 loadChat(user)
//               }}
//             >
//               <Avatar src={user.profile || '/path-to-default-icon.png'} alt={`${user.first_name} ${user.last_name}`} />
//               <ListItemText primary={`${user.first_name} ${user.last_name}`} sx={{ ml: 2 }} />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>
//       <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedUser ? (
//           <>
//             <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
//               {messages.map((msg, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: msg.receiverId !== 'admin' ? 'flex-end' : 'flex-start',
//                     mt: 2
//                   }}
//                 >
//                   {msg.senderId !== 'admin' && (
//                     <Avatar src={selectedUser.profile || '/path-to-default-icon.png'} alt={msg.from} sx={{ ml: 2 }} />
//                   )}
//                   <Box
//                     sx={{
//                       maxWidth: '70%',
//                       p: 2,
//                       bgcolor: msg.senderId === 'admin' ? '#007bff' : '#e5e5ea',
//                       color: msg.senderId === 'admin' ? 'white' : 'black',
//                       borderRadius: 2
//                     }}
//                   >
//                     <Typography variant='body1'>{msg.message}</Typography>
//                     {msg.media && renderMedia(msg.media)}
//                   </Box>
//                 </Box>
//               ))}
//             </Paper>
//             <Box>{mediaPreview && <img src={mediaPreview} style={{ width: '10rem', height: '10rem' }} />}</Box>
//             <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
//               <TextField
//                 fullWidth
//                 variant='outlined'
//                 value={message}
//                 onChange={e => setMessage(e.target.value)}
//                 placeholder='Type a message'
//                 onKeyPress={handleKeyPress}
//               />

//               <input
//                 accept='image/*,video/*'
//                 style={{ display: 'none' }}
//                 id='upload-media'
//                 type='file'
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//               />

//               <label htmlFor='upload-media'>
//                 <IconButton color='primary' component='span' sx={{ fontSize: 45 }}>
//                   <PhotoCamera />
//                 </IconButton>
//               </label>
//               <Button
//                 variant='contained'
//                 color='primary'
//                 onClick={handleSendMessage}
//                 sx={{ ml: 2 }}
//                 disabled={!message.trim()}
//               >
//                 Send
//               </Button>
//             </Box>
//             {/* {mediaPreview && (
//               <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
//                 {mediaPreview.match(/\.(jpeg|jpg|gif|png)$/) ? (
//                   <img src={mediaPreview} alt='Preview' style={{ maxWidth: '100%', maxHeight: '200px' }} />
//                 ) : mediaPreview.match(/\.(mp4|webm|ogg)$/) ? (
//                   <video style={{ maxWidth: '100%', maxHeight: '200px' }} controls>
//                     <source src={mediaPreview} type='video/mp4' />
//                     Your browser does not support the video tag.
//                   </video>
//                 ) : null}
//               </Box>
//             )} */}
//           </>
//         ) : (
//           <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <Typography variant='h6'>Select a user to start chatting</Typography>
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   )
// }

// // const ProtectedChatPage = () => {
// //   return (
// //     <ProtectedRoute requiredPermission='chat'>
// //       <ChatPage />
// //     </ProtectedRoute>
// //   )
// // }

// // export default ProtectedChatPage
// export default ChatPage

'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { getusers } from '@/app/api'

// import background from '../../../../public/images/pages/what.jpg'

// Sample data for users and messages
const usersData = [
  { id: 1, name: 'User 1', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'User 2', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'User 3', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'User 4', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'User 5', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'User 6', avatar: 'https://i.pravatar.cc/150?img=6' }
]

const messagesData = [
  { id: 1, text: 'Hello!', sender: 'user', time: '10:30 AM' },
  { id: 2, text: 'Hi there!', sender: 'admin', time: '10:32 AM' }
]

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState(messagesData)
  const [newMessage, setNewMessage] = useState('')
  const [page, setPage] = useState(0)
  const [allUsers, setAllUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await getusers()
      console.log('chat', response)
      if (response.status === 200) {
        setAllUsers(response?.data?.data)
      }
    } catch (error) {
      setAllUsers([])
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Pagination: 2 users per page
  const usersPerPage = 5
  const paginatedUsers = allUsers?.slice(page * usersPerPage, page * usersPerPage + usersPerPage)

  const handleUserSelect = user => {
    setSelectedUser(user)
    console.log('sl', user)
    // Load the user's conversation here if you have different message histories
    setMessages(messagesData) // Reset with sample data for demonstration
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'admin',
        time: new Date().toLocaleTimeString()
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh'
      }}
    >
      {/* User List Section */}
      <Box
        sx={{
          width: '30%',
          // borderRight: '1px solid orange',
          border: '2px solid orange',
          // borderRadius: '10px',
          backgroundColor: '#f5f5f5',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant='h6' sx={{ padding: '10px', textAlign: 'center' }}>
          Users
        </Typography>
        <List>
          {paginatedUsers?.map(user => (
            <ListItem
              button
              key={user.id}
              selected={selectedUser?.id === user.id}
              onClick={() => handleUserSelect(user)}
              // sx={{ borderBottom: '1px solid orange' }}
            >
              <ListItemAvatar>
                <Avatar src={user.profilePicture} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <IconButton onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant='body2' sx={{ margin: '0 10px' }}>
            Page {page + 1}
          </Typography>
          <IconButton
            onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(usersData.length / usersPerPage) - 1))}
            disabled={page >= Math.ceil(usersData.length / usersPerPage) - 1}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: selectedUser ? `url(/images/pages/what.jpg)` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Chat Header */}
        {selectedUser ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#ff8c00',
              color: 'white'
              // borderRadius: '10px'
            }}
          >
            <Avatar src={selectedUser.avatar} />
            <Typography variant='h6' sx={{ marginLeft: '10px' }}>
              {selectedUser.name}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ padding: '10px', textAlign: 'center', color: '#555' }}>
            <Typography>Select a user to start chatting</Typography>
          </Box>
        )}

        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px'
          }}
        >
          {selectedUser ? (
            messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
          ) : (
            <Typography variant='body2' sx={{ textAlign: 'center', color: '#555' }}>
              No chat selected
            </Typography>
          )}
        </Box>

        {/* Input Area */}
        {selectedUser && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px'
              // backgroundColor: '#ff8c00'
            }}
          >
            <TextField
              placeholder='Type a message'
              variant='outlined'
              size='small'
              fullWidth
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'orange' },
                  '&:hover fieldset': { borderColor: '#ff8c00' }
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              sx={{
                color: 'white',
                marginLeft: '10px',
                backgroundColor: '#ff8c00',
                '&:hover': { backgroundColor: '#e07b00' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// Message Bubble Component
const MessageBubble = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: '10px'
    }}
  >
    <Paper
      sx={{
        maxWidth: '60%',
        padding: '10px',
        borderRadius: '15px',
        backgroundColor: message.sender === 'user' ? '#ffe5b4' : '#ff8c00',
        color: message.sender === 'user' ? 'black' : 'white'
      }}
    >
      <Typography variant='body2'>{message.text}</Typography>
      <Typography
        variant='caption'
        sx={{
          display: 'block',
          textAlign: 'right',
          color: message.sender === 'user' ? 'gray' : '#ffe5b4',
          marginTop: '5px'
        }}
      >
        {message.time}
      </Typography>
    </Paper>
  </Box>
)

export default ChatPage
