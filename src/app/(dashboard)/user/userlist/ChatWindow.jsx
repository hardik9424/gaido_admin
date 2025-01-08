// // // // 'use client'

// // // // import React, { useState, useEffect } from 'react';

// // // // import { Box, Typography, Paper, Avatar } from '@mui/material';

// // // // import { getUserChats } from '@/app/api';

// // // // const ChatWindow = ({ user }) => {
// // // //   const [messages, setMessages] = useState([]);

// // // //   useEffect(() => {
// // // //     const fetchMessages = async () => {
// // // //       try {
// // // //         const response = await getUserChats(user.roomId);
        
// // // //         setMessages(response.data.data); // Assuming your API response contains a data field with messages
// // // //       } catch (error) {
// // // //         console.error('Error fetching messages:', error);
// // // //       }
// // // //     };

// // // //     if (user) {
// // // //       fetchMessages();
// // // //     }
// // // //   }, [user]);

// // // //   if (!user) {
// // // //     return (
// // // //       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // //         <Typography variant="h6">Select a user to view chats</Typography>
// // // //       </Paper>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
// // // //       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
// // // //         <Typography variant="h6">{user.name}</Typography>
// // // //         {messages.map((msg, index) => (
// // // //           <Box
// // // //             key={index}
// // // //             sx={{
// // // //               display: 'flex',
// // // //               alignItems: 'center',
// // // //               justifyContent: msg.senderId === 'Me' ? 'flex-end' : 'flex-start',
// // // //               mt: 2
// // // //             }}
// // // //           >
// // // //             {msg.senderId !== 'Me' && (
// // // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
// // // //             )}
// // // //             <Box sx={{ maxWidth: '70%', p: 2, bgcolor: msg.senderId === 'Me' ? 'primary.main' : 'grey.300', color: msg.senderId === 'Me' ? 'white' : 'black', borderRadius: 2 }}>
// // // //               <Typography variant="body2">{msg.senderId}</Typography>
// // // //               <Typography variant="body1">{msg.message}</Typography>
// // // //             </Box>
// // // //             {msg.senderId === 'Me' && (
// // // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
// // // //             )}
// // // //           </Box>
// // // //         ))}
// // // //       </Paper>
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default ChatWindow;







// // // // 'use client'

// // // // import React, { useState, useEffect } from 'react';

// // // // import { Box, Typography, Paper, Avatar } from '@mui/material';

// // // // import { getUserChats } from '@/app/api';

// // // // const ChatWindow = ({ user }) => {
// // // //   const [messages, setMessages] = useState([]);

// // // //   useEffect(() => {
// // // //     const fetchMessages = async () => {
// // // //       try {
// // // //         const response = await getUserChats(user.roomid);

// // // //         setMessages(response.data.data);
// // // //       } catch (error) {
// // // //         console.error('Error fetching messages:', error);
// // // //       }
// // // //     };

// // // //     if (user) {

// // // //       fetchMessages();
// // // //     }
// // // //   }, [user]);

// // // //   if (!user) {
// // // //     return (
// // // //       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // //         <Typography variant="h6">Select a user to view chats</Typography>
// // // //       </Paper>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
// // // //       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
// // // //         <Typography variant="h6">{user.name}</Typography>
// // // //         {messages.map((msg, index) => (
// // // //           <Box
// // // //             key={index}
// // // //             sx={{
// // // //               display: 'flex',
// // // //               alignItems: 'center',
// // // //               justifyContent: msg.senderId === 'Me' ? 'flex-end' : 'flex-start',
// // // //               mt: 2,
// // // //             }}
// // // //           >
// // // //             {msg.senderId !== 'Me' && (
// // // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
// // // //             )}
// // // //             <Box
// // // //               sx={{
// // // //                 maxWidth: '70%',
// // // //                 p: 2,
// // // //                 bgcolor: msg.senderId === 'Me' ? 'primary.main' : 'grey.300',
// // // //                 color: msg.senderId === 'Me' ? 'white' : 'black',
// // // //                 borderRadius: 2,
// // // //               }}
// // // //             >
// // // //               <Typography variant="body2">{msg.senderId}</Typography>
// // // //               <Typography variant="body1">{msg.message}</Typography>
// // // //             </Box>
// // // //             {msg.senderId === 'Me' && (
// // // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
// // // //             )}
// // // //           </Box>
// // // //         ))}
// // // //       </Paper>
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default ChatWindow;






