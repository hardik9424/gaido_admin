// hoc/withAuth.js
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAuth } from '../contexts/AuthContext';

const withAuth = (WrappedComponent, requiredPermissions = []) => {
  const Wrapper = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      } else if (!requiredPermissions.every(permission => user.permissions.includes(permission))) {
        router.push('/unauthorized');
      }
    }, [user, router, requiredPermissions]);

    if (!user || !requiredPermissions.every(permission => user.permissions.includes(permission))) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
