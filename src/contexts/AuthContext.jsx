// // contexts/AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react';

// import { useRouter } from 'next/router';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Check user authentication state here, e.g., from localStorage or API
//     const storedUser = JSON.parse(localStorage.getItem(''));

//     if (storedUser) {

//       setUser(storedUser);
      
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);







// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {

        try {

          const  data  = localStorage.getItem('userDetails')

          console.log("userdata",data)

          setUser(data);
          setPermissions(data.role.permissions);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setUser(null);
          setPermissions([]);
        }
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setPermissions(data.user.permissions);
      router.push('/login');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
