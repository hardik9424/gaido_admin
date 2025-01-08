export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      return !!token;
    }
    
    return false;
  };
  
  export const redirectToLogin = (router) => {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
  };