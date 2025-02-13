'use client'

// React Imports
import { useState, useEffect, useCallback } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

import Cookies from 'js-cookie'
// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Yup from 'yup'

// API Imports
import { loginAdminUser } from '../app/api/index.js'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

import { useSettings } from '@core/hooks/useSettings'
import { Dashboard } from '@mui/icons-material'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 780,
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

const LoginV2 = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/pages/misc-mask-light.png'
  const borderedDarkIllustration = '/images/loader/login.png'
  const borderedLightIllustration = '/images/loader/login.png'

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )
  const emailValidationRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .matches(emailValidationRegex, 'Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [router])
  // const setCookie = (name, value, days) => {
  //   const date = new Date()
  //   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  //   const expires = 'expires=' + date.toUTCString()
  //   document.cookie = `${name}=${value}; ${expires}; path=/; Secure; HttpOnly`
  // }

  const handleClickShowPassword = useCallback(() => {
    setIsPasswordShown(prev => !prev)
  }, [])

  // const handleLogin = useCallback(async () => {
  //   // Validate form inputs using Yup schema
  //   validationSchema
  //     .validate({ email, password }, { abortEarly: false })
  //     .then(async () => {
  //       try {
  //         const data = { email, password }
  //         const apiResponse = await login(data)
  //         console.log('ap', apiResponse.data.data)
  //         router.push('/home')
  //         if (apiResponse?.data?.data) {
  //           const { token, user } = apiResponse?.data?.data
  //           const { role, permissions } = user

  //           localStorage.setItem('token', token)
  //           localStorage.setItem('role', role)
  //           localStorage.setItem('permissions', JSON.stringify(permissions))
  //           localStorage.setItem('user', JSON.stringify(user))
  //         }
  //

  //         // if (apiResponse?.data?.data?.token) {
  //         //   const userDetails = apiResponse.data.data.userDetails[0]
  //         //   const role = userDetails.role

  //         //   localStorage.setItem('role', JSON.stringify(role))
  //         //   localStorage.setItem('userDetails', JSON.stringify(userDetails))
  //         //   localStorage.setItem('token', apiResponse.data.data.token)

  //         toast.success('Login successful!')
  //         //   const redirect = JSON.parse(localStorage.getItem('userDetails'))

  //         //   const permissions = redirect.role?.permissions

  //         //   if (permissions && permissions.length > 0) {
  //         //     // router.push(permissions[0].name === 'admin_user' ? permissions[1].name : permissions[0].name)
  //         //   } else {
  //         //     router.push('/app/unauthorize') // Default redirect if no permissions are available
  //         //   }
  //         // } else {
  //         //   toast.error(error?.response?.data?.message || 'Login failed')
  //         //   router.push('/unauthorize')
  //         // }
  //       } catch (error) {
  //         console.log(error)
  //         toast.error(error?.response?.data?.message || 'An error occurred. Please try again.')
  //       }
  //     })
  //     .catch(err => {
  //       // Set validation errors
  //       err?.inner?.forEach(error => {
  //         if (error.path === 'email') {
  //           setEmailError(error.message)
  //         }
  //         if (error.path === 'password') {
  //           setPasswordError(error.message)
  //         }
  //       })
  //     })
  // }, [email, password, router, validationSchema])
  const handleLogin = useCallback(async () => {
    setError('')
    setEmailError('')
    setPasswordError('')

    validationSchema
      .validate({ email, password }, { abortEarly: false })
      .then(async () => {
        try {
          const data = { email, password }
          const apiResponse = await loginAdminUser(data)
          console.log('login', apiResponse)

          if (apiResponse?.data?.data) {
            const { accessToken, user } = apiResponse?.data?.data
            const { role, permissions } = user
            // Cookies.set('authToken', accessToken, { expires: 7, path: '/' })

            // Save token, role, permissions, and user to localStorage
            // setCookie('authToken', token, 7)
            document.cookie =
              `token=${accessToken}; path=/; expires=` + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()

            localStorage.setItem('token', accessToken)
            localStorage.setItem('role', role)
            localStorage.setItem('permissions', JSON.stringify(permissions))
            localStorage.setItem('user', JSON.stringify(user))

            // Set the token as a cookie
            // setCookie('authToken', accessToken, 7)

            // Define permission-to-page mapping
            const permissionPageMap = {
              Admin: '/role/newrole',
              Users: '/user/list',
              // Dashboard: '/home',
              Dashboard: '/role/newrole',
              Functions: '/functions',
              Industry: '/industory',
              'Job Roles': '/jobroles',
              News: '/news',
              'Privacy Policy': '/privacypolicy',
              'Terms & Conditions': '/termsandconditions'
            }
            let redirectPage = '/user/list'
            for (let permission of permissions) {
              if (permissionPageMap[permission.name]) {
                redirectPage = permissionPageMap[permission.name]
                break
              }
            }
            router.push(redirectPage)
            // const validPermissions = permissions.filter(permission => permissionPageMap[permission])
            // // Determine which page to navigate based on user's permissions
            // const defaultPage = permissions.find(permission => permissionPageMap[permission])
            //   ? permissionPageMap[validPermissions[0]]
            //   : '/home'

            // Redirect to the determined page
            // router.push(defaultPage)

            // router.push(permissionPageMap.Users)

            toast.success('Login successful!')
          } else {
            toast.error('Invalid login response.')
          }
        } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message || 'An error occurred. Please try again.')
        }
      })
      .catch(err => {
        // Set validation errors
        err?.inner?.forEach(error => {
          if (error.path === 'email') {
            setEmailError(error.message)
          }
          if (error.path === 'password') {
            setPasswordError(error.message)
          }
        })
      })
  }, [email, password, router, validationSchema])

  return (
    <div className='flex bs-full justify-center'>
      <ToastContainer />
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div
          className={classnames(
            'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
            {
              'border-ie': settings.skin === 'bordered'
            }
          )}
        >
          <LoginIllustration sx={{ width: '100%' }} src={characterIllustration} alt='character-illustration' />
          {!hidden && <MaskImg alt='mask' src={authBackground} />}
        </div>
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            onSubmit={e => {
              e.preventDefault()
              handleLogin()
            }}
            className='flex flex-col gap-5'
          >
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {error && <Typography color='error'>{error}</Typography>}
            {/* <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <Typography
                className='text-end'
                style={{
                  background: 'linear-gradient(90deg, #11817B, #031B1A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none' // Optional: Remove underline
                }}
                component={Link}
                href={'forgotpassword'}
              >
                Forgot password?
              </Typography>
            </div> */}
            <Button
              fullWidth
              variant=''
              style={{
                background: 'linear-gradient(90deg, #11817B, #031B1A)',
                color: 'white', // Ensure the text is visible on the gradient
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px' // Optional: Add some rounding
              }}
              type='submit'
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
