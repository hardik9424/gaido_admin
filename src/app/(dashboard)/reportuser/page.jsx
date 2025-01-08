
'use client'

import React, { useCallback, useEffect, useState } from 'react'

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TablePagination
} from '@mui/material'
import axios from 'axios'

import { deleteReportedUser, getAllReports } from '@/app/api'

const ReportUserPage = () => {
  const [reportData, setReportData] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const fetchReports = useCallback(async () => {
    try {
      const response = await getAllReports()
      if (response.status === 200) {
        const groupedReports = response.data.data.reports.reduce((acc, report) => {
          const userId = report.ReportedByUser.id
          if (!acc[userId]) {
            acc[userId] = { ...report, reports: [] }
          }
          acc[userId].reports.push(report)
          return acc
        }, {})

        setReportData(Object.values(groupedReports))
      }
    } catch (error) {
      console.error('Failed to fetch user reports', error)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleUserClick = report => {
    setSelectedUser(report)
  }

  const handleDeleteClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDeleteConfirm = async () => {
    const payload = {
      userId: selectedUser.ReportedByUser.id
    }
    try {
      await deleteReportedUser(payload)

      setReportData(prevData => prevData.filter(report => report.ReportedByUser.id !== selectedUser.ReportedByUser.id))

      setSnackbarMessage(`User ${selectedUser.ReportedByUser.name} deleted successfully.`)
      setSnackbarOpen(true)
      handleClose()
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to delete user', error)
      setSnackbarMessage('Failed to delete user.')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          Reported Users
        </Typography>
        {selectedUser ? (
          <>
            <Typography variant='h5' component='h2' gutterBottom>
              Reports for {selectedUser.ReportedByUser.name}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedUser.reports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{report.ReportedByUser.name}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>
                          {report.type === 'post' && report.ReportedPost ? (
                            <>
                              <Typography variant='body2'>
                                <strong>Post Content:</strong> {report.ReportedPost.content.substring(0, 50)}...
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Post Owner:</strong> {report.ReportedPost.user?.name || 'Unknown'}
                              </Typography>
                            </>
                          ) : report.type === 'pet' && report.ReportedPet ? (
                            <>
                              <Typography variant='body2'>
                                <strong>Pet Name:</strong> {report.ReportedPet.name}
                              </Typography>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component='div'
                count={selectedUser.reports.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
            <Button variant='contained' color='secondary' onClick={handleDeleteClick} sx={{ mt: 2 }}>
              Delete User
            </Button>
            <Button variant='contained' color='primary' onClick={() => setSelectedUser(null)} sx={{ mt: 2, ml: 2 }}>
              Back to Reported Users
            </Button>
          </>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Being Reported</TableCell>
                  <TableCell>Number of Reports</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((reportGroup, index) => (
                  <TableRow key={index}>
                    <TableCell>{reportGroup.ReportedByUser.name}</TableCell>
                    <TableCell>{reportGroup.reports.length}</TableCell>
                    <TableCell>
                      <Button variant='contained' color='primary' onClick={() => handleUserClick(reportGroup)}>
                        View Reports
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user <strong>{selectedUser?.ReportedByUser.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='secondary'>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Container>
  )
}

export default ReportUserPage
