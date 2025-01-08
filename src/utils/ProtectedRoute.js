import React from 'react';

import { useRouter } from 'next/router';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const router = useRouter();
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  let permissions = [];

  if (role) {
    try {
      const decodedToken = JSON.parse(role); // Decoding JWT without a library

      permissions = decodedToken.permissions;
    } catch (error) {
      router.push('/login');

      return null;
    }
  } else {
    router.push('/login');

    return null;
  }

  if (!permissions.includes(requiredPermission)) {
    return <div>You are not authorized to view this page.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
