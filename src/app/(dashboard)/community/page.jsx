'use client'

import React, { useEffect, useState } from 'react'

import { Button } from '@mui/material'

import AddPostModal from '@/components/postmanagment/AddPost'
import PostTable from '@/components/postmanagment/PostTable'
import { getAllPosts } from '@/app/api'

const PostPage = () => {
  const [posts, setPosts] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)

  const handleAddPost = newPost => {
    setPosts([...posts, { id: posts.length + 1, ...newPost, noOfComments: 0, noOfLikes: 0 }])
  }

  const handleEditPost = post => {
    // Edit post logic here
  }

  const handleDeletePost = postId => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const fetchAllPosts = async () => {
    try {
      const response = await getAllPosts()
      console.log('comm', response)
      const fetchedPosts = response.data.data.posts.map(post => ({
        id: post.id,
        profilePicture: post.user.profilePicture,
        content: post.content,
        mediaUrls: post.mediaUrls,
        noOfComments: post.noOfComments,
        noOfLikes: post.noOfLikes,
        noOfReports: post.noOfReports,
        user: post.user.name,
        user_id: post.user.id,
        active: post.user.active,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }))
      setPosts(fetchedPosts)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllPosts()
  }, [])

  return (
    <div>
      <PostTable posts={posts} handleEdit={handleEditPost} handleDelete={handleDeletePost} />
      {/* <AddPostModal open={isModalOpen} handleClose={() => setModalOpen(false)} handleAddPost={handleAddPost} /> */}
    </div>
  )
}

export default PostPage
