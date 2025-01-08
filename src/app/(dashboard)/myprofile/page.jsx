// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';

// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

// import { Avatar } from '@mui/material';

// import { getMyProfile } from '../../api/myprofile/getMyProfile';
// import avatar from '@/@core/theme/overrides/avatar';

// const AboutOverview = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [img,setImg]=useState(null)

//   useEffect(() => {
//     const avatar = localStorage.getItem("userimage")

//     setImg(avatar)

//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           throw new Error('No token found');
//         }

//         const response = await getMyProfile(token);

//         console.log(response.data)

//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching admin details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderList = useMemo(() => (list) => {
//     return list.map((item, index) => (
//       <div key={index} className='flex items-center gap-2'>
//         <i className={item.icon} />
//         <div className='flex items-center flex-wrap gap-2'>
//           <Typography className='font-medium'>
//             {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
//           </Typography>
//           <Typography> {item?.value.charAt(0).toUpperCase() + item.value.slice(1)}</Typography>
//         </div>
//       </div>
//     ));
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="300px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!data) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="300px">
//         <Typography variant="h6" color="textSecondary">
//           No data available
//         </Typography>
//       </Box>
//     );
//   }

//   const aboutData = [
//     { property: 'Email', value: data.email },
//     { property: 'First Name', value: data.firstName },
//     { property: 'Last Name', value: data.lastName }

//     // { property: 'Role', value: data.role }
//   ]

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={18}>
//         <Card sx={{ height: '80vh' }}>
//           <CardContent className='flex flex-col gap-6'>
//             <div className='flex flex-col gap-4'>
//               <Typography className='uppercase' variant='body2' color='text.disabled'>
//                 About
//               </Typography>
//               {/* <img height={100} width={100} className='rounded' src={img} alt='Profile' /> */}
//               {renderList(aboutData)}
//             </div>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   )
// };

// export default AboutOverview;

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
  ListItemText
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

                    <ListItemText
                      primary={permission.charAt(0).toUpperCase() + permission.slice(1)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
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
