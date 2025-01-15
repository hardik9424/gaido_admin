// 'use client'

// // MUI Imports

// import { useEffect, useState } from 'react'

// import { useTheme } from '@mui/material/styles'
// import {
//   Person,
//   Dashboard,
//   Groups,
//   EventAvailable,
//   AccountBalance,
//   CardMembership,
//   PostAdd,
//   Pets,
//   LocalHospital,
//   MedicalServices,
//   Inventory,
//   Settings,
//   LocalOffer,
//   ShoppingCart,
//   Wallpaper,
//   NotificationsActive,
//   Category,
//   AdminPanelSettings,
//   Create,
//   Shop,
//   OutboundRounded,
//   DeliveryDining,
//   FoodBank,
//   Shop2Sharp,
//   VerifiedUserRounded,
//   RollerShades,
//   AdminPanelSettingsTwoTone,
//   AdminPanelSettingsSharp,
//   RollerShadesClosedTwoTone,
//   Verified,
//   OtherHouses,
//   House,
//   Collections,
//   ManageHistorySharp,
//   TempleBuddhist,
//   Report,
//   BrandingWatermark
// } from '@mui/icons-material'

// // Third-party Imports
// import PerfectScrollbar from 'react-perfect-scrollbar'

// // Component Imports
// import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// // Hook Imports
// import { useSettings } from '@core/hooks/useSettings'
// import useVerticalNav from '@menu/hooks/useVerticalNav'

// // Styled Component Imports
// import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// // Style Imports
// import menuItemStyles from '@core/styles/vertical/menuItemStyles'
// import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// const RenderExpandIcon = ({ open, transitionDuration }) => (
//   <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
//     <i className='tabler-chevron-right' />
//   </StyledVerticalNavExpandIcon>
// )

// const VerticalMenu = ({ scrollMenu }) => {
//   const [permissions, setPermissions] = useState([])

//   // Hooks
//   const theme = useTheme()
//   const verticalNavOptions = useVerticalNav()
//   const { settings } = useSettings()
//   const { isBreakpointReached } = useVerticalNav()

//   // Vars
//   const { transitionDuration } = verticalNavOptions
//   const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

//   useEffect(() => {
//     const savedPermissions = JSON.parse(localStorage.getItem('permissions')) || []
//     setPermissions(savedPermissions)
//   }, [])

//   // Map permissions to menu items
//   const permissionMap = {
//     Dashboard: { href: '/home', icon: <Dashboard />, label: 'Dashboard' },
//     'Create Membership': { href: '/category', icon: <Category />, label: 'Membership' },
//     User: { href: '/user/list', icon: <Person />, label: 'Users' },
//     Community: { href: '/community', icon: <Groups />, label: 'Community' },
//     pawmanagment: { href: '/pawmanagment', icon: <Pets />, label: 'PawVerse Management' },
//     pawmanagment: {
//       icon: <ManageHistorySharp />,
//       label: 'Pets Management',
//       children: [
//         { href: '/pawmanagment', icon: <Pets />, label: 'Pets' },
//         { href: '/temperament', icon: <TempleBuddhist />, label: 'Temperament' },
//         { href: '/disease ', icon: <TempleBuddhist />, label: 'Disease ' }
//       ]
//     },

//     'Report User': { href: '/reportuser', icon: <Settings />, label: 'Report User' },
//     // 'PawPoint Managment': { href: '/pointmanagment', icon: <NotificationsIcon />, label: 'PawPoint Management' },
//     Settings: { href: '/settings', icon: <Settings />, label: 'Settings' },
//     Coupons: { href: '/coupons', icon: <LocalOffer />, label: 'Coupons' },
//     Accounts: {
//       icon: <AccountBalance />,
//       label: 'Accounts',
//       children: [
//         { href: '/role/newrole', label: 'Create Role', icon: <AdminPanelSettingsTwoTone /> },
//         { href: '/role/createuser', label: 'Create User', icon: <VerifiedUserRounded /> }
//         // { href: '/chat ', label: 'Chat', icon: <CreateUserIcon /> }
//       ]
//     },
//     shop: {
//       icon: <ShoppingCart />,
//       label: 'Shop Management',
//       children: [
//         { href: '/shop', label: 'Shop', icon: <Shop2Sharp /> },
//         { href: '/orders', label: 'Orders', icon: <DeliveryDining /> },
//         { href: '/collections', label: 'Collections', icon: <FoodBank /> },
//         { href: '/brands', label: 'Brands', icon: <BrandingWatermark /> }
//       ]
//     },