// // // 'use client'

// // // import React, { useState, useEffect } from 'react';

// // // import { Box, Typography, Paper, Avatar } from '@mui/material';

// // // import { getUserChats } from '@/app/api';

// // // const ChatWindow = ({ user }) => {
// // //   const [messages, setMessages] = useState([]);

// // //   useEffect(() => {
// // //     const fetchMessages = async () => {
// // //       if (!user || !user.roomId) {
// // //         console.error('Invalid user or roomId');

// // //         return;
// // //       }

// // //       try {
// // //         console.log(user)
// // //         const response = await getUserChats(user.roomId);

// // //         console.log(response)

// // //         setMessages(response.data.data);
// // //       } catch (error) {
// // //         console.error('Error fetching messages:', error);
// // //       }
// // //     };

// // //     if (user) {
// // //       fetchMessages();
// // //     }
// // //   }, [user]);

// // //   if (!user) {
// // //     return (
// // //       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // //         <Typography variant="h6">Select a user to view chats</Typography>
// // //       </Paper>
// // //     );
// // //   }

// // //   return (
// // //     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
// // //       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
// // //         <Typography variant="h6">{user.name}</Typography>
// // //         {messages.map((msg, index) => (
// // //           <Box
// // //             key={index}
// // //             sx={{
// // //               display: 'flex',
// // //               alignItems: 'center',
// // //               justifyContent: msg.senderId === 'Me' ? 'flex-end' : 'flex-start',
// // //               mt: 2,
// // //             }}
// // //           >
// // //             {msg.senderId !== 'Me' && (
// // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
// // //             )}
// // //             <Box
// // //               sx={{
// // //                 maxWidth: '70%',
// // //                 p: 2,
// // //                 bgcolor: msg.senderId === 'Me' ? 'primary.main' : 'grey.300',
// // //                 color: msg.senderId === 'Me' ? 'white' : 'black',
// // //                 borderRadius: 2,
// // //               }}
// // //             >
// // //               <Typography variant="body2">{msg.senderId}</Typography>
// // //               <Typography variant="body1">{msg.message}</Typography>
// // //             </Box>
// // //             {msg.senderId === 'Me' && (
// // //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
// // //             )}
// // //           </Box>
// // //         ))}
// // //       </Paper>
// // //     </Box>
// // //   );
// // // };

// // // export default ChatWindow;





// // 'use client';

// // import React, { useState, useEffect } from 'react';

// // import { Box, Typography, Paper, Avatar } from '@mui/material';

// // import { getUserChats } from '@/app/api';

// // const ChatWindow = ({ user }) => {
// //   const [messages, setMessages] = useState([]);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       if (!user || !user.roomId) {
// //         console.error('Invalid user or roomId');

// //         return;
// //       }

// //       try {
// //         console.log(user);
// //         const response = await getUserChats(user.roomId);

// //         console.log(response);

// //         setMessages(response.data);
// //       } catch (error) {
// //         console.error('Error fetching messages:', error);
// //       }
// //     };

// //     if (user) {
// //       fetchMessages();
// //     }
// //   }, [user]);

// //   if (!user) {
// //     return (
// //       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// //         <Typography variant="h6">Select a user to view chats</Typography>
// //       </Paper>
// //     );
// //   }

// //   return (
// //     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
// //       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
// //         <Typography variant="h6">{user.name}</Typography>
// //         {messages.map((msg, index) => (
// //           <Box
// //             key={index}
// //             sx={{
// //               display: 'flex',
// //               alignItems: 'center',
// //               justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
// //               mt: 2,
// //             }}
// //           >
// //             {msg.senderId !== user._id && (
// //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
// //             )}
// //             <Box
// //               sx={{
// //                 maxWidth: '70%',
// //                 p: 2,
// //                 bgcolor: msg.senderId === user._id ? 'primary.main' : 'grey.300',
// //                 color: msg.senderId === user._id ? 'white' : 'black',
// //                 borderRadius: 2,
// //               }}
// //             >
// //               <Typography variant="body2">{msg.senderId}</Typography>
// //               <Typography variant="body1">{msg.message}</Typography>
// //             </Box>
// //             {msg.senderId === user._id && (
// //               <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
// //             )}
// //           </Box>
// //         ))}
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default ChatWindow;




// 'use client';

// import React, { useState, useEffect } from 'react';

