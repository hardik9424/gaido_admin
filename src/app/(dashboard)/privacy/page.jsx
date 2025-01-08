'use client'

import React, { useCallback, useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css' // Import styles for react-quill
import { createPrivacyPolicy, getPrivacyPolicy, getAllReferPoints, updatePrivacyPolicy, getSettings } from '@/app/api'
import ProtectedRoute from '@/components/ProtectedRoute'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <CircularProgress size={24} /> })

const PrivacyPage = () => {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [quillLoading, setQuillLoading] = useState(true)

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await getSettings()

        console.log('pp', response)

        if (response?.status == 200) {
          setContent(response.data.data.privacyPolicy)
        } else {
          setContent('')
        }
      } catch (error) {
        console.error('Error fetching policy', error)
        toast.error('Error fetching policy')
      } finally {
        setLoading(false)

        setTimeout(() => {
          // setQuillLoading(false)
        }, 1000)
      }
    }

    fetchPolicy()
  }, [])

  const handleContentChange = value => {
    setContent(value)
  }
  function handleAttachment() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        // Implement file upload logic here
        console.log('File selected:', file)

        // Example: Add uploaded file link to the editor (replace with actual upload logic)
        const range = this.quill.getSelection()
        this.quill.insertEmbed(range.index, 'link', URL.createObjectURL(file))
      }
    }
  }
  const handleEdit = () => {
    if (window.confirm('Do you want to edit the policy?')) {
      setIsEditing(true)
    }
  }

  const handleSubmit = useCallback(async () => {
    console.log('con', content)
    if (content.trim() === '') {
      toast.error('Content cannot be empty')

      return
    }

    setSubmitting(true)
    const data = {
      privacyPolicy: content
    }
    try {
      const result = await createPrivacyPolicy(data)

      console.log(result)
      toast.success(isEditing ? 'Policy Updated' : 'Policy Created!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error creating policy:', error)
      toast.error('Error Creating Policy')
    } finally {
      setSubmitting(false)
    }
  }, [content])
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ['clean'] // remove formatting button
  ]
  return (
    <>
      <ToastContainer />
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ padding: 4, maxWidth: 1200, width: '1000', margin: 'auto' }}>
          <Typography variant='h4' gutterBottom>
            Privacy Policy
          </Typography>
          <Paper sx={{ padding: 0 }}>
            <ReactQuill
              className='custom-editor'
              value={content ? content : 'Not Avialable'}
              theme='snow'
              readOnly={!isEditing}
              onChange={handleContentChange}
              modules={{
                toolbar: toolbarOptions
                // handlers: {
                //   // handlers object will be merged with default handlers object
                //   link: function (value) {
                //     if (value) {
                //       const href = prompt('Enter the URL')
                //       this.quill.format('link', href)
                //     } else {
                //       this.quill.format('link', false)
                //     }
                //   }
                // }
              }}
            />
          </Paper>

          {
            <Box sx={{ display: 'flex', gap: 2, mt: 5 }}>
              <Button variant='contained' color='primary' onClick={handleSubmit} disabled={submitting || !isEditing}>
                {submitting ? <CircularProgress size={24} /> : 'Send'}
              </Button>
              <Button variant='contained' color='secondary' onClick={handleEdit} disabled={isEditing}>
                Edit
              </Button>
            </Box>
          }
        </Box>
      )}
    </>
  )
}

// const ProtectedChatPage = () => {
//   return (
//     <ProtectedRoute requiredPermission='privacy'>
//       <PrivacyPage />
//     </ProtectedRoute>
//   )
// }

// export default ProtectedChatPage

export default PrivacyPage

// report user
