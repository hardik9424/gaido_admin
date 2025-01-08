'use client'

import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { getPostById, deleteReply, deleteComment, deletePost } from '@/app/api'
import 'react-toastify/dist/ReactToastify.css'

const PostDetails = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [mediaIndex, setMediaIndex] = useState(0)
  const [expandedComments, setExpandedComments] = useState({})
  const [confirmation, setConfirmation] = useState({ open: false, type: '', id: null, parentId: null })

  const fetchPostDetails = async () => {
    try {
      const response = await getPostById(id)
      setPost(response?.data?.data)
      setComments(response?.data?.data?.comments)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch post details')
    }
  }

  useEffect(() => {
    fetchPostDetails()
  }, [])

  const handleNextMedia = () => setMediaIndex(prevIndex => (prevIndex + 1) % post.mediaUrls.length)

  const handlePrevMedia = () =>
    setMediaIndex(prevIndex => (prevIndex === 0 ? post.mediaUrls.length - 1 : prevIndex - 1))

  const handleDelete = async () => {
    try {
      const { type, id, parentId } = confirmation
      if (type === 'post') {
        await deletePost({ postId: id, userId: post.userId })
        toast.success('Post deleted successfully')
      } else if (type === 'comment') {
        await deleteComment(id)
        setComments(prev => prev.filter(comment => comment.id !== id))
        toast.success('Comment deleted successfully')
      } else if (type === 'reply') {
        await deleteReply(parentId, { replyId: id, postId: parentId })
        fetchPostDetails()
        toast.success('Reply deleted successfully')
      }
      setConfirmation({ open: false, type: '', id: null, parentId: null })
    } catch (error) {
      console.error('Delete action failed:', error)
      toast.error('Failed to delete')
    }
  }

  const openConfirmation = (type, id, parentId = null) => {
    setConfirmation({ open: true, type, id, parentId })
  }

  const closeConfirmation = () => {
    setConfirmation({ open: false, type: '', id: null, parentId: null })
  }

  const toggleExpandComment = commentId => {
    setExpandedComments(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }))
  }

  const truncateText = (text, maxLength) => (text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text)

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ToastContainer />

      <Card sx={{ width: '100%', margin: '20px auto', padding: '20px', boxSizing: 'border-box' }}>
        <CardHeader
          avatar={<Avatar src={post?.user?.profilePicture || '/default-avatar.png'} alt={post.user.name} />}
          title={truncateText(post.user.name, 20)}
          subheader={new Date(post.createdAt).toLocaleDateString()}
          sx={{ paddingBottom: 0 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 2 }}>
          <Typography variant='body1'>Reports: {post?.noOfReports}</Typography>
          <Button
            onClick={() => openConfirmation('post', post.id)}
            variant='text'
            color='error'
            size='small'
            sx={{ marginLeft: 'auto' }}
          >
            Delete Post
          </Button>
        </Box>

        <CardContent>
          <Typography variant='body1'>{truncateText(post.content, 100)}</Typography>

          {post.mediaUrls.length > 0 && (
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '15px' }}>
              <IconButton onClick={handlePrevMedia} sx={{ position: 'absolute', left: '0', zIndex: 1 }}>
                <ArrowBackIos />
              </IconButton>
              <CardMedia
                component={post.mediaUrls[mediaIndex].endsWith('.mp4') ? 'video' : 'img'}
                controls={post.mediaUrls[mediaIndex].endsWith('.mp4')}
                src={post.mediaUrls[mediaIndex]}
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
              <IconButton onClick={handleNextMedia} sx={{ position: 'absolute', right: '0', zIndex: 1 }}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          )}
        </CardContent>

        <CardContent>
          <Typography variant='subtitle1'>Comments:</Typography>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Box key={comment.id} sx={{ marginBottom: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <Avatar
                    src={comment.user.profilePicture || '/default-avatar.png'}
                    alt={comment.user.name}
                    sx={{ marginRight: '10px' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant='body2' fontWeight='bold'>
                      {truncateText(comment.user.name, 20)}
                    </Typography>
                    <Typography variant='body2'>
                      {expandedComments[comment.id] ? comment.content : truncateText(comment.content, 50)}
                    </Typography>
                    {comment.content.length > 50 && (
                      <Button size='small' onClick={() => toggleExpandComment(comment.id)}>
                        {expandedComments[comment.id] ? 'See Less' : 'See More'}
                      </Button>
                    )}
                    <Typography variant='caption'>{new Date(comment.createdAt).toLocaleString()}</Typography>
                  </Box>
                  <Button
                    onClick={() => openConfirmation('comment', comment.id)}
                    variant='text'
                    color='error'
                    size='small'
                  >
                    Delete Comment
                  </Button>
                </Box>

                {comment.replies.length > 0 && (
                  <Box sx={{ marginLeft: '40px' }}>
                    <Typography variant='subtitle2'>Replies:</Typography>
                    {comment.replies.map(reply => (
                      <Box key={reply.id} sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <Avatar
                          src={reply.user.profilePicture || '/default-avatar.png'}
                          alt={reply.user.name}
                          sx={{ marginRight: '10px' }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant='body2' fontWeight='bold'>
                            {truncateText(reply.user.name, 20)}
                          </Typography>
                          <Typography variant='body2'>
                            {expandedComments[reply.id] ? reply.content : truncateText(reply.content, 50)}
                          </Typography>
                          {reply.content.length > 50 && (
                            <Button size='small' onClick={() => toggleExpandComment(reply.id)}>
                              {expandedComments[reply.id] ? 'See Less' : 'See More'}
                            </Button>
                          )}
                          <Typography variant='caption'>{new Date(reply.createdAt).toLocaleString()}</Typography>
                        </Box>
                        <Button
                          onClick={() => openConfirmation('reply', reply.id, comment.id)}
                          variant='text'
                          color='error'
                          size='small'
                        >
                          Delete Reply
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Typography variant='body2'>No comments yet.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmation.open} onClose={closeConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this {confirmation.type}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PostDetails
