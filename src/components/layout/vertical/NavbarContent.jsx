// 'use client'

// import { useEffect, useRef, useState } from 'react'

// import { motion, AnimatePresence } from 'framer-motion'

// // Third-party Imports
// import classnames from 'classnames'

// // Component Imports
// import NavToggle from './NavToggle'
// import ModeDropdown from '@components/layout/shared/ModeDropdown'
// import UserDropdown from '@components/layout/shared/UserDropdown'

// // Util Imports

// import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// const NavbarContent = () => {
//   const [animateData, , setAnimateData] = useState([])
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const anchorRef = useRef(null)
//   useEffect(() => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user'))
//       if (userData) {
//         const { name: username, mobileNumber: number } = userData
//         setAnimateData([username, number])
//       }
//     } catch (error) {
//       console.error('Failed to parse user data from localStorage', error)
//     }
//   }, [])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prevIndex => (prevIndex + 1) % animateData.length)
//     }, 3000)

//     return () => clearInterval(interval)
//   }, [animateData])

//   return (
//     <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
//       <div className='flex items-center gap-4'>
//         <NavToggle />
//         <ModeDropdown />
//       </div>
//       <div className='flex items-center'>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px' }}>
//           <div
//             style={{ marginRight: '16px', overflow: 'hidden', height: '40px', display: 'flex', alignItems: 'center' }}
//           >
//             <AnimatePresence>
//               <motion.div
//                 key={animateData[currentIndex]}
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: -50, opacity: 0 }}
//                 transition={{ type: 'spring', stiffness: 100, damping: 20 }}
//                 style={{ fontSize: '16px', fontWeight: 'bold', position: 'absolute' }}
//               >
//                 {animateData[currentIndex]}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//         <UserDropdown />
//       </div>
//     </div>
//   )
// }

// export default NavbarContent

'use client'

import { useEffect, useRef, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'

import { motion, AnimatePresence } from 'framer-motion'
import classnames from 'classnames'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  const [animateData, setAnimateData] = useState([])
  const [title, setTitle] = useState()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dateTime, setDateTime] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const pathname = window.location.pathname
    const titleValue = pathname === '/' ? 'Home' : decodeURIComponent(pathname.substring(1))
    setTitle(titleValue)
  }, [window.location.pathname])

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      if (userData) {
        const username = userData.name || 'No Name'
        const number = userData.mobile || 'No Number'
        const email = userData.email || 'No Email'
        setAnimateData([username, number, email])
      } else {
        console.warn('No user data found in localStorage.')
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error)
    }
  }, [])
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (animateData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % animateData.length)
      }, 3000)
    }

    return () => clearInterval(intervalRef.current)
  }, [animateData])

  if (animateData.length === 0) {
    return <div>Loading user data...</div> // Fallback UI
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <span style={{ fontWeight: 'bold' }}>{dateTime}</span>
        <ModeDropdown />
      </div>

      <div className='flex items-center'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px' }}>
          <div
            style={{
              marginRight: '16px',
              overflow: 'hidden',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '150px', // Limit width to prevent overflow
              textAlign: 'center' // Center-align text
            }}
          >
            {animateData.length > 0 && (
              <AnimatePresence>
                <motion.div
                  key={animateData[currentIndex]}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  // style={{ fontSize: '16px', fontWeight: 'bold', position: 'absolute' }}
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // color: 'linear-gradient(270deg, #11817B, #031B1A)'
                    background: 'linear-gradient(270deg, #11817B, #031B1A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {animateData[currentIndex]}
                  {/* <span style={{ color: '#3498db', marginRight: '8px' }}>User:</span>
                  <span style={{ color: '#e74c3c' }}>{animateData[currentIndex]}</span> */}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
