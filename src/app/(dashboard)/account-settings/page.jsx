// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@/app/(dashboard)/account-settings'

const AccountTab = dynamic(() => import('@/app/(dashboard)/account-settings/account'))
const SecurityTab = dynamic(() => import('@/app/(dashboard)/account-settings/security'))
const BillingPlansTab = dynamic(() => import('@/app/(dashboard)/account-settings/billing-plans'))
const NotificationsTab = dynamic(() => import('@/app/(dashboard)/account-settings/notifications'))
const ConnectionsTab = dynamic(() => import('@/app/(dashboard)/account-settings/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />
})

// connections: <ConnectionsTab />

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
