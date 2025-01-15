// 'use client'

// // Next Imports
// import { useState ,useEffect} from 'react'

// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'


// // MUI Imports
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { styled, useTheme } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'

// // Third-party Imports
// import classnames from 'classnames'

// // Component Imports
// // import DirectionalIcon from '@components/DirectionalIcon'

// import Logo from '@components/layout/shared/Logo'
// import CustomTextField from '@core/components/mui/TextField'

// // Hook Imports
// import { useImageVariant } from '@core/hooks/useImageVariant'
// import { useSettings } from '@core/hooks/useSettings'



// // Util Imports


// // Styled Custom Components
// const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
//   zIndex: 2,
//   blockSize: 'auto',
//   maxBlockSize: 650,
//   maxInlineSize: '100%',
//   margin: theme.spacing(12),
//   [theme.breakpoints.down(1536)]: {
//     maxBlockSize: 550
//   },
//   [theme.breakpoints.down('lg')]: {
//     maxBlockSize: 450
//   }
// }))

// const MaskImg = styled('img')({
//   blockSize: 'auto',
//   maxBlockSize: 355,
//   inlineSize: '100%',
//   position: 'absolute',
//   insetBlockEnd: 0,
//   zIndex: -1
// })

// const ResetPassword = ({ mode }) => {
//   // Vars
//   const darkImg = '/images/pages/auth-mask-dark.png'
//   const lightImg = '/images/pages/auth-mask-light.png'
//   const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
//   const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'

//   // Hooks
//   const searchParams = useSearchParams()
//   const key = searchParams.get('key')


//   useEffect(() => {
//     console.log(key)
//   }, [key])

//   const { settings } = useSettings()
//   const theme = useTheme()
//   const hidden = useMediaQuery(theme.breakpoints.down('md'))
//   const authBackground = useImageVariant(mode, lightImg, darkImg)
//   const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

//   return (
//     <div className='flex bs-full justify-center'>
//       <div
//         className={classnames(
//           'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
//           {
//             'border-ie': settings.skin === 'bordered'
//           }
//         )}
//       >
//         <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
//         {!hidden && <MaskImg alt='mask' src={authBackground} />}
//       </div>
//       <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
//         <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
//           <Logo />
//         </div>
//         <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
//           <div className='flex flex-col gap-1'>
//             <Typography variant='h4'>Reset Password 🔒</Typography>
//             <Typography>Enter your new password and we&#39;ll send you instructions to reset your password</Typography>
//           </div>
//           <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
//             <CustomTextField autoFocus fullWidth label='New Password' placeholder='Enter your password' />
//             <CustomTextField autoFocus fullWidth label='Confirm New Password' placeholder='Enter your password' />
//             <Button fullWidth variant='contained' type='submit'>
//               Change Password
//             </Button>
//             <Typography className='flex justify-center items-center' color='primary'>
//               <Link href={'/login'} className='flex items-center gap-1.5'>
//                 {/* <DirectionalIcon
//                   ltrIconClass='tabler-chevron-left'
//                   rtlIconClass='tabler-chevron-right'
//                   className='text-xl'
//                 /> */}
//                 <span>Back to login</span>
//               </Link>
//             </Typography>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ResetPassword



//-------------------------------



// 'use client'

// // Next Imports
// import { useState, useEffect } from 'react'

// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'

// // MUI Imports
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { styled, useTheme } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'

// // Third-party Imports
// import classnames from 'classnames'

// // Component Imports
// import Logo from '@components/layout/shared/Logo'
// import CustomTextField from '@core/components/mui/TextField'

// // Hook Imports
// import { useImageVariant } from '@core/hooks/useImageVariant'
// import { useSettings } from '@core/hooks/useSettings'

// // API Import
// import { resetPassword } from '@/app/api' // Make sure to import your resetPassword API method

// // Styled Custom Components
// const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
//   zIndex: 2,
//   blockSize: 'auto',
//   maxBlockSize: 650,
//   maxInlineSize: '100%',
//   margin: theme.spacing(12),
//   [theme.breakpoints.down(1536)]: {
//     maxBlockSize: 550
//   },
//   [theme.breakpoints.down('lg')]: {
//     maxBlockSize: 450
//   }
// }))

// const MaskImg = styled('img')({
//   blockSize: 'auto',
//   maxBlockSize: 355,
//   inlineSize: '100%',
//   position: 'absolute',
//   insetBlockEnd: 0,
//   zIndex: -1
// })

