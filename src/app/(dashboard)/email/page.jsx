'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Grid
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'

import 'react-quill/dist/quill.snow.css'
import { getAllEmailUsers, sendEmail } from '@/app/api' // Adjust the import path accordingly

import ProtectedRoute from '@/components/ProtectedRoute'

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const BulkEmailPage = () => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [emailContent, setEmailContent] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Fetch the list of users from your API
    const fetchUsers = async () => {
      try {
        const usersList = await getAllEmailUsers() // Adjust this function call based on your API structure

        setUsers(usersList?.data?.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  const handleUserChange = useCallback(
    event => {
      const { value } = event.target

      if (value.includes('all')) {
        console.log(users)
        if (selectedUsers.length === users.length) {
          setSelectedUsers([])
        } else {
          console.log('1111', users)
          setSelectedUsers(users.map(user => user.email))
        }
      } else {
        setSelectedUsers(value)
      }
    },
    [selectedUsers, users]
  )

  const handleUserRemove = useCallback(user => {
    setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(u => u !== user))
  }, [])

  const handleSendEmail = useCallback(async () => {
    setSendingEmail(true)

    try {
      const emailData = {
        subject,
        mailBody: emailContent,
        users: selectedUsers
      }

      await sendEmail(emailData)
      alert('Email sent successfully!')
      setEmailContent('')
      setSubject('')
      setSelectedUsers([])
    } catch (error) {
      console.error('Failed to send email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }, [subject, emailContent, selectedUsers])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <CircularProgress />
      </Box>
    )
  }
  console.log(users)
  return (
    <>
      <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
        <Typography variant='h4' gutterBottom>
          Bulk Emailing
        </Typography>
        <FormControl fullWidth variant='outlined' margin='normal'>
          <InputLabel>Select Users</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={handleUserChange}
            label='Select Users'
            renderValue={
              selected =>
                selected
                  .map(email => {
                    const user = users.find(u => u.email === email)
                    return user ? user.name : email // Return user name if found, else email
                  })
                  .join(', ') // Join selected user names with a comma
            }
          >
            <MenuItem value='all'>
              <Checkbox checked={selectedUsers.length === users.length && users.length > 0} />
              <ListItemText primary='All Users' />
            </MenuItem>
            {users?.map(user => (
              <MenuItem key={user._id} value={user.email}>
                <Checkbox checked={selectedUsers?.indexOf(user.email) > -1} />
                <ListItemText primary={user.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label='Subject'
          variant='outlined'
          margin='normal'
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, marginY: 2 }}>
          {selectedUsers?.map(userId => (
            <Chip
              key={userId}
              label={users.find(u => u._id === userId)?.first_name || userId}
              onDelete={() => handleUserRemove(userId)}
              deleteIcon={<CancelIcon />}
            />
          ))}
        </Box>
        <ReactQuill
          value={emailContent}
          onChange={setEmailContent}
          theme='snow'
          style={{ height: '300px', marginBottom: '22px' }}
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['link', 'image']
              // ['clean']
            ]
          }}
          formats={[
            'header',
            'font',
            'list',
            'bullet',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'color',
            'background',
            'align',
            'link',
            'image'
          ]}
        />
      </Box>
      <Grid container justifyContent='center'>
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3} marginY={13}>
          <Button variant='contained' color='primary' onClick={handleSendEmail} fullWidth disabled={sendingEmail}>
            {sendingEmail ? <CircularProgress size={24} /> : 'Send Email'}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

const ProtectedChatPage = () => {
  return (
    <ProtectedRoute requiredPermission='email'>
      <BulkEmailPage />
    </ProtectedRoute>
  )
}

export default ProtectedChatPage