// import { Box, Typography, Paper, Avatar } from '@mui/material';

// import { getUserChats } from '@/app/api';

// const ChatWindow = ({ user }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!user || !user.roomId) {
//         console.error('Invalid user or roomId');

//         return;
//       }

//       try {
//         const response = await getUserChats(user.roomId);

//         console.log(response);

//         if (Array.isArray(response.data)) {
//           setMessages(response.data.data);
//         } else {
//           setMessages([]);
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//         setMessages([]);
//       }
//     };

//     if (user) {
//       fetchMessages();
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <Typography variant="h6">Select a user to view chats</Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
//         <Typography variant="h6">{user.name}</Typography>
//         {messages.length > 0 ? (
//           messages.map((msg, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
//                 mt: 2,
//               }}
//             >
//               {msg.senderId !== user._id && (
//                 <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
//               )}
//               <Box
//                 sx={{
//                   maxWidth: '70%',
//                   p: 2,
//                   bgcolor: msg.senderId === user._id ? 'primary.main' : 'grey.300',
//                   color: msg.senderId === user._id ? 'white' : 'black',
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="body2">{msg.senderId}</Typography>
//                 <Typography variant="body1">{msg.message}</Typography>
//               </Box>
//               {msg.senderId === user._id && (
//                 <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
//               )}
//             </Box>
//           ))
//         ) : (
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//             No messages to display.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default ChatWindow;







'use client';

import React, { useState, useEffect } from 'react';

import { Box, Typography, Paper, Avatar } from '@mui/material';

import { getUserChats } from '@/app/api';

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !user.roomId) {
        console.error('Invalid user or roomId');

        return;
      }

      try {
        console.log(user);
        const response = await getUserChats(user.roomId);

        console.log('Response:', response);

        // Assuming the structure might be response.data.data
        const messagesData = response.data.data || [];

        if (Array.isArray(messagesData)) {

          setMessages(messagesData);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  if (!user) {
    return (
      <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Select a user to view chats</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', maxHeight: '100%', overflow: 'auto' }}>
        <Typography variant='h6'>{user.name}</Typography>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
                mt: 2
              }}
            >
              {msg.senderId !== user._id && <Avatar src={''} alt={msg.senderId} sx={{ mr: 2 }} />}
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  bgcolor: msg.senderId === user._id ? 'grey.300' : 'grey.300',
                  color: msg.senderId === user._id ? 'white' : 'black',
                  borderRadius: 2
                }}
              >
                <Typography variant='body2'>{''}</Typography>
                <Typography variant='body1'>{msg.message}</Typography>
              </Box>
              {msg.senderId === user._id && <Avatar src={''} alt={msg.senderId} sx={{ ml: 2 }} />}
            </Box>
          ))
        ) : (
          <Typography variant='body2' color='textSecondary' sx={{ mt: 2 }}>
            No messages to display.
          </Typography>
        )}
      </Paper>
    </Box>
  )
};

export default ChatWindow;














// 'use client';

// import React, { useState, useEffect } from 'react';

// import { Box, Typography, Paper, Avatar } from '@mui/material';

// import { getUserChats } from '@/app/api';

// const ChatWindow = ({ user }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!user || !user.roomId) {
//         console.error('Invalid user or roomId');

//         return;
//       }

//       try {
//         console.log(user);
//         const response = await getUserChats(user.roomId);

//         console.log(response);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     if (user) {
//       fetchMessages();
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <Typography variant="h6">Select a user to view chats</Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//       <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
//         <Typography variant="h6">{user.name}</Typography>
//         {messages.length > 0 ? (
//           messages.map((msg, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
//                 mt: 2,
//               }}
//             >
//               {msg.senderId !== user._id && (
//                 <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ mr: 2 }} />
//               )}
//               <Box
//                 sx={{
//                   maxWidth: '70%',
//                   p: 2,
//                   bgcolor: msg.senderId === user._id ? 'primary.main' : 'grey.300',
//                   color: msg.senderId === user._id ? 'white' : 'black',
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="body1">{msg.message}</Typography>
//               </Box>
//               {msg.senderId === user._id && (
//                 <Avatar src={msg.avatar || '/path-to-default-icon.png'} alt={msg.senderId} sx={{ ml: 2 }} />
//               )}
//             </Box>
//           ))
//         ) : (
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//             No messages to display.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default ChatWindow;
