'use client'

import React, { useEffect, useState } from 'react'

import {
  Grid,
  Card,
  Typography,
  CardContent,
  CircularProgress,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import Link from 'next/link'

const AboutOverview = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [img, setImg] = useState(null)

  useEffect(() => {
    const avatar = localStorage.getItem('userimage')
    setImg(avatar)

    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('user')
        if (!storedData) {
          throw new Error('No user data found in localStorage')
        }
        const userData = JSON.parse(storedData)
        setData(userData)
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <CircularProgress />
      </Box>
    )
  }

  if (!data) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <Typography variant='h6' color='textSecondary'>
          No data available
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, width: '100%', maxWidth: '1200px', margin: 'auto' }}>
          <Box display='flex' alignItems='center' mb={3}>
            <Avatar src={img} alt='Profile' sx={{ width: 80, height: 80, marginRight: 3 }} />
            <Typography variant='h5' fontWeight='bold'>
              {data?.name}
            </Typography>
          </Box>
          <CardContent>
            {/* Email Section */}
            <Box mb={3}>
              <Typography variant='h6' gutterBottom>
                <EmailIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Email
              </Typography>
              <Typography variant='body1' color='textSecondary'>
                {data?.email}
              </Typography>
            </Box>

            {/* Role Section */}
            <Box mb={3}>
              <Typography variant='h6' gutterBottom>
                <AssignmentIndIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Role
              </Typography>
              <Typography variant='body1' color='textSecondary'>
                {data?.role?.charAt(0).toUpperCase() + data?.role?.slice(1) || ' Not Assigned '}
              </Typography>
            </Box>

            {/* Permissions Section */}
            <Box>
              <Typography variant='h6' gutterBottom>
                <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Permissions
              </Typography>
              <List dense>
                {data?.permissions?.map((permission, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color='success' />
                    </ListItemIcon>
                    <Box>
                      <Typography variant='body2' fontWeight='bold'>
                        {permission.name}
                      </Typography>
                      <Box display='flex' gap={1} mt={1}>
                        {permission.create && <Chip label='Create' color='primary' size='small' />}
                        {permission.read && <Chip label='Read' color='success' size='small' />}
                        {permission.edit && <Chip label='Edit' color='warning' size='small' />}
                        {permission.delete && <Chip label='Delete' color='error' size='small' />}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
