// components/withAuth.js

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';


import Box from '@mui/material/Box';

import CircularProgress from '@mui/material/CircularProgress';

import { isAuthenticated, redirectToLogin } from '../utils/auth'



const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        redirectToLogin(router);
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