//     notification: { href: '/notification', icon: <NotificationsActive />, label: 'Notification' },
//     banner: { href: '/banner', icon: <Wallpaper />, label: 'Banner' },
//     hospital: { href: '/hospital', icon: <LocalHospital />, label: 'Hospital Profile' },
//     vet: { href: '/vet', icon: <MedicalServices />, label: ' Vets Profile' },
//     'Payments Management': { href: '/subcategory', icon: <Create />, label: 'Payments Management' },
//     Appointments: {
//       icon: <Create />,
//       label: 'Appointments',
//       children: [
//         { href: '/appointments/clinic', label: 'Clinic', icon: <OtherHouses /> },
//         { href: '/appointments/house', label: 'In-house', icon: <House /> },
//         { href: '/package', icon: <Collections />, label: 'Package' }
//       ]
//     },
//     reports: { href: '/reportuser', label: 'Reports', icon: <Report /> }
//   }

//   return (
//     <ScrollWrapper
//       {...(isBreakpointReached
//         ? {
//             className: 'bs-full overflow-y-auto overflow-x-hidden',
//             onScroll: container => scrollMenu(container, false)
//           }
//         : {
//             options: { wheelPropagation: false, suppressScrollX: true },
//             onScrollY: container => scrollMenu(container, true)
//           })}
//     >
//       <Menu
//         popoutMenuOffset={{ mainAxis: 23 }}
//         menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
//         renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
//         renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
//         menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
//       >
//         {permissions.map(permission => {
//           const menuItem = permissionMap[permission]
//           if (menuItem) {
//             if (menuItem.children) {
//               return (
//                 <SubMenu key={permission} label={menuItem.label} icon={menuItem.icon}>
//                   {menuItem.children.map(child => (
//                     <MenuItem key={child.href} href={child.href} icon={child.icon}>
//                       {child.label}
//                     </MenuItem>
//                   ))}
//                 </SubMenu>
//               )
//             }

//             return (
//               <MenuItem key={permission} href={menuItem.href} icon={menuItem.icon}>
//                 {menuItem.label}
//               </MenuItem>
//             )
//           }
//           return null
//         })}
//       </Menu>
//     </ScrollWrapper>
//   )
// }

// export default VerticalMenu

'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import {
  Person,
  AccountBalance,
  FactoryOutlined,
  Functions,
  WorkHistory,
  Policy,
  TerminalSharp,
  AdminPanelSettingsTwoTone,
  VerifiedUserRounded
} from '@mui/icons-material'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Map all pages to menu items
  const permissionMap = {
    Users: { href: '/user/list', icon: <Person />, label: 'Users' },
    Admin: {
      icon: <AccountBalance />,
      label: 'Admin',
      children: [
        { href: '/role/newrole', label: 'Create Role', icon: <AdminPanelSettingsTwoTone /> },
        { href: '/role/createuser', label: 'Create User', icon: <VerifiedUserRounded /> }
      ]
    },
    Industry: {
      icon: <FactoryOutlined />,
      label: 'Industry',
      href: '/industory'
    },
    Functions: {
      icon: <Functions />,
      label: 'Functions',
      href: '/functions'
    },
    'Job Roles': {
      icon: <WorkHistory />,
      label: 'Job Roles',
      href: '/jobroles'
    },
    News: {
      icon: <WorkHistory />,
      label: 'News',
      href: '/news'
    },
    'Privacy Policy': {
      icon: <Policy />,
      label: 'Privacy Policy',
      href: '/privacy'
    },
    'Terms & Condition': {
      icon: <TerminalSharp />,
      label: 'Terms & Condition',
      href: '/termsandconditions'
    }
  }

  // Get permissions from localStorage
  const [permissions, setPermissions] = useState([])
  useEffect(() => {
    const savedPermissions = JSON.parse(localStorage.getItem('permissions')) || []
    setPermissions(savedPermissions)
  }, [])

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {permissions?.map(permission => {
          const menuItem = permissionMap[permission.name] // Match only by the 'name' field
          if (menuItem) {
            if (menuItem.children) {
              return (
                <SubMenu key={permission.name} label={menuItem.label} icon={menuItem.icon}>
                  {menuItem.children.map(child => (
                    <MenuItem key={child.href} href={child.href} icon={child.icon}>
                      {child.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              )
            }

            return (
              <MenuItem key={permission.name} href={menuItem.href} icon={menuItem.icon}>
                {menuItem.label}
              </MenuItem>
            )
          }
          return null
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
