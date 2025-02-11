// 'use client'

// // React Imports
// import { useRef, useState } from 'react'

// // MUI Imports
// import Tooltip from '@mui/material/Tooltip'
// import IconButton from '@mui/material/IconButton'
// import Popper from '@mui/material/Popper'
// import Fade from '@mui/material/Fade'
// import Paper from '@mui/material/Paper'
// import ClickAwayListener from '@mui/material/ClickAwayListener'
// import MenuList from '@mui/material/MenuList'
// import MenuItem from '@mui/material/MenuItem'

// // Hook Imports
// import { useSettings } from '@core/hooks/useSettings'

// const ModeDropdown = () => {
//   // States
//   const [open, setOpen] = useState(false)
//   const [tooltipOpen, setTooltipOpen] = useState(false)

//   // Refs
//   const anchorRef = useRef(null)

//   // Hooks
//   const { settings, updateSettings } = useSettings()

//   const handleClose = () => {
//     setOpen(false)
//     setTooltipOpen(false)
//   }

//   const handleToggle = () => {
//     setOpen(prevOpen => !prevOpen)
//   }

//   const handleModeSwitch = mode => {
//     handleClose()

//     if (settings.mode !== mode) {
//       updateSettings({ mode: mode })
//     }
//   }

//   const getModeIcon = () => {
//     if (settings.mode === 'system') {
//       return 'tabler-device-laptop'
//     } else if (settings.mode === 'dark') {
//       return 'tabler-moon-stars'
//     } else {
//       return 'tabler-sun'
//     }
//   }

//   return (
//     <>
//     <div>
//       <h3>hello</h3>
//     </div>
//       <Tooltip
//         title={settings.mode + ' Mode'}
//         onOpen={() => setTooltipOpen(true)}
//         onClose={() => setTooltipOpen(false)}
//         open={open ? false : tooltipOpen ? true : false}
//         PopperProps={{ className: 'capitalize' }}
//       >
//         <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
//           <i className={getModeIcon()} />
//         </IconButton>
//       </Tooltip>
//       <Popper
//         open={open}
//         transition
//         disablePortal
//         placement='bottom-start'
//         anchorEl={anchorRef.current}
//         className='min-is-[160px] !mbs-3 z-[1]'
//       >
//         {({ TransitionProps, placement }) => (
//           <Fade
//             {...TransitionProps}
//             style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
//           >
//             <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
//               <ClickAwayListener onClickAway={handleClose}>
//                 <MenuList onKeyDown={handleClose}>
//                   <MenuItem
//                     className='gap-3'
//                     onClick={() => handleModeSwitch('light')}
//                     selected={settings.mode === 'light'}
//                   >
//                     <i className='tabler-sun  text-[22px]' />
//                     Light
//                   </MenuItem>
//                   <MenuItem
//                     className='gap-3'
//                     onClick={() => handleModeSwitch('dark')}
//                     selected={settings.mode === 'dark'}
//                   >
//                     <i className='tabler-moon-stars text-[22px]' />
//                     Dark
//                   </MenuItem>
//                   <MenuItem
//                     className='gap-3'
//                     onClick={() => handleModeSwitch('system')}
//                     selected={settings.mode === 'system'}
//                   >
//                     <i className='tabler-device-laptop text-[22px]' />
//                     System
//                   </MenuItem>
//                 </MenuList>
//               </ClickAwayListener>
//             </Paper>
//           </Fade>
//         )}
//       </Popper>
//     </>
//   )
// }

// export default ModeDropdown

'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const ModeDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const { settings, updateSettings } = useSettings()

  const handleClose = () => {
    setOpen(false)
    setTooltipOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleModeSwitch = mode => {
    handleClose()

    if (settings.mode !== mode) {
      updateSettings({ mode: mode })
    }
  }

  const getModeIcon = () => {
    if (settings.mode === 'system') {
      return 'tabler-device-laptop'
    } else if (settings.mode === 'dark') {
      return 'tabler-moon-stars'
    } else {
      return 'tabler-sun'
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px' }}>
        {<div style={{ marginRight: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}> </div>}

        <Tooltip
          title={settings.mode + ' Mode'}
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
          open={open ? false : tooltipOpen ? true : false}
          PopperProps={{ className: 'capitalize' }}
        >
          {/* <IconButton ton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          <i className={getModeIcon()} />
        </IconButton> */}
        </Tooltip>
        <Popper
          open={open}
          transition
          disablePortal
          placement='bottom-start'
          anchorEl={anchorRef.current}
          className='min-is-[160px] !mbs-3 z-[1]'
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
            >
              <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList onKeyDown={handleClose}>
                    <MenuItem
                      className='gap-3'
                      onClick={() => handleModeSwitch('light')}
                      selected={settings.mode === 'light'}
                    >
                      <i className='tabler-sun text-[22px]' />
                      Light
                    </MenuItem>
                    <MenuItem
                      className='gap-3'
                      onClick={() => handleModeSwitch('dark')}
                      selected={settings.mode === 'dark'}
                    >
                      <i className='tabler-moon-stars text-[22px]' />
                      Dark
                    </MenuItem>
                    <MenuItem
                      className='gap-3'
                      onClick={() => handleModeSwitch('system')}
                      selected={settings.mode === 'system'}
                    >
                      <i className='tabler-device-laptop text-[22px]' />
                      System
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </>
  )
}

export default ModeDropdown
