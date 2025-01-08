


// import { useCallback, useEffect, useState } from 'react';

// import { useParams } from 'next/navigation';

// // MUI Imports
// import Grid from '@mui/material/Grid'

// import Button from '@mui/material/Button'; // Import Button from Material-UI

// // Component Imports
// import UserDetails from './UserDetails'
// import UserPlan from './UserPlan'

// import { getAllUser, blockUser } from '@/app/api';




// const UserLeftOverview = ({userData}) => {
//   const [users,setUsers]= useState([])


//   const fetchUser = useCallback(async ()=>{
//     try {
//       const response = await getAllUser()

//       setUsers(response.data.data)

      
//     } catch (error) {
      
//     }
//   },[])

//   useEffect(()=>{

//   })

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={12}>
//         <UserDetails userData={userData}/>
//       </Grid>
//       <Grid item xs={12}>
//         <Button variant="contained" color="primary">Next</Button>
//       </Grid>
//       <Grid item xs={12}>
//         <UserPlan />
//       </Grid>
//     </Grid>
//   )
// }

// export default UserLeftOverview






'use client'

import { useCallback, useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// Component Imports
import UserDetails from './UserDetails';
import UserPlan from './UserPlan';

import { getAllUser } from '@/app/api';

const UserLeftOverview = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUser();

      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleNextUser = () => {
    if (!users.length) return;

    const currentIndex = users.findIndex(user => user._id === id);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextUserId = users[nextIndex]._id;

    router.push(`/user/list/${nextUserId}`);
  };

  const handlePreviousUser =()=>{
    if(!users.length)return ;
    const currentIndex = users.findIndex(user=>user._id===id)
    const previousIndex = (currentIndex - 1) % users.length
    const previousUserId = users[previousIndex]?._id 

    router.push(`/user/list/${previousUserId}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails userData={userData} />
      </Grid>
      {/* <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleNextUser}>
          Next
        </Button>
      </Grid> */}
      {/* <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handlePreviousUser}>
          Previous
        </Button>
      </Grid> */}
      {/* <Grid item xs={12}>
        <UserPlan />
      </Grid> */}
    </Grid>
  )
};

export default UserLeftOverview;

