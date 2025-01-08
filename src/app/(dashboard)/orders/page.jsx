'use client'

import React, { useEffect, useState } from 'react'

import CountUp from 'react-countup'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
  Typography,
  Box,
  IconButton,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardHeader
} from '@mui/material'

import { Edit as EditIcon, OneKkRounded, ProductionQuantityLimits, Visibility as ViewIcon } from '@mui/icons-material'

import { getAllCollections, getAllOrders, updateOrder } from '@/app/api'

const OrdersTable = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subheaderText, setSubheaderText] = useState('Add Product')

  const [selectedOption, setSelectedOption] = useState('')

  // State for editable fields
  const [formData, setFormData] = useState({
    dispatchedDate: '',
    outForDeliveryDate: '',
    deliveredDate: '',
    courierName: '',
    trackingId: ''
  })
  useEffect(() => {
    // Cycle between "Add Product" and "Edit Product" every 3 seconds
    const interval = setInterval(() => {
      setSubheaderText(prev => (prev === 'Add Product' ? 'Edit Product' : 'Add Product'))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const fetchAllOrders = async () => {
    try {
      const response = await getAllOrders() // Fetch orders from API
      console.log('or', response)
      if (response.status === 200) {
        setOrders(response.data.data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // const handleOpenModal = order => {
  //   setSelectedOrder(order)
  //   setFormData({
  //     dispatchedDate: order.dispatchedDate || '',
  //     outForDeliveryDate: order.outForDeliveryDate || '',
  //     deliveredDate: order.deliveredDate || '',
  //     courierName: order.courierName || '',
  //     trackingId: order.trackingId || '',
  //     status: extractCustomAttribute(order, 'status') || ''
  //   })
  //   setIsModalOpen(true)
  // }
  // const handleOpenModal = order => {
  //   console.log('Opening modal for order:', order) // Debug log
  //   setSelectedOrder(order)
  //   setFormData({
  //     dispatchedDate: order.dispatchedDate || '',
  //     outForDeliveryDate: order.outForDeliveryDate || '',
  //     deliveredDate: order.deliveredDate || '',
  //     courierName: order.courierName || '',
  //     trackingId: order.trackingId || '',
  //     status: extractCustomAttribute(order, 'status') || ''
  //   })
  //   setIsModalOpen(true)
  // }
  const handleOpenModal = order => {
    console.log('Opening modal for order:', order) // Debug log

    const customAttributesMap = order.customAttributes?.reduce((acc, attr) => {
      acc[attr.key] = attr.value
      return acc
    }, {})

    setSelectedOrder(order)
    setFormData({
      dispatchedDate: customAttributesMap?.dispatchedDate || '',
      outForDeliveryDate: customAttributesMap?.outForDeliveryDate || '',
      deliveredDate: customAttributesMap?.deliveredDate || '',
      courierName: customAttributesMap?.courierName || '',
      trackingId: customAttributesMap?.trackingId || '',
      status: customAttributesMap?.status || ''
    })

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  // const handleFormChange = e => {
  //   const { name, value } = e.target
  //   setFormData(prev => ({ ...prev, [name]: value }))
  //   setSelectedOption(e.target.value)
  // }

  const handleFormChange = e => {
    const { name, value } = e.target

    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value }

      // Pre-fill dates based on status selection
      if (name === 'status') {
        switch (value) {
          case 'dispatched':
            return {
              ...updatedFormData,
              dispatchedDate: prev.dispatchedDate || new Date().toISOString().split('T')[0]
            }
          case 'outForDelivery':
            return {
              ...updatedFormData,
              dispatchedDate: prev.dispatchedDate || new Date().toISOString().split('T')[0],
              outForDeliveryDate: prev.outForDeliveryDate || new Date().toISOString().split('T')[0]
            }
          case 'delivered':
            return {
              ...updatedFormData,
              dispatchedDate: prev.dispatchedDate || new Date().toISOString().split('T')[0],
              outForDeliveryDate: prev.outForDeliveryDate || new Date().toISOString().split('T')[0],
              deliveredDate: prev.deliveredDate || new Date().toISOString().split('T')[0]
            }
          default:
            return updatedFormData
        }
      }

      return updatedFormData
    })
  }

  const isSaveDisabled = () => {
    // Add validation logic here
    const { status, dispatchedDate, outForDeliveryDate, deliveredDate } = formData
    if (status === 'dispatched' && !dispatchedDate) return true
    if (status === 'outForDelivery' && (!dispatchedDate || !outForDeliveryDate)) return true
    if (status === 'delivered' && (!dispatchedDate || !outForDeliveryDate || !deliveredDate)) return true
    return false
  }

  // const handleSaveChanges = () => {
  //   console.log('Updated Data:', formData)
  //   // Call API to save changes here
  //   handleCloseModal()
  // }
  const handleSaveChanges = async () => {
    if (!selectedOrder) return

    const data = [
      { key: 'dispatchedDate', value: formData.dispatchedDate },
      { key: 'outForDeliveryDate', value: formData.outForDeliveryDate },
      { key: 'deliveredDate', value: formData.deliveredDate },
      { key: 'courierName', value: formData.courierName },
      { key: 'trackingId', value: formData.trackingId },
      { key: 'status', value: formData.status }
    ]

    try {
      const response = await updateOrder(selectedOrder.id, data)
      console.log('Order updated successfully:', response)
      setIsModalOpen(false)
      fetchAllOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }
  const extractCustomAttribute = (order, key) => {
    const attribute = order.customAttributes?.find(attr => attr.key === key)

    if (!attribute) return 'N/A'

    // Return the raw value for the 'status' key
    if (key === 'status') {
      return attribute.value
    }
    if (key === 'courierName' || key === 'trackingId' || key === 'status') {
      return attribute.value
    }

    // For other keys, attempt to format as a date
    return attribute.value ? new Date(attribute.value).toLocaleString() : 'N/A'
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '1800px', margin: 'auto' }}>
      <CardHeader
        avatar={<ProductionQuantityLimits color='primary' fontSize='large' />} // Icon before title
        title='Orders Management'
        titleTypographyProps={{
          variant: 'h5', // Set the text size
          color: 'textPrimary', // Optional: Change text color
          fontWeight: 'bold' // Optional: Make it bold
        }}
        subheader={'View Orders'}
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Processed At</strong>
                </TableCell>
                <TableCell>
                  <strong>Subtotal</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Cancelled Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Refund Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Dispatched Date</strong>
                </TableCell>

                <TableCell>
                  <strong>Out for Delivery</strong>
                </TableCell>
                <TableCell>
                  <strong>Delivered Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Courier</strong>
                </TableCell>
                <TableCell>
                  <strong>TrackingId</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                <TableRow
                  sx={{
                    backgroundColor: '#E0E0E0,',
                    '&:hover': {
                      backgroundColor: '#E0E0E0', // Hover effect
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
                      cursor: 'pointer',
                      '& td': {
                        transform: 'scale(0.95)', // Zoom-out effect
                        transition: 'transform 0.3s ease'
                      }
                    }
                  }}
                  key={order.id}
                >
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.addresses.billing.name}</TableCell>
                  <TableCell>
                    {new Date(order.processedAt).toLocaleDateString()}{' '}
                    {new Date(order.processedAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <CountUp start={0} end={Number(order?.note?.totals?.payableAmount)} />{' '}
                    {order.pricing.subtotal.currency}
                  </TableCell>
                  <TableCell>{extractCustomAttribute(order, 'status')}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'cancelledDate')}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'refundedDate')}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'dispatchedDate') || 'N/A'}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'outForDeliveryDate') || 'N/A'}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'deliveredDate') || 'N/A'}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'courierName') || 'N/A'}</TableCell>
                  <TableCell>{extractCustomAttribute(order, 'trackingId') || 'N/A'}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <>
                          <Typography variant='body2'>{order.addresses.billing.address1}</Typography>
                          <Typography variant='body2'>{order.addresses.billing.address2 || ''}</Typography>
                          <Typography variant='body2'>
                            {order.addresses.billing.city}, {order.addresses.billing.country}
                          </Typography>
                        </>
                      }
                    >
                      <span>{order.addresses.billing.city}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(order)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(order)}>
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
            <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => {
                const status = extractCustomAttribute(order, 'status')
                console.log('od', order)

                return (
                  <TableRow
                    sx={{
                      backgroundColor: '#E0E0E0,',
                      '&:hover': {
                        backgroundColor: '#E0E0E0',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        '& td': {
                          transform: 'scale(0.95)',
                          transition: 'transform 0.3s ease'
                        }
                      }
                    }}
                    key={order.id}
                  >
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.addresses.billing.name}</TableCell>
                    <TableCell>
                      {new Date(order.processedAt).toLocaleDateString()}{' '}
                      {new Date(order.processedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <CountUp start={0} end={Number(order?.note?.totals?.payableAmount)} />{' '}
                      {order.pricing.subtotal.currency}
                    </TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'cancelledDate')}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'refundedDate')}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'dispatchedDate') || 'N/A'}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'outForDeliveryDate') || 'N/A'}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'deliveredDate') || 'N/A'}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'courierName') || 'N/A'}</TableCell>
                    <TableCell>{extractCustomAttribute(order, 'trackingId') || 'N/A'}</TableCell>
                    {/* 
                    <TableCell>
                      <Tooltip
                        title={
                          <div style={{ backgroundColor: '#FFFFFF' }}>
                            <Typography variant='body2'>{order?.addresses?.shipping?.address1}</Typography>
                            <Typography variant='body2'>{order?.addresses?.shipping?.address2 || ''}</Typography>
                            <Typography variant='body2'>
                              {order?.addresses?.shipping?.city}, {order?.addresses?.shipping?.country}
                            </Typography>
                          </div>
                        }
                      >
                        <span>{order.addresses.shipping.city}</span>
                        <span>{order.addresses.shipping.country}</span>
                        <span>{order.addresses.province}</span>
                      </Tooltip>
                    </TableCell> */}
                    <TableCell>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant='body2'>
                              <strong>Name:</strong> {order?.addresses?.shipping?.name || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Address 1:</strong> {order?.addresses?.shipping?.address1 || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Address 2:</strong> {order?.addresses?.shipping?.address2 || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>City:</strong> {order?.addresses?.shipping?.city || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Province:</strong> {order?.addresses?.shipping?.province || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Country:</strong> {order?.addresses?.shipping?.country || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>ZIP:</strong> {order?.addresses?.shipping?.zip || 'N/A'}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Phone:</strong> {order?.addresses?.shipping?.phone || 'N/A'}
                            </Typography>
                          </Box>
                        }
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#ffffff', // White background
                              color: '#000000', // Black text
                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow
                              fontSize: '14px'
                            }
                          }
                        }}
                      >
                        <span>{`${order?.addresses?.shipping?.city || ''}, ${order?.addresses?.shipping?.country || ''}`}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(order)} disabled={status === 'refunded'}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={orders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Modal for Editing and Viewing Order Details */}
      {/* <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='sm' fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <TextField
                select
                label='Order Status'
                fullWidth
                margin='normal'
                name='status'
                value={formData.status || ''}
                onChange={handleFormChange}
                SelectProps={{
                  native: true
                }}
              >
                <option value=''>Select Status</option>
                <option value='placed'>Placed</option>
                <option value='dispatched'>Dispatched</option>
                <option value='outForDelivery'>Out for Delivery</option>
                <option value='delivered'>Delivered</option>
              </TextField>
              <TextField
                label='Order Placed Date'
                fullWidth
                margin='normal'
                value={new Date(selectedOrder.processedAt).toLocaleString()}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label='Order Dispatched Date'
                fullWidth
                margin='normal'
                name='dispatchedDate'
                type='date'
                value={formData.dispatchedDate}
                onChange={handleFormChange}
              />
              <TextField
                label='Order Out for Delivery Date'
                fullWidth
                margin='normal'
                name='outForDeliveryDate'
                type='date'
                value={formData.outForDeliveryDate}
                onChange={handleFormChange}
              />
              <TextField
                label='Order Delivered Date'
                fullWidth
                margin='normal'
                name='deliveredDate'
                type='date'
                value={formData.deliveredDate}
                onChange={handleFormChange}
              />
              <TextField
                label='Order Final Status'
                fullWidth
                margin='normal'
                value={selectedOrder.status.fulfillment}
                InputProps={{ readOnly: true }}
              />

              <TextField
                label='Order Cancelled Date'
                fullWidth
                margin='normal'
                value={selectedOrder.cancelledAt ? new Date(selectedOrder.cancelledAt).toLocaleString() : 'N/A'}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label='Courier Name'
                fullWidth
                margin='normal'
                name='courierName'
                value={formData.courierName}
                onChange={handleFormChange}
              />
              <TextField
                label='Tracking ID'
                fullWidth
                margin='normal'
                name='trackingId'
                value={formData.trackingId}
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* <DialogContent>
        {selectedOrder && (
          <>
            <TextField
              select
              label='Order Status'
              fullWidth
              margin='normal'
              name='status'
              value={formData.status || ''}
              onChange={handleFormChange}
              SelectProps={{
                native: true
              }}
            >
              <option value=''>Select Status</option>
              <option value='placed'>Placed</option>
              <option value='dispatched'>Dispatched</option>
              <option value='outForDelivery'>Out for Delivery</option>
              <option value='delivered'>Delivered</option>
            </TextField>
            <TextField
              label='Order Placed Date'
              fullWidth
              margin='normal'
              value={new Date(selectedOrder.processedAt).toLocaleString()}
              InputProps={{ readOnly: true }}
            />
            {formData.status === 'dispatched' && (
              <TextField
                label='Order Dispatched Date'
                fullWidth
                margin='normal'
                name='dispatchedDate'
                type='date'
                value={formData.dispatchedDate}
                onChange={handleFormChange}
              />
            )}
            {(formData.status === 'outForDelivery' || formData.status === 'delivered') && (
              <>
                <TextField
                  label='Order Dispatched Date'
                  fullWidth
                  margin='normal'
                  name='dispatchedDate'
                  type='date'
                  value={formData.dispatchedDate}
                  onChange={handleFormChange}
                />
                <TextField
                  label='Order Out for Delivery Date'
                  fullWidth
                  margin='normal'
                  name='outForDeliveryDate'
                  type='date'
                  value={formData.outForDeliveryDate}
                  onChange={handleFormChange}
                />
              </>
            )}
            {formData.status === 'delivered' && (
              <TextField
                label='Order Delivered Date'
                fullWidth
                margin='normal'
                name='deliveredDate'
                type='date'
                value={formData.deliveredDate}
                onChange={handleFormChange}
              />
            )}
            <TextField
              label='Courier Name'
              fullWidth
              margin='normal'
              name='courierName'
              value={formData.courierName}
              onChange={handleFormChange}
            />
            <TextField
              label='Tracking ID'
              fullWidth
              margin='normal'
              name='trackingId'
              value={formData.trackingId}
              onChange={handleFormChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} color='primary' disabled={isSaveDisabled()}>
          Save
        </Button>
      </DialogActions> */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='sm' fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <TextField
                select
                label='Order Status'
                fullWidth
                margin='normal'
                name='status'
                value={formData.status || ''}
                onChange={handleFormChange}
                SelectProps={{
                  native: true
                }}
              >
                <option value=''>Select Status</option>
                <option value='placed'>Placed</option>
                <option value='dispatched'>Dispatched</option>
                <option value='outForDelivery'>Out for Delivery</option>
                <option value='delivered'>Delivered</option>
              </TextField>
              <TextField
                label='Order Placed Date'
                fullWidth
                margin='normal'
                value={new Date(selectedOrder.processedAt).toLocaleString()}
                InputProps={{ readOnly: true }}
              />
              {formData.status === 'dispatched' && (
                <TextField
                  label='Order Dispatched Date'
                  fullWidth
                  margin='normal'
                  name='dispatchedDate'
                  type='date'
                  value={formData.dispatchedDate}
                  onChange={handleFormChange}
                />
              )}
              {(formData.status === 'outForDelivery' || formData.status === 'delivered') && (
                <>
                  <TextField
                    label='Order Dispatched Date'
                    fullWidth
                    margin='normal'
                    name='dispatchedDate'
                    type='date'
                    value={formData.dispatchedDate}
                    onChange={handleFormChange}
                  />
                  <TextField
                    label='Order Out for Delivery Date'
                    fullWidth
                    margin='normal'
                    name='outForDeliveryDate'
                    type='date'
                    value={formData.outForDeliveryDate}
                    onChange={handleFormChange}
                  />
                </>
              )}
              {formData.status === 'delivered' && (
                <TextField
                  label='Order Delivered Date'
                  fullWidth
                  margin='normal'
                  name='deliveredDate'
                  type='date'
                  value={formData.deliveredDate}
                  onChange={handleFormChange}
                />
              )}
              <TextField
                label='Courier Name'
                fullWidth
                margin='normal'
                name='courierName'
                value={formData.courierName}
                onChange={handleFormChange}
              />

              {console.log(JSON.stringify(formData))}
              <TextField
                label='Tracking ID'
                fullWidth
                margin='normal'
                name='trackingId'
                value={formData.trackingId}
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color='primary' disabled={isSaveDisabled()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrdersTable
