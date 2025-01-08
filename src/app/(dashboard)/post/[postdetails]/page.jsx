'use client'




import React, { useEffect, useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Box, Typography, CircularProgress, Paper, Avatar, Grid } from '@mui/material'

import { getPostById } from '@/app/api'

const PostDetails = () => {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostById(params.postdetails)

        console.log(response)

        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setPost(response.data.data[0])
        } else {
          setPost(response.data.data)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching post details:', error)
        setLoading(false)
      }
    }

    fetchPostDetails()
  }, [params.postdetails])

  const renderMedia = mediaUrl => {
    if (mediaUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
      return <img src={mediaUrl} alt='media' style={{ width: '100%', borderRadius: '8px' }} />
    } else if (mediaUrl.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <video width='100%' controls style={{ borderRadius: '8px' }}>
          <source src={mediaUrl} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )
    } else {
      return null
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <CircularProgress />
      </Box>
    )
  }

  if (!post) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='300px'>
        <Typography variant='h6'>Post not found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom>
              {post.post.thought}
            </Typography>
            {post?.post?.media && renderMedia(post.post.media)}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box mt={2}>
              <Typography variant='h6' gutterBottom>
                Comments:
              </Typography>
              {Array.isArray(post?.comments) && post?.comments?.length > 0 ? (
                post?.comments?.map(comment => (
                  <Box key={comment._id} display='flex' alignItems='center' mb={2}>
                    <Avatar src={comment?.user?.profile} alt={comment?.user?.name} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant='body2' color='textSecondary'>
                        {comment?.user?.name}
                      </Typography>
                      <Typography variant='body1'>{comment.comment}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No comments available.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PostDetails

