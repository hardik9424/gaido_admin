'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import CountUp from 'react-countup'
import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material'
import { Dashboard } from '@mui/icons-material'

// Import react-slick components and styles
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Import Recharts components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

// Carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

// Dummy data for cards
const data = [
  {
    title: 'Pets',
    value: <CountUp start={0} end={23} duration={2} />,
    avatarColor: '#f44336',
    cardBackground: 'linear-gradient(to right, #ff6f61, #ff9671)',
    subTitle: 'Total Categories',
    link: '/category'
  },
  {
    title: 'Communities',
    value: <CountUp start={0} end={17} duration={2} />,
    avatarColor: '#4caf50',
    cardBackground: 'linear-gradient(to right, #67b26f, #4ca2cd)',
    subTitle: 'Total Communities',
    link: '/community'
  },
  {
    title: 'Posts',
    value: <CountUp start={0} end={45} duration={2} />,
    avatarColor: '#2196f3',
    cardBackground: 'linear-gradient(to right, #36d1dc, #5b86e5)',
    subTitle: 'Total Posts',
    link: '/post'
  },
  {
    title: 'Users',
    value: <CountUp start={0} end={200} duration={2} />,
    avatarColor: '#ffeb3b',
    cardBackground: 'linear-gradient(to right, #fbc02d, #ff8f00)',
    subTitle: 'Total Users',
    link: '/user/list'
  }
]

// Dummy data for Recharts
const chartData = [
  { name: 'Jan', Users: 40, Posts: 30, Communities: 20 },
  { name: 'Feb', Users: 60, Posts: 50, Communities: 30 },
  { name: 'Mar', Users: 80, Posts: 70, Communities: 40 },
  { name: 'Apr', Users: 100, Posts: 90, Communities: 60 },
  { name: 'May', Users: 120, Posts: 110, Communities: 80 }
]

const UserListCards = () => {
  const [expandedCard, setExpandedCard] = useState(null) // State to manage expanded card

  return (
    <Box p={4} bgcolor='#f4f6f8'>
      <Typography variant='h5' fontWeight='bold' gutterBottom>
        Dashboard Analytics
      </Typography>

      {/* Show Carousel by Default */}
      {expandedCard === null ? (
        <>
          <Slider {...carouselSettings}>
            {data.map((item, index) => (
              <Box key={index} p={2}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    background: item.cardBackground, // Gradient background
                    color: '#fff', // White text for better contrast
                    borderRadius: 4,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                  onClick={() => setExpandedCard(index)} // Expand on click
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: item.avatarColor,
                        width: 56,
                        height: 56,
                        margin: '0 auto'
                      }}
                    >
                      <Dashboard fontSize='large' />
                    </Avatar>
                    <Typography variant='h6' fontWeight='bold' mt={2}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant='h4'
                      fontWeight='bold'
                      mt={1}
                      sx={{ color: '#fff', textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {item.value}
                    </Typography>
                    <Typography variant='body2' mt={1} sx={{ color: '#f0f0f0' }}>
                      {item.subTitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>

          {/* Recharts Section */}
          <Box mt={6}>
            <Typography variant='h6' fontWeight='bold' mb={2}>
              Monthly Trends
            </Typography>
            <Box display='flex' gap={4} flexWrap='wrap' justifyContent='space-between'>
              {/* Line Chart */}
              <Box flex='1 1 45%' height={300}>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  User Growth Over Months
                </Typography>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='Users' stroke='#7367F0' strokeWidth={2} />
                    <Line type='monotone' dataKey='Posts' stroke='#28C76F' strokeWidth={2} />
                    <Line type='monotone' dataKey='Communities' stroke='#FF9F43' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Bar Chart */}
              <Box flex='1 1 45%' height={300}>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Activity Overview
                </Typography>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='Users' fill='#7367F0' barSize={40} />
                    <Bar dataKey='Posts' fill='#28C76F' barSize={40} />
                    <Bar dataKey='Communities' fill='#FF9F43' barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        // Show Expanded Card
        <Box display='flex' flexDirection='column' alignItems='center' p={4}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 600,
              textAlign: 'center',
              background: data[expandedCard].cardBackground, // Gradient background
              color: '#fff', // White text
              borderRadius: 4,
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              padding: 4
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  bgcolor: data[expandedCard].avatarColor,
                  width: 72,
                  height: 72,
                  margin: '0 auto'
                }}
              >
                <Dashboard fontSize='large' />
              </Avatar>
              <Typography variant='h4' fontWeight='bold' mt={2}>
                {data[expandedCard].title}
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                mt={1}
                sx={{ color: '#fff', textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}
              >
                {data[expandedCard].value}
              </Typography>
              <Typography variant='body1' mt={1} sx={{ color: '#f0f0f0' }}>
                {data[expandedCard].subTitle}
              </Typography>
            </CardContent>
          </Card>
          <Button
            variant='contained'
            color='secondary'
            sx={{ mt: 3 }}
            onClick={() => setExpandedCard(null)} // Go back to carousel
          >
            Back to Overview
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default UserListCards
