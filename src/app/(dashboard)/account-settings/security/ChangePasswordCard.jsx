







//--------------------------
'use client'

// React Imports
import { useState, useCallback, useRef, useEffect } from 'react'

import { toast, ToastContainer } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
// import { sendOTP, changePassword } from '@/app/api'

import 'react-toastify/dist/ReactToastify.css'
import { editAdminUserDetails } from '@/app/api'

const ChangePasswordCard = () => {
  // States
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [sessionToken, setSessionToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState()

  const otpRefs = useRef([])

  useEffect(() => {
    const userdata = localStorage.getItem('user')

    if (userdata) {
      const user = JSON.parse(userdata)

      setUserData(user)
    }
  }, [])

  useEffect(() => {
    console.log('ud', userData)
  }, [userData])

  const handleSendOtp = useCallback(async () => {
    setLoading(true)
    const data = { userId: userData?._id, name: userData?.name, mobile: userData?.email, password: newPassword }

    try {
      console.log('pay', data)
      const response = await editAdminUserDetails(data)

      console.log('otp', response)
      if (response.status === 200) {
        toast.success('OTP sent successfully')
      }

      // setSessionToken(response.data.data.sessionToken)
      // setIsOtpSent(true)
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Error sending OTP')
    } finally {
      setLoading(false)
    }
  }, [newPassword])

  const handleOtpChange = useCallback(
    (value, index) => {
      if (value.length > 1) return
      const newOtp = [...otp]

      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1].focus()
      }
    },
    [otp]
  )

  const handleSaveChanges = useCallback(async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match")

      return
    }

    setLoading(true)
    const otpCode = otp.join('')

    console.log('st', sessionToken)
    const data = { email, otp: otpCode, sessionToken, password: newPassword }

    try {
      // await changePassword(data)
      toast.success('Password changed successfully')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error changing password')
      }
    } finally {
      setLoading(false)
    }
  }, [email, otp, sessionToken, newPassword, confirmNewPassword])

  const handleReset = useCallback(() => {
    // setEmail('')
    setOtp(['', '', '', ''])
    setIsOtpSent(false)
    setNewPassword('')
    setConfirmNewPassword('')
    setSessionToken('')
    setLoading(false)
  }, [])

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <form>
          {loading && (
            <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <Grid container spacing={6}>
              <>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Password'
                    onChange={e => setNewPassword(e.target.value)}
                    value={newPassword}
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' onClick={handleSendOtp}>
                    Change Password
                  </Button>
                </Grid>
              </>
            </Grid>
          )}
        </form>
      </CardContent>
      <ToastContainer />
    </Card>
  )
}

export default ChangePasswordCard
