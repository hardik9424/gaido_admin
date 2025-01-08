import React, { useState } from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'

const AddPostModal = ({ open, handleClose, handleAddPost }) => {
  const [postContent, setPostContent] = useState('')
  const [mediaUrls, setMediaUrls] = useState('')

  const handleSubmit = () => {
    handleAddPost({ content: postContent, mediaUrls: mediaUrls.split(',') })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Post</DialogTitle>
      <DialogContent>
        <TextField
          label='Content'
          fullWidth
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          margin='dense'
        />
        <TextField
          label='Media URLs (comma separated)'
          fullWidth
          value={mediaUrls}
          onChange={e => setMediaUrls(e.target.value)}
          margin='dense'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Add Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default AddPostModal
