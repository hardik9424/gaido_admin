// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserLeftOverview from '@views/apps/user/view/user-left-overview'
import UserRight from '@views/apps/user/view/user-right'
// import { getAllUser } from '@/app/api'

const OverViewTab = dynamic(() => import('@views/apps/user/view/user-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/user/view/user-right/security'))
const BillingPlans = dynamic(() => import('@views/apps/user/view/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/user/view/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/user/view/user-right/connections'))
// const ChatDetails = dynamic(() => import('@views/apps/user/view/user-right/chat'))

// Vars
const tabContentList = data => ({
  overview: <OverViewTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlans data={data} />,
  notifications: <NotificationsTab />,
  // Chat: <ChatDetails />
})

// connections: <ConnectionsTab />

const getPricingData = async () => {
  // Vars
  // const res = await getAllUser()

  return res?.data?.data

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const UserViewTab = async () => {
  // Vars
  const data = getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(data)} />
      </Grid>
    </Grid>
  )
}

export default UserViewTab
