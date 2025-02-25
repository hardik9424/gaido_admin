// 'use client'

// // React Imports

// import { useEffect, useState, useCallback } from 'react'

// import { useRouter } from 'next/navigation'

// // MUI Imports
// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import MenuItem from '@mui/material/MenuItem'
// import Chip from '@mui/material/Chip'
// import CircularProgress from '@mui/material/CircularProgress'
// import Box from '@mui/material/Box'

// // Component Imports
// import CustomTextField from '@core/components/mui/TextField'
// import { changeAdminDetails } from '@/app/api'

// // API Imports
// // import { getAdminDetails, updateAdminDetails } from '@/app/api'

// // Initial Data
// const initialData = {
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com',
//   phoneNumber: '+1 (917) 543-9876',
//   address: '123 Main St, New York, NY 10001',
//   state: 'New York',
//   zipCode: '634880',
//   country: 'usa',
//   timezone: 'gmt-12'
// }

// const AccountDetails = () => {
//   const [formData, setFormData] = useState(initialData)
//   const [loading, setLoading] = useState(true)
//   const [adminDetails, setAdminDetails] = useState(null)

//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       router.push('/login')
//     }
//   }, [])

//   useEffect(() => {
//     const userDetails = localStorage.getItem('user')
//     if (userDetails) {
//       const parsedDetails = JSON.parse(userDetails)
//       setAdminDetails(parsedDetails)
//       setLoading(false)
//     } else {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (adminDetails?.id) {
//       // fetchDetails(adminDetails.id)
//     }
//   }, [adminDetails])

//   const handleSave = async () => {
//     if (adminDetails?._id) {
//       const { firstName, lastName, email, phoneNumber } = formData
//       const name = `${firstName} ${lastName}`
//       const payload = { adminId: adminDetails?._id, name, email, mobile: phoneNumber }

//       try {
//         await changeAdminDetails(payload)
//         alert('Admin User Details Updated')
//       } catch (error) {
//         console.error(error)
//       }
//     }
//   }

//   if (loading) {
//     return (
//       <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
//         <CircularProgress />
//       </Box>
//     )
//   }

//   const handleFormChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//   }

//   const formatUserName = (data = '') => {
//     const nameParts = data.split(' ')
//     const firstName = nameParts[0] || '' // First word as the first name
//     const lastName = nameParts.slice(1).join(' ') // Concatenate the rest as the last name
//     return { firstName, lastName }
//   }

//   return (
//     <Card>
//       <CardContent>
//         <form onSubmit={e => e.preventDefault()}>
//           <Grid container spacing={6}>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='First Name'
//                 value={formatUserName(adminDetails?.name).firstName}
//                 onChange={e => handleFormChange('firstName', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Last Name'
//                 value={formatUserName(adminDetails?.name).lastName}
//                 onChange={e => handleFormChange('lastName', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Email'
//                 value={adminDetails?.email}
//                 onChange={e => handleFormChange('email', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Phone Number'
//                 value={adminDetails?.mobile}
//                 onChange={e => handleFormChange('phoneNumber', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} className='flex gap-4 flex-wrap'>
//               <Button variant='contained' type='submit' onClick={handleSave}>
//                 Save Changes
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// export default AccountDetails

'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { changeAdminDetails } from '@/app/api'

// Initial Data
const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
}

const AccountDetails = () => {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [adminDetails, setAdminDetails] = useState(null)

  const router = useRouter()

  const formatUserName = (data = '') => {
    const nameParts = data.split(' ')
    const firstName = nameParts[0] || '' // First word as the first name
    const lastName = nameParts.slice(1).join(' ') // Concatenate the rest as the last name
    return { firstName, lastName }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    const userDetails = localStorage.getItem('user')
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails)
      setAdminDetails(parsedDetails)
      // Populate initial form data
      const { firstName, lastName } = formatUserName(parsedDetails.name || '')
      setFormData({
        firstName,
        lastName,
        email: parsedDetails.email || '',
        phoneNumber: parsedDetails.mobile || ''
      })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const handleSave = async () => {
    if (adminDetails?._id) {
      const { firstName, lastName, email, phoneNumber } = formData
      const name = `${firstName} ${lastName}`
      const payload = { adminId: adminDetails?._id, name, email, mobile: phoneNumber }

      try {
        const response = await changeAdminDetails(payload)
        if (response.status === 200) {
          // window.location.reload()
          toast.success('Details Updated successfully, Please Login again ')
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to update details')
      }
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <CircularProgress />
      </Box>
    )
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <ToastContainer />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='First Name'
                value={formData.firstName}
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Last Name'
                value={formData.lastName}
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Phone Number'
                value={formData.phoneNumber}
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' onClick={handleSave}>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
