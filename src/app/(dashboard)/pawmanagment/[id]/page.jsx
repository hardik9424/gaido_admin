'use client'

export const dynamic = 'force-static'

import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Collapse,
  Pagination,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import ChatIcon from '@mui/icons-material/Chat'

import { getAllMatches, getAllChats } from '@/app/api'

const PetMatchProfile = () => {
  const [expanded, setExpanded] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const [matches, setMatches] = useState([])
  const [currentMatchId, setCurrentMatchId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const matchesPerPage = 5
  const { id } = useParams() // petId

  const fetchAllMatches = async id => {
    try {
      const response = await getAllMatches(id)
      setMatches(response?.data?.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchAllMatches(id)
    }
  }, [id])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleOpenChat = async matchId => {
    setCurrentMatchId(matchId)
    setOpenChat(true)
    await fetchAllChats(matchId)
  }

  const handleCloseChat = () => {
    setOpenChat(false)
  }

  const fetchAllChats = async matchId => {
    try {
      const response = await getAllChats(matchId)
      if (response && response.data) {
        const filteredMessages = response.data.data.filter(chat => chat.matchId === matchId)
        setMessages(filteredMessages)
      }
    } catch (error) {
      console.log('Error fetching chats:', error)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newChatMessage = {
      id: Date.now(), // Temporarily use timestamp as id
      senderId: id, // The current pet is sending the message
      message: newMessage,
      matchId: currentMatchId // The matchId for the chat
    }

    // Add the new message to the messages state
    setMessages([...messages, newChatMessage])
    setNewMessage('') // Clear input field
  }

  const trunCateText = msg => (msg.length > 10 ? msg.slice(0, 10) + '...' : msg)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const indexOfLastMatch = currentPage * matchesPerPage
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch)

  return (
    <>
      {matches.length === 0 ? (
        <Typography variant='h6' textAlign='center' sx={{ marginTop: 5 }}>
          No matches available for your pet.
        </Typography>
      ) : (
        <>
          <CardHeader title='Pets Matched' />
          {currentMatches.map(match => (
            <Card key={match.id} sx={{ maxWidth: 2000, margin: '20px auto' }}>
              <CardContent>
                <Box display='flex' justifyContent='space-between'>
                  {/* Display My Pet */}
                  <Box flex='1' textAlign='center'>
                    <Avatar
                      alt={match.myPet.name}
                      src={match.myPet.images[0]}
                      sx={{ width: 120, height: 120, margin: 'auto' }}
                    />
                    <Typography variant='subtitle1'>{match.myPet.name}</Typography>
                    <Typography variant='body2'>Breed: {match.myPet.breed}</Typography>
                    <Typography variant='body2'>Bio: {match.myPet.bio}</Typography>
                  </Box>

                  <Typography variant='h6' sx={{ alignSelf: 'center' }}>
                    Matched
                  </Typography>

                  {/* Display Other Pet */}
                  <Box flex='1' textAlign='center'>
                    <Avatar
                      alt={match.otherPet.name}
                      src={match.otherPet.images[0]}
                      sx={{ width: 120, height: 120, margin: 'auto' }}
                    />
                    <Typography variant='subtitle1'>{match.otherPet.name}</Typography>
                    <Typography variant='body2'>Breed: {match.otherPet.breed}</Typography>
                    <Typography variant='body2'>Bio: {trunCateText(match.otherPet.bio)}</Typography>
                  </Box>
                </Box>

                <Box display='flex' justifyContent='space-between' marginTop={2}>
                  <Button
                    variant='contained'
                    sx={{ backgroundColor: '#FFA500' }}
                    onClick={handleExpandClick}
                    endIcon={<ExpandMoreIcon />}
                  >
                    View More
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleOpenChat(match.id)}
                    endIcon={<ChatIcon />}
                  >
                    Open Chat
                  </Button>
                </Box>
              </CardContent>
              {/* Expandable content */}
              <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    More Information
                  </Typography>
                  <Box display='flex' justifyContent='space-between'>
                    <Box flex='1' textAlign='center'>
                      <Typography variant='body2'>
                        KCI Certified: {match?.myPet?.kciCertified ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant='body2'>Neutered: {match?.myPet?.neutered ? 'Yes' : 'No'}</Typography>
                    </Box>
                    <Box flex='1' textAlign='center'>
                      <Typography variant='body2'>
                        KCI Certified: {match.otherPet.kciCertified ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant='body2'>Neutered: {match.otherPet.neutered ? 'Yes' : 'No'}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          ))}

          {/* Pagination */}
          <Box display='flex' justifyContent='center' marginTop={4}>
            <Pagination
              count={Math.ceil(matches.length / matchesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
            />
          </Box>

          {/* Chat Dialog */}
          <Dialog open={openChat} onClose={handleCloseChat} fullWidth>
            <DialogTitle>Chat with {matches.find(match => match.id === currentMatchId)?.otherPet?.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ height: '300px', overflowY: 'auto', marginBottom: 2 }}>
                {messages.map((msg, index) => (
                  <Box key={msg.id} textAlign={msg.senderId === id ? 'right' : 'left'}>
                    <Typography
                      variant='body2'
                      sx={{
                        background: msg.senderId === id ? '#e0f7fa' : '#fff59d',
                        padding: 1,
                        borderRadius: '8px',
                        display: 'inline-block',
                        maxWidth: '80%',
                        margin: '5px 0'
                      }}
                    >
                      {msg.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {/* <TextField
                fullWidth
                placeholder='Type a message...'
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <Button variant='contained' color='primary' onClick={handleSendMessage} sx={{ marginTop: 2 }}>
                Send
              </Button> */}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}

export default PetMatchProfile
