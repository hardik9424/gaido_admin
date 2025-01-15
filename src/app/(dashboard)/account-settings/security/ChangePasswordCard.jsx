







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

  const otpRefs = useRef([])

  useEffect(() => {
    const userEmail = localStorage.getItem("userDetails")

    if (userEmail) {
      const userDetails = JSON.parse(userEmail);
      
      setEmail(userDetails.email)
    }
  }, [])

  const handleSendOtp = useCallback(async () => {
    setLoading(true)
    const data = { email }

    try {
      const response = await sendOTP(data)

      console.log("otp",response)

      setSessionToken(response.data.data.sessionToken)
      setIsOtpSent(true)
      toast.success('OTP sent successfully')
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Error sending OTP')
    } finally {
      setLoading(false)
    }
  }, [email])

  const handleOtpChange = useCallback((value, index) => {
    if (value.length > 1) return
    const newOtp = [...otp]

    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus()
    }
  }, [otp])

  const handleSaveChanges = useCallback(async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match")

      return
    }

    setLoading(true)
    const otpCode = otp.join('')
    
    console.log("st",sessionToken)
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
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <Grid container spacing={6}>
              {!isOtpSent && (
                <>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Email'
                      value={email}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant='contained' onClick={handleSendOtp}>
                      Send OTP
                    </Button>
                  </Grid>
                </>
              )}
              {isOtpSent && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography>Enter OTP</Typography>
                    <div className='flex gap-2'>
                      {otp.map((value, index) => (
                        <CustomTextField
                          key={index}
                          value={value}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          inputProps={{ maxLength: 1 }}
                          inputRef={el => (otpRefs.current[index] = el)}
                        />
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='New Password'
                      type={isNewPasswordShown ? 'text' : 'password'}
                      placeholder='············'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i className={isNewPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Confirm New Password'
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      placeholder='············'
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} className='flex flex-col gap-4'>
                    {/* <Typography variant='h6'>Password Requirements:</Typography>
                    <div className='flex flex-col gap-4'>
                      <div className='flex items-center gap-2.5'>
                        <i className='tabler-circle-filled text-[8px]' />
                        Minimum 8 characters long - the more, the better
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <i className='tabler-circle-filled text-[8px]' />
                        At least one lowercase & one uppercase character
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <i className='tabler-circle-filled text-[8px]' />
                        At least one number, symbol, or whitespace character
                      </div>
                    </div> */}
                  </Grid>
                  <Grid item xs={12} className='flex gap-4'>
                    <Button variant='contained' onClick={handleSaveChanges}>Save Changes</Button>
                    <Button variant='tonal' type='button' color='secondary' onClick={handleReset}>
                      Reset
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </form>
      </CardContent>
      <ToastContainer />
    </Card>
  )
}

export default ChangePasswordCard
