'use client'

import React from 'react'

import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

const UserProfile = ({ userData }) => {
  //   const { email, name, gender, phone, profilePicture, blocked, Pets, Appointments, Payments } = userData

  // Utility function to render sections with no data
  const renderNoData = message => (
    <Typography variant='body2' color='textSecondary'>
      {message}
    </Typography>
  )

  return (
    <Grid container spacing={4}>
      {/* User Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='User Information' />
          <CardContent>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <Avatar src={userData?.profilePicture} alt={name} sx={{ width: 100, height: 100, marginBottom: 2 }} />
              <Typography variant='h5'>{name}</Typography>
              <Typography variant='body2'>Email: {userData?.email}</Typography>
              <Typography variant='body2'>Phone: {userData?.phone}</Typography>
              <Typography variant='body2'>Gender: {userData?.gender}</Typography>
              <Typography variant='body2' color={userData?.blocked.length ? 'red' : 'green'}>
                {userData?.blocked.length ? `Blocked: ${blocked.join(', ')}` : 'Active'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pets Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pets Information' />
          <CardContent>
            {/* {userData?.Pets.length > 0 ? (
              <List>
                {Pets.map(pet => (
                  <ListItem key={pet.id}>
                    <ListItemText
                      primary={`Name: ${pet.name}`}
                      secondary={`Type: ${pet.type}, Breed: ${pet.breed}, Color: ${pet.colour}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              renderNoData('No pets associated with this user.')
            )} */}
          </CardContent>
        </Card>
      </Grid>

      {/* Appointments Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Appointments' />
          <CardContent>
            {userData?.Appointments.length > 0 ? (
              <List>
                {Appointments.map(appointment => (
                  <ListItem key={appointment.id}>
                    <ListItemText
                      primary={`Appointment Type: ${appointment.type}`}
                      secondary={`Status: ${appointment.status}, Slot: ${new Date(appointment.datetimeSlot).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              renderNoData('No appointments found.')
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Payments Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Payments' />
          <CardContent>
            {userData?.Payments.length > 0 ? (
              <List>
                {Payments.map(payment => (
                  <ListItem key={payment.id}>
                    <ListItemText
                      primary={`Payment Amount: ₹${payment.amount}`}
                      secondary={`Status: ${payment.status}, Order ID: ${payment.rpOrderId}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              renderNoData('No payment history found.')
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserProfile
