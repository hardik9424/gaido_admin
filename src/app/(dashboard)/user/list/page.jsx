'use client'

import React, { useEffect, useState } from 'react'

import { CircularProgress, Box } from '@mui/material'

import UserList from '@views/apps/user/list'
import { getUserAnalytics } from '@/app/api'

const UserListApp = () => {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState([])

  const fetchAnalytics = async () => {
    try {
      const response = await getUserAnalytics()
      if (response.status === 200) {
        const dataArray = Object.entries(response.data).map(([key, value]) => ({
          label: key,
          data: value
        }))

        setUserData(dataArray)
      } else {
        setUserData({})
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'User | Gaido'
    // Simulate data loading without token checks
    setLoading(false)
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  // Dummy data to simulate user data
  const dummyUserData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Moderator' }
  ]

  return <UserList userData={userData} />
}

export default UserListApp
