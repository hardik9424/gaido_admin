import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

const ProtectedRoute = ({ children, requiredPermission }) => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions')

    if (storedPermissions) {
      try {
        const permissions = JSON.parse(storedPermissions) // Extract permissions array from local storage
        console.log('Permissions:', permissions)
        console.log('Required Permission:', requiredPermission)

        // Check if user has the required permission
        if (permissions.includes(requiredPermission)) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
          router.push('/unauthorized') // Redirect to unauthorized page
        }
      } catch (error) {
        console.error('Error parsing permissions:', error)
        router.push('/login')
      }
    } else {
      router.push('/login') // Redirect to login if no permissions are found
    }
  }, [requiredPermission, router])

  if (!isAuthorized) {
    return null // You can add a loading spinner or placeholder here
  }

  return <>{children}</>
}

export default ProtectedRoute
