// // 'use client'

// // import React, { useState, useEffect } from 'react'

// // import { useParams } from 'next/navigation'

// // import { Box, List, ListItem, ListItemText, Avatar, Pagination, Typography } from '@mui/material'

// // import { getUserChat } from '@/app/api'

// // const UserList = ({ onSelectUser }) => {
// //   const { id } = useParams()
// //   const [users, setUsers] = useState([])
// //   const [page, setPage] = useState(1)
// //   const [totalPage, setTotalPage] = useState(1)

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const response = await getUserChat(id) // Pass the id and page to the API function

// //         console.log(response)
// //         setUsers(response.data.data)
// //         setTotalPage(Math.ceil(response.data.total / response.data.perPage))
// //       } catch (error) {
// //         console.error('Error fetching users:', error)
// //       }
// //     }

// //     if (id) {
// //       fetchUsers()
// //     }
// //   }, [id, page])

// //   return (
// //     <Box sx={{ width: '25%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
// //       <Typography variant='h6' sx={{ p: 2 }}>
// //         User List
// //       </Typography>
// //       <List>
// //         {users?.map(user => (
// //           <ListItem button key={user._id} onClick={() => onSelectUser(user)}>
// //             <Avatar src={user.profile || '/path-to-default-icon.png'} alt={user.name} />
// //             <ListItemText
// //               primary={user.name}
// //               secondary={user.lastMessage ? user.lastMessage.message : ''}
// //               sx={{ ml: 2 }}
// //             />
// //           </ListItem>
// //         ))}
// //       </List>
// //       <Pagination
// //         count={totalPage}
// //         page={page}
// //         onChange={(event, value) => setPage(value)}
// //         sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
// //       />
// //     </Box>
// //   )
// // }

// // export default UserList

// 'use client'

// import React, { useState, useEffect } from 'react'

// import { useParams } from 'next/navigation'

// import { Box, List, ListItem, ListItemText, Avatar, Pagination, Typography } from '@mui/material'

// import { getUserChat } from '@/app/api'

// const UserList = ({ onSelectUser }) => {
//   const { id } = useParams()
//   const [users, setUsers] = useState([])
//   const [page, setPage] = useState(1)
//   const [totalPage, setTotalPage] = useState(1)

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getUserChat(id) // Pass the id and page to the API function

//         console.log(response)
//         setUsers(response.data.data)
//         setTotalPage(Math.ceil(response.data.total / response.data.perPage))
//       } catch (error) {
//         console.error('Error fetching users:', error)
//       }
//     }

//     if (id) {
//       fetchUsers()
//     }
//   }, [id, page])

//   return (
//     <Box
//       sx={{
//         width: '25%',
//         borderRight: '1px solid #ccc',
//         height: '100vh', // Full height to ensure the scrollbar appears
//         overflowY: 'auto',
//         scrollbarWidth: 'thin', // For Firefox
//         '&::-webkit-scrollbar': { width: '8px' }, // Custom scrollbar width
//         '&::-webkit-scrollbar-track': { background: '#f1f1f1' }, // Track
//         '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' }, // Thumb
//         '&::-webkit-scrollbar-thumb:hover': { background: '#555' } // Hover state
//       }}
//     >
//       <Typography variant='h6' sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
//         User List
//       </Typography>
//       <List sx={{ padding: 0 }}>
//         {users?.map(user => (
//           <ListItem
//             button
//             key={user._id}
//             onClick={() => onSelectUser(user)}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               padding: '10px 16px',
//               borderBottom: '1px solid #eee'
//             }}
//           >
//             <Avatar src={user.profile || '/path-to-default-icon.png'} alt={user.name} sx={{ width: 40, height: 40 }} />
//             <ListItemText
//               primary={user.name}
//               secondary={user.lastMessage ? user.lastMessage.message : ''}
//               sx={{ ml: 2, wordBreak: 'break-word' }}
//             />
//           </ListItem>
//         ))}
//       </List>
//       <Pagination
//         count={totalPage}
//         page={page}
//         onChange={(event, value) => setPage(value)}
//         sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
//       />
//     </Box>
//   )
// }

// export default UserList

'use client'

import React, { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Box, List, ListItem, ListItemText, Avatar, Pagination, Typography } from '@mui/material'

import { getUserChat } from '@/app/api'

const UserList = ({ onSelectUser }) => {
  const { id } = useParams()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserChat(id) // Pass the id and page to the API function

        console.log(response)
        setUsers(response.data.data)
        setTotalPage(Math.ceil(response.data.total / response.data.perPage))
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    if (id) {
      fetchUsers()
    }
  }, [id, page])

  return (
    <Box
      sx={{
        width: '25%',
        height: '100vh',
        overflowY: 'auto',
        border: '1px solid #ddd', // Outer border for card appearance
        borderRadius: '8px', // Rounded corners for card
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for depth
        bgcolor: 'background.paper', // Background color to match card style
        scrollbarWidth: 'thin', // For Firefox
        '&::-webkit-scrollbar': { width: '8px' }, // Custom scrollbar width
        '&::-webkit-scrollbar-track': { background: '#f1f1f1' }, // Track
        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' }, // Thumb
        '&::-webkit-scrollbar-thumb:hover': { background: '#555' } // Hover state
      }}
    >
      <Typography variant='h6' sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
        User List
      </Typography>
      <List sx={{ padding: 0 }}>
        {users?.map(user => (
          <ListItem
            button
            key={user._id}
            onClick={() => onSelectUser(user)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              borderBottom: '1px solid #eee',
              '&:hover': { backgroundColor: '#f9f9f9' } // Hover effect for each item
            }}
          >
            <Avatar src={user.profile || '/path-to-default-icon.png'} alt={user.name} sx={{ width: 40, height: 40 }} />
            <ListItemText
              primary={user.name}
              secondary={user.lastMessage ? user.lastMessage.message : ''}
              sx={{ ml: 2, wordBreak: 'break-word' }}
            />
          </ListItem>
        ))}
      </List>
      <Pagination
        count={totalPage}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
      />
    </Box>
  )
}

export default UserList
