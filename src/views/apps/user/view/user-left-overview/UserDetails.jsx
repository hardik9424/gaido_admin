// // MUI Imports
// // import { useEffect, useState } from 'react'

// import { useParams } from 'next/navigation'

// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import Typography from '@mui/material/Typography'
// import Chip from '@mui/material/Chip'
// import Divider from '@mui/material/Divider'
// import Button from '@mui/material/Button'

// // Component Imports
// import { useStartTyping } from 'react-use'

// import EditUserInfo from '@components/dialogs/edit-user-info'
// import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
// import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
// import CustomAvatar from '@core/components/mui/Avatar'

// // Vars




// const UserDetails = ({userData}) => {


//   console.log("new",id)

//     const userdata = {
//       firstName: userData.first_name,
//       lastName: 'Hallam',
//       userName: '@shallamb',
//       billingEmail: 'shallamb@gmail.com',
//       status: 'active',
//       role: 'Subscriber',
//       taxId: 'Tax-8894',
//       contact: '+1 (234) 464-0600',
//       language: ['English'],
//       country: 'France',
//       useAsBillingAddress: true
//     }









//   // Vars
//   const buttonProps = (children, color, variant) => ({
//     children,
//     color,
//     variant
//   })

//   return (
//     <>
//       <Card>
//         <CardContent className='flex flex-col pbs-12 gap-6'>
//           <div className='flex flex-col gap-6'>
//             <div className='flex items-center justify-center flex-col gap-4'>
//               <div className='flex flex-col items-center gap-4'>
//                 <CustomAvatar alt='user-profile' src='/images/avatars/1.png' variant='rounded' size={120} />
//                 <Typography variant='h5'>{`${userdata.firstName } ${userdata.lastName}`}</Typography>
//               </div>
//               <Chip label='Author' color='secondary' size='small' variant='tonal' />
//             </div>
//             <div className='flex items-center justify-around flex-wrap gap-4'>
//               <div className='flex items-center gap-4'>
//                 <CustomAvatar variant='rounded' color='primary' skin='light'>
//                   <i className='tabler-checkbox' />
//                 </CustomAvatar>
//                 <div>
//                   <Typography variant='h5'>1.23k</Typography>
//                   <Typography>Task Done</Typography>
//                 </div>
//               </div>
//               <div className='flex items-center gap-4'>
//                 <CustomAvatar variant='rounded' color='primary' skin='light'>
//                   <i className='tabler-briefcase' />
//                 </CustomAvatar>
//                 <div>
//                   <Typography variant='h5'>568</Typography>
//                   <Typography>Project Done</Typography>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div>
//             <Typography variant='h5'>Details</Typography>
//             <Divider className='mlb-4' />
//             <div className='flex flex-col gap-2'>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Username:
//                 </Typography>
//                 <Typography>{userdata.firstName}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Billing Email:
//                 </Typography>
//                 <Typography>{userData.billingEmail}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Status
//                 </Typography>
//                 <Typography color='text.primary'>{userData.status}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Role:
//                 </Typography>
//                 <Typography color='text.primary'>{userData.role}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Tax ID:
//                 </Typography>
//                 <Typography color='text.primary'>{userData.taxId}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Contact:
//                 </Typography>
//                 <Typography color='text.primary'>{userData.contact}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Language:
//                 </Typography>
//                 <Typography color='text.primary'>{userData.language}</Typography>
//               </div>
//               <div className='flex items-center flex-wrap gap-x-1.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Country:
//                 </Typography>
//                 <Typography color='text.primary'>{userData.country}</Typography>
//               </div>
//             </div>
//           </div>
//           <div className='flex gap-4 justify-center'>
//             <OpenDialogOnElementClick
//               element={Button}
//               elementProps={buttonProps('Edit', 'primary', 'contained')}
//               dialog={EditUserInfo}
//               dialogProps={{ data: userData }}
//             />
//             <OpenDialogOnElementClick
//               element={Button}
//               elementProps={buttonProps('Suspend', 'error', 'tonal')}
//               dialog={ConfirmationDialog}
//               dialogProps={{ type: 'suspend-account' }}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   )
// }

// export default UserDetails


// UserDetails.jsx
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'

const UserDetails = ({ userData }) => {
  console.log("ud", userData)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const userdata = {
    firstName: `${capitalizeFirstLetter(userData?.first_name)}`,
    lastName: userData.last_name || 'N/A',
    userName: userData.userName || '@username',
    Email: userData.email || 'N/A',
    status: `${userData.isBlocked}` || 'N/A',
    role: userData.role || 'N/A',
    date_of_Birth: `${userData?.date_of_Birth?.slice(0, 10)} ` || 'N/A',

    contact: userData.contact || 'N/A',

    country: userData.home_port || 'N/A',
    useAsBillingAddress: userData.useAsBillingAddress || false
  }

  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='' src={`${userData?.profile} `} variant='rounded' size={120} />
                <Typography variant='h5'>{`${userdata?.firstName} ${userdata?.lastName} `}</Typography>
              </div>
              <Chip label='User' color='secondary' size='small' variant='tonal' />
            </div>
            <div className='flex items-center justify-around flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                {/* <CustomAvatar variant='rounded' color='primary' skin='light'>
             
                </CustomAvatar> */}
              </div>
            </div>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Username:
                </Typography>
                <Typography>{userdata?.firstName}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{userdata?.Email}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Typography color='text.primary'>{userdata?.status}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Role:
                </Typography>
                <Typography color='text.primary'>{userdata?.role}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Date of Birth
                </Typography>
                <Typography color='text.primary'>{userdata?.date_of_Birth}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact:
                </Typography>
                <Typography color='text.primary'>{userdata?.contact}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Language:
                </Typography>
                <Typography color='text.primary'>{userdata?.language}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Home Port:
                </Typography>
                <Typography color='text.primary'>{userdata?.country}</Typography>
              </div>
            </div>
          </div>
          {/* <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'tonal')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div> */}
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails

