'use client'

import React, { useEffect, useState } from 'react'

import { Box, Grid, Typography, Paper, TextField, Button, Divider, Tab, Tabs } from '@mui/material'

import { ToastContainer, toast } from 'react-toastify'

import PrivacyPage from '@/app/(dashboard)/privacy/page.jsx'

import TermsPage from '@/app/(dashboard)/termsandconditions/page'

import 'react-toastify/dist/ReactToastify.css'
import { getAllReferPoints, updateHelpCenter, updateRefferPoints } from '@/app/api'

// Help Center Component with email and mobile number fields
const HelpCenter = () => {
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  const fetchHelpCenterData = async () => {
    try {
      const response = await getAllReferPoints()
      console.log('help', response)
      if (response.status === 200 && response.data?.data) {
        const { email, mobile } = response.data.data
        setEmail(email)
        setMobile(mobile)
      }
    } catch (error) {
      console.error('Error fetching help center data:', error)
    }
  }

  useEffect(() => {
    fetchHelpCenterData()
  }, [])

  const handleUpdateHelpCenter = async () => {
    try {
      const data = { email, phoneNumber: mobile }
      const payload = {}
      console.log('data', data)
      const response = await updateHelpCenter(data)
      if (response.status === 200) {
        toast.success('Help Center updated successfully!')
      }
    } catch (error) {
      console.error('Error updating Help Center:', error)
      toast.error('Failed to update Help Center')
    }
  }

  return (
    <Box p={3}>
      <ToastContainer position='top-right' autoClose={3000} />
      <Typography variant='h6' gutterBottom>
        Help Center
      </Typography>

      <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={5}>
            <Typography variant='h6'>Email</Typography>
            <TextField
              label='Email Address'
              variant='outlined'
              fullWidth
              margin='normal'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>

          {/* Vertical Divider */}
          <Grid item xs={2}>
            <Divider orientation='vertical' flexItem />
          </Grid>

          <Grid item xs={5}>
            <Typography variant='h6'>Mobile Number</Typography>
            <TextField
              label='Mobile Number'
              variant='outlined'
              fullWidth
              margin='normal'
              value={mobile}
              onChange={e => setMobile(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Update Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant='contained' sx={{ backgroundColor: 'orange' }} onClick={handleUpdateHelpCenter}>
            Update Help Center
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

// Component to manage Refer Points
const ReferPoints = () => {
  const [referToPoints, setReferToPoints] = useState(0)
  const [referredByPoints, setReferredByPoints] = useState(0)
  const [newReferToPoints, setNewReferToPoints] = useState(0)
  const [newReferredByPoints, setNewReferredByPoints] = useState(0)

  const fetchAllRefers = async () => {
    try {
      const response = await getAllReferPoints()
      if (response.status === 200 && response.data?.data) {
        const { referrerPawPoints, referredPawPoints } = response.data.data
        setReferToPoints(referrerPawPoints)
        setReferredByPoints(referredPawPoints)
        setNewReferToPoints(referrerPawPoints)
        setNewReferredByPoints(referredPawPoints)
      }
    } catch (error) {
      console.error('Error fetching refer points:', error)
    }
  }

  useEffect(() => {
    fetchAllRefers()
  }, [])

  const handleUpdatePoints = async () => {
    try {
      const data = { referToPoint: newReferToPoints, referByPoint: newReferredByPoints }
      const response = await updateRefferPoints(data)
      if (response.status === 200) {
        setReferToPoints(newReferToPoints)
        setReferredByPoints(newReferredByPoints)
        toast.success('Refer points updated successfully!')
      }
    } catch (error) {
      console.error('Error updating refer points:', error)
      toast.error('Failed to update refer points')
    }
  }

  return (
    <Box p={3}>
      <ToastContainer position='top-right' autoClose={3000} />
      <Typography variant='h6' gutterBottom>
        Refer Points
      </Typography>

      <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={5}>
            <Typography variant='h6'>Refer To - Points</Typography>
            <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
              Previously Assigned Points: {referToPoints}
            </Typography>
            <TextField
              label='Points to Give'
              variant='outlined'
              fullWidth
              margin='normal'
              value={newReferToPoints}
              onChange={e => setNewReferToPoints(Number(e.target.value))}
            />
          </Grid>

          {/* Vertical Divider */}
          <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider orientation='vertical' flexItem sx={{ borderWidth: '1px', height: '100%' }} />
          </Grid>

          <Grid item xs={5}>
            <Typography variant='h6'>Referred By - Points</Typography>
            <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
              Previously Assigned Points: {referredByPoints}
            </Typography>
            <TextField
              label='Points Received'
              variant='outlined'
              fullWidth
              margin='normal'
              value={newReferredByPoints}
              onChange={e => setNewReferredByPoints(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        {/* Update Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mr: 20 }}>
          <Button variant='contained' sx={{ backgroundColor: 'orange' }} onClick={handleUpdatePoints}>
            Update Points
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }}>
        Settings
      </Typography>

      <Paper elevation={2}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant='scrollable'
          scrollButtons='auto'
          indicatorColor='secondary'
          textColor='primary'
          sx={{ mb: 2 }}
        >
          <Tab sx={{ color: '#ffA500' }} label='Help Center' />
          <Tab sx={{ color: '#ffA500' }} label='Refer Points' />
          <Tab sx={{ color: '#ffA500' }} label='Privacy Policy' />
          <Tab sx={{ color: '#ffA500' }} label='Terms & Condition' />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <HelpCenter />}
        {activeTab === 1 && <ReferPoints />}
        {activeTab === 2 && <PrivacyPage />}
        {activeTab === 3 && <TermsPage />}
      </Box>
    </Box>
  )
}

export default SettingsPage
