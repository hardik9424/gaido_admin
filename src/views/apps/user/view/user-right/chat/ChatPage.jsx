




'use client'

import React, { useState } from 'react';

import { Box } from '@mui/material';

import UserList from '@/app/(dashboard)/user/userlist/UserList';
import ChatWindow from '@/app/(dashboard)/user/userlist/ChatWindow';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <UserList onSelectUser={setSelectedUser} />
      <ChatWindow user={selectedUser} />
    </Box>
  );
};

export default ChatPage;



