'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import { Card, CardContent, Typography, Button, Box, Alert, Grid } from '@mui/material'

import { getUserChart } from '@/app/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '10px'
        }}
      >
        <p style={{ margin: 0, color: '#6200ea' }}>{label}</p>
        <p style={{ margin: 0 }}>{`User Count: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

const UserChat = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [noData, setNoData] = useState(false)

  const fetchUserData = useCallback(
    async (from, to) => {
      try {
        const response = await getUserChart(from, to)

        if (response.data.data.length === 0) {
          setNoData(true)
        } else {
          setNoData(false)
          setData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },
    [router]
  )

  const formatDateString = date => {
    return date.toISOString().split('T')[0]
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)

    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)

    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const fromDate = formatDateString(firstDay)
    const toDate = formatDateString(lastDay)

    fetchUserData(fromDate, toDate)
  }, [currentDate, fetchUserData])

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: 3,
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#fff'
      }}
    >
      <CardContent>
        <Typography variant='h6' gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
          User Join Percentage - {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </Typography>
        <Box display='flex' justifyContent='center' mb={2} flexWrap='wrap'>
          <Button
            variant='contained'
            onClick={handlePreviousMonth}
            sx={{
              backgroundColor: '#6200ea',
              color: '#fff',
              '&:hover': { backgroundColor: '#3700b3' },
              mx: 1,
              borderRadius: '20px',
              padding: '8px 20px',
              marginBottom: '10px'
            }}
          >
            Previous Month
          </Button>
          <Button
            variant='contained'
            onClick={handleNextMonth}
            sx={{
              backgroundColor: '#6200ea',
              color: '#fff',
              '&:hover': { backgroundColor: '#3700b3' },
              mx: 1,
              borderRadius: '20px',
              padding: '8px 20px',
              marginBottom: '10px'
            }}
          >
            Next Month
          </Button>
        </Box>
        {noData ? (
          <Alert severity='info' sx={{ textAlign: 'center', marginY: 3 }}>
            No data available for this month.
          </Alert>
        ) : (
          <Grid container justifyContent='center'>
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <ResponsiveContainer width='100%' height={400}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                  <XAxis dataKey='date' tick={{ fill: '#6200ea' }} />
                  <YAxis tick={{ fill: '#6200ea' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign='top' height={36} />
                  <Line type='monotone' dataKey='userCount' stroke='#6200ea' strokeWidth={2} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default UserChat