// const ResetPassword = ({ mode }) => {
//   // Vars
//   const darkImg = '/images/pages/auth-mask-dark.png'
//   const lightImg = '/images/pages/auth-mask-light.png'
//   const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
//   const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'

//   // Hooks
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmNewPassword, setConfirmNewPassword] = useState('')
//   const [key, setKey] = useState(null)
//   const searchParams = useSearchParams()

//   const token = searchParams.get('key')

//   useEffect(() => {
//     if (token) {
//       setKey(token)
//     }
//   }, [token])



//   const handlePasswordChange = async (e) => {
//     e.preventDefault()

//     if (newPassword !== confirmNewPassword) {
//       return alert('Passwords do not match')
//     }

//     const data = {
//       token: key,
//       password: newPassword
//     }

//     try {
//       await resetPassword(data)
//       alert('Password changed successfully')
    
//     } catch (error) {
//       alert('Error changing password')
//     }
//   }

//   const { settings } = useSettings()
//   const theme = useTheme()
//   const hidden = useMediaQuery(theme.breakpoints.down('md'))
//   const authBackground = useImageVariant(mode, lightImg, darkImg)
//   const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

//   return (
//     <div className='flex bs-full justify-center'>
//       <div
//         className={classnames(
//           'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
//           {
//             'border-ie': settings.skin === 'bordered'
//           }
//         )}
//       >
//         <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
//         {!hidden && <MaskImg alt='mask' src={authBackground} />}
//       </div>
//       <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
//         <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
//           <Logo />
//         </div>
//         <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
//           <div className='flex flex-col gap-1'>
//             <Typography variant='h4'>Reset Password 🔒</Typography>
//             <Typography>Enter your new password and we&#39;ll send you instructions to reset your password</Typography>
//           </div>
//           <form noValidate autoComplete='off' onSubmit={handlePasswordChange} className='flex flex-col gap-6'>
//             <CustomTextField
//               autoFocus
//               fullWidth
//               label='New Password'
//               placeholder='Enter your password'
//               type='password'
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//             <CustomTextField
//               fullWidth
//               label='Confirm New Password'
//               placeholder='Enter your password'
//               type='password'
//               value={confirmNewPassword}
//               onChange={(e) => setConfirmNewPassword(e.target.value)}
//             />
//             <Button fullWidth variant='contained' type='submit'>
//               Change Password
//             </Button>
//             <Typography className='flex justify-center items-center' color='primary'>
//               <Link href={'/login'} className='flex items-center gap-1.5'>
//                 <span>Back to login</span>
//               </Link>
//             </Typography>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ResetPassword


//------------------




'use client'

// Next Imports
import { useState, useEffect } from 'react'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'



// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// API Import
// import { resetPassword } from '@/app/api' // Make sure to import your resetPassword API method

// Styled Custom Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const ResetPassword = ({ mode }) => {
  // Vars
  // const darkImg = '/images/pages/auth-mask-dark.png'
  // const lightImg = '/images/pages/auth-mask-light.png'
  // const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  // const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'
  // Hooks
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [key, setKey] = useState(null)
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const router = useRouter()

  useEffect(() => {
    if (token) {
      setKey(token)
    }
  }, [token])

  const handlePasswordChange = async e => {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      return alert('Passwords do not match')
    }

    if (!newPassword || newPassword.length < 8) {
      return alert('Password must be at least 8 characters long')
    }

    // if (!/[A-Z]/.test(newPassword)) {
    //   return alert('Password must contain at least one uppercase letter')
    // }

    // if (!/[a-z]/.test(newPassword)) {
    //   return alert('Password must contain at least one lowercase letter')
    // }

    // if (!/[0-9]/.test(newPassword)) {
    //   return alert('Password must contain at least one number')
    // }

    const data = {
      token: key,
      password: newPassword
    }
    console.log('pay', data)

    try {
      // await resetPassword(data)
      alert('Password changed successfully')
      setNewPassword('')
      setConfirmNewPassword('')
      router.push('login')
    } catch (error) {
      alert('Error changing password')
    }
  }

  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Reset Password 🔒</Typography>

            <Typography>Enter your new password and send you instructions to reset your password</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handlePasswordChange} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='New Password'
              placeholder='Enter your password'
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={e => e.preventDefault()}
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <CustomTextField
              fullWidth
              label='Confirm New Password'
              placeholder='Enter your password'
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={e => e.preventDefault()}
                      edge='end'
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant='contained' type='submit'>
              Change Password
            </Button>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={'/login'} className='flex items-center gap-1.5'>
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
