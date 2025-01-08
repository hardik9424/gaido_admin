'use client'

import React, { useState, useEffect } from 'react'



import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Card,
  CardMedia,
  CardActions,
  Pagination,
  CircularProgress,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  LinearProgress,
  CardHeader,
  Chip,
  Stepper,
  StepLabel,
  Step
} from '@mui/material'

import CountUp from 'react-countup'

import {
  ExpandMore,
  ExpandLess,
  Edit,
  Add,
  Delete,
  CleaningServices,
  SellOutlined,
  ProductionQuantityLimitsSharp,
  CommentOutlined
} from '@mui/icons-material'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import ProductCard from './ProductCard'

import {
  getAllProducts,
  getCollections,
  createProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
  updateProductPrice,
  getAllOrders,
  getAllBrands,
  removeCollectionFromProduct
} from '@/app/api'

const ProductTable = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [expandedProductId, setExpandedProductId] = useState(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [isDeletedModal, setIsDeletedModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [createdProductId, setCreatedProductId] = useState(null)
  const steps = ['Product Details', 'Variants', 'Variant Prices']
  const [editProductData, setEditProductData] = useState({
    id: '',
    title: '',
    descriptionHtml: '',
    collection: '',
    vendor: '',
    tags: ''
  })
  const [editVariantDetails, setEditVariantDetails] = useState([])

  const [variantDetails, setVariantDetails] = useState([
    { name: '', price: '', comparePrice: '', gst: '', inventory: '' }
  ])

  const [newProductData, setNewProductData] = useState({
    title: '',
    descriptionHtml: '',
    mediaUrl: [],
    variants: [],
    tags: '',
    category: '',
    collection: '',
    comparePrice: '',

    brand: ''
  })
  const [isVariantEditModalOpen, setVariantEditModalOpen] = useState(false)
  // const [currentStep, setCurrentStep] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [newlyCreatedProductId, setNewlyCreatedProductId] = useState(null)
  const [editableVariantId, setEditableVariantId] = useState(null)
  const [variantEdits, setVariantEdits] = useState([])
  const [gstPercentage, setGstPercentage] = useState(18)
  const [brands, setBrands] = useState([])
  const [isReviewModalOpen, setReviewModalOpen] = useState(false)
  const [currentReviews, setCurrentReviews] = useState([])
  const [userRole, setUserRole] = useState('')

  const closeModal = () => {
    setModalOpen(false)
    setNewProductData({
      title: '',
      descriptionHtml: '',
      mediaUrl: [],
      variants: [],
      tags: '',
      category: '',
      collection: '',
      brand: ''
    })
    setCurrentStep(1)
  }

  const getHighestAverageRating = () => {
    const validRatings = products
      .map(product => product.avgRating)
      .filter(rating => rating !== null && rating !== undefined)
    return validRatings.length > 0 ? Math.max(...validRatings) : 0
  }

  const cardData = [
    { label: 'totalProducts', data: `${products?.length}` },
    { label: 'totalBrands', data: `${brands?.length}` },
    { label: 'highestReview', data: getHighestAverageRating() },
    { label: 'blockedUsers', data: 3 }
  ]

  useEffect(() => {
    const userRole = localStorage.getItem('user')
    if (userRole) {
      const parsedData = JSON.parse(userRole)
      setUserRole(parsedData.role)
    } else {
      setUserRole('')
    }
  }, [])
  // REVIEW MODAL
  const handleOpenReviewModal = reviews => {
    setCurrentReviews(reviews)
    setReviewModalOpen(true)
  }

  const handleModalPageCHange = () => {
    if (!newProductData.title || !newProductData.descriptionHtml || !newProductData.tags) {
      toast.error('Please fill all the required fields in Step 1')
      return
    }

    // Move to Step 2
    setCurrentStep(2)
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate required fields
      if (!newProductData.title || !newProductData.descriptionHtml || !newProductData.tags) {
        toast.error('Please fill all the required fields in Step 1')
        return
      }

      // Move to Step 2
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setLoading(true)
      try {
        // Prepare product data for the API
        const productData = {
          ...newProductData,
          descriptionHtml: `<p>${newProductData.descriptionHtml}</p>`,
          variants: newProductData.variants.map(variant => ({
            optionName: variant.optionName,
            optionValues: variant.optionValues.map(value => value)
          }))
        }

        // Call createProduct API
        const response = await createProduct({ productData })
        if (response.status === 200) {
          toast.success('Product created successfully')
          const createdVariants = response.data?.data?.product?.product?.variants?.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            price: edge.node.price || '',
            inventory: edge.node.inventoryQuantity || '',
            gst: '18%',
            idQuant: edge.node.inventoryItem?.id || '' // Capture inventory item ID
          }))
          setCreatedProductId(response.data?.data?.product?.product?.id) // Save product ID for later use
          setVariantDetails(createdVariants) // Populate variants for Step 3
          setCurrentStep(3)
        } else {
          toast.error('Error creating product')
        }
      } catch (error) {
        console.error('Error creating product:', error)
        toast.error('Failed to create product')
      } finally {
        setCurrentStep(3)
        setLoading(false)
      }
    }
  }
  const handleBack = () => setCurrentStep(prevStep => Math.max(prevStep - 1, 0)) // Ensure it doesn't go below step 0.

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false)
    setCurrentReviews([])
  }

  const handleVariantEdit = (variantId, field, value, inventotyId) => {
    console.log('iv', field, inventotyId)
    setVariantEdits(prevEdits => {
      const existingEdit = prevEdits.find(edit => edit.variantId === variantId)
      if (existingEdit) {
        return prevEdits.map(edit =>
          edit.variantId === variantId ? { ...edit, [field]: value, idQuant: inventotyId } : edit
        )
      }

      return [...prevEdits, { variantId, [field]: value, idQuant: inventotyId }]
    })
  }

  const createFinalProduct = async () => {
    setLoading(true)
    console.log('sczczxc', variantDetails)
    try {
      // Construct the payload
      const payload = {
        productId: createdProductId, // The ID of the newly created product
        variants: variantDetails.map((variant, index) => ({
          variantId: variant.id,
          price: variant.price,
          comparePrice: newProductData.comparePrice, // Use null if empty
          inventoryQuantity: `${variant.inventory}`, // Convert to string
          idQuant: { id: variant.idQuant } || '', // This should be set from the API response
          // mrp: (parseFloat(variant.price) * 1.18).toFixed(2) // Calculate MRP with 18% GST
          mrp: (parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2),
          percentage: gstPercentage
        }))
      }

      console.log('Final Payload:', payload)

      // Call the API to save the variants with the constructed payload
      const response = await updateProductPrice(payload)

      if (response.status === 200) {
        toast.success('Variants saved successfully')
        setVariantEdits([])
        fetchAllProducts() // Refresh the product list
        setCurrentStep(1) // Reset to the first step
        setAddModalOpen(false)
      } else {
        toast.error('Failed to save variants')
      }
    } catch (error) {
      console.error('Error saving variants:', error)
      toast.error('Error saving variants')
    } finally {
      setLoading(false)
      setCurrentStep(1)
      setAddModalOpen(false)
    }
  }

  const handleSaveVariants = async () => {
    setLoading(true)
    try {
      const payload = {
        productId: createdProductId ? createdProductId : expandedProductId,
        variants: variantEdits.map(edit => ({
          ...edit,
          mrp: (parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2),
          percentage: gstPercentage
        }))
      }
      console.log('to', payload)

      const response = await updateProductPrice(payload)
      console.log('uuu', response)
      if (response.status === 200) {
        toast.success('Variants updated successfully')

        setVariantEdits([])
        setEditableVariantId(null)
        fetchAllProducts()
      } else {
        toast.error('Failed to update variants')
      }
    } catch (error) {
      console.error('Error updating variants:', error)
      toast.error('Error updating variants')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setVariantEdits([])
    setEditableVariantId(null)
  }

  const handleAddVariantOption = () => {
    setNewProductData(prevData => ({
      ...prevData,
      variants: [...prevData.variants, { optionName: '', optionValues: [] }]
    }))
  }

  const handleVariantOptionChange = (index, field, value) => {
    const updatedVariants = newProductData.variants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    )
    setNewProductData({ ...newProductData, variants: updatedVariants })
  }

  const handleAddOptionValue = index => {
    const updatedVariants = newProductData.variants.map((variant, i) =>
      i === index ? { ...variant, optionValues: [...variant.optionValues, ''] } : variant
    )
    setNewProductData({ ...newProductData, variants: updatedVariants })
  }

  const handleOptionValueChange = (variantIndex, valueIndex, value) => {
    const updatedVariants = newProductData.variants.map((variant, i) => {
      if (i === variantIndex) {
        const updatedValues = variant.optionValues.map((val, j) => (j === valueIndex ? value : val))
        return { ...variant, optionValues: updatedValues }
      }
      return variant
    })
    setNewProductData({ ...newProductData, variants: updatedVariants })
  }

  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      const response = await getAllProducts()
      if (response.status === 200) {
        setProducts(response.data?.data?.products)
      } else {
        console.error('Error fetching products:', response.message)
      }

      const collectionResponse = await getCollections()
      console.log('coll', collectionResponse)
      if (collectionResponse) {
        const fetchedCategories = collectionResponse?.data?.data?.map(cat => ({
          id: cat.id,
          title: cat.title
        }))
        setCategories(fetchedCategories)
      } else {
        console.error('Error fetching collections:', collectionResponse.message)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  const fetchAllBrands = async () => {
    try {
      const response = await getAllBrands()
      if (response.status === 200) {
        console.log('brands', response.data.data)
        setBrands(response.data.data)
      }
    } catch (error) {
      console.log(error)
      setBrands([])
    }
  }

  useEffect(() => {
    fetchAllProducts()
    fetchAllBrands()
  }, [])

  const closeAddModal = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setNewProductData({
      title: '',
      descriptionHtml: '',
      mediaUrl: [],
      variants: [],
      tags: '',
      category: '',
      collection: ''
    })
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await uploadImage(formData)
        if (response) {
          const imageUrl = response.data.data.fileUrl
          setNewProductData(prevData => ({
            ...prevData,
            mediaUrl: [...prevData.mediaUrl, imageUrl]
          }))
          toast.success('Image uploaded successfully')
        } else {
          toast.error('Failed to upload image')
        }
      } catch (error) {
        toast.error('Error uploading image')
      }
      setIsUploading(false)
    }
  }
  const htmlToText = html => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const handleCreateProduct = async () => {
    setLoading(true)
    console.log('is', editData)
    if (editData) {
      const productData = {
        id: editData?.id,
        title: newProductData?.title,
        descriptionHtml: newProductData?.descriptionHtml,
        category: newProductData?.category,
        tags: newProductData?.tags,
        collection: newProductData?.collection,
        mediaUrl: newProductData?.mediaUrl
      }
      console.log('up', productData)
      const response = await updateProduct(productData)
      console.log('up', response)
      toast.success('updated successfully')
      setAddModalOpen(false)
      setEditModalOpen(false)
      fetchAllProducts()
      return
    } else {
      try {
        const productData = {
          ...newProductData,
          descriptionHtml: `<p>${newProductData.descriptionHtml}</p>`,
          variants: newProductData.variants.map(variant => ({
            optionName: variant.optionName,
            optionValues: variant.optionValues.map(value => value)
          }))
        }

        const response = await createProduct({ productData })
        console.log('create', response)
        if (response.status === 200) {
          toast.success('Product created successfully')
          closeAddModal()

          setNewlyCreatedProductId(response?.data?.data?.product?.id)
          console.log('id of new product', response?.data?.data?.product?.id)
          setOpenDialog(true)
          fetchAllProducts()
        } else {
          toast.error('Error creating product')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to create product')
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const openEditModal = product => {
    console.log('edit', product)
    const collections = product.collections.map(col => ({
      id: col.id,
      title: col.title
    }))
    setEditModalOpen(true)
    setCurrentStep(1)
    setAddModalOpen(false)
    setEditData(product)
    setEditProductData({
      id: product.id,
      title: product.title || '',
      descriptionHtml: htmlToText(product.descriptionHtml) || '',
      collection: product.collections.map(collection => collection.title) || '',
      // collection: collections || [],

      brand: product.vendor,
      tags: product.tags || '',
      mediaUrl: product.images ? product.images.map(img => img.originalSrc) : []
    })
    setNewProductData({
      title: product.title || '',
      descriptionHtml: htmlToText(product.descriptionHtml) || '',
      mediaUrl: product.images ? product.images.map(img => img.originalSrc) : [],
      // variants: product.variants || [],

      tags: product.tags || '',
      category: product.productType || '',
      collection: product.collection || '',
      brand: product.vendor || ''
    })
    console.log('vxdvxdvc', product?.variants)
    const variants =
      product.variants?.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price || '',
        comparePrice: variant.compareAtPrice || '',
        inventoryQuantity: variant.inventoryQuantity || ''
      })) || []

    setEditVariantDetails(variants)
  }

  const handleDelete = async data => {
    if (!deleteProductId) return

    try {
      const payload = {
        id: deleteProductId
      }
      const response = await deleteProduct(payload)
      if (response?.status === 200) {
        toast.success('Product deleted successfully')
        fetchAllProducts()
      }

      console.log('delete', response)
    } catch (error) {
      toast.error('Error deleting product ')
      console.log(error)
    } finally {
      setIsDeletedModal(false)
      setDeleteProductId(null)
    }
  }

  const confirmDeleteProduct = productId => {
    setDeleteProductId(productId?.id)
    setIsDeletedModal(true)
  }

  const cancelDelete = () => {
    setIsDeletedModal(false)
    setDeleteProductId(null)
  }
  // Open variant-specific edit modal
  const openVariantEditModal = (variant, pid, options) => {
    const splitTitle = variant.title.split(' / ')
    const optionId1 = options.find(opt => opt.name === 'Subscription Plan')?.id
    const optionId2 = options.find(opt => opt.name === 'Color')?.id
    const optionId3 = options.find(opt => opt.name === 'Size')?.id
    console.log('send', variant, pid)
    setSelectedVariant({
      productId: pid,
      id: variant.id,

      price: variant.price,
      comparePrice: variant.compareAtPrice
    })
    setVariantEditModalOpen(true)
  }

  const handleVariantSave = async updatedVariant => {
    console.log('Updating variant', updatedVariant)
    console.log('selec', selectedVariant)

    try {
      const payload = {
        productId: selectedVariant?.productId,
        variants: variantEdits.map(edit => ({
          id: edit.id,
          price: edit.price,
          inventory: edit.inventory
        }))
      }

      console.log('Payload to API:', payload)

      const response = await updateProductPrice(payload)
      console.log('ho', response)
      if (response) {
        toast.success('Variant updated successfully')
        fetchAllProducts()
      } else {
        toast.error('Failed to update variant')
      }
    } catch (error) {
      console.error('Error updating variant:', error)
      toast.error('Error updating variant')
    } finally {
      setVariantEditModalOpen(false)
      setSelectedVariant(null)
    }
  }
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleSkip = () => {
    // Call the onClose function to close the dialog
  }
  // const handleNextStep = async () => {
  //   setLoading(true)
  //   try {
  //     const productData = {
  //       ...newProductData,
  //       descriptionHtml: `<p>${newProductData.descriptionHtml}</p>`,
  //       variants: newProductData.variants.map(variant => ({
  //         optionName: variant.optionName,
  //         optionValues: variant.optionValues
  //       }))
  //     }

  //     const response = await createProduct({ productData })
  //     console.log('res', response)
  //     if (response.status === 200) {
  //       toast.success('Product created successfully')
  //       setCreatedProductId(response.data?.data?.product?.id)
  //       setVariantDetails(
  //         response.data?.data?.product?.variants?.map(variant => ({
  //           id: variant.id,
  //           title: variant.title,
  //           price: '',
  //           gst: '',
  //           inventory: ''
  //         }))
  //       )
  //     } else {
  //       toast.error('Error creating product')
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //     // toast.error('Failed to create product')
  //   } finally {
  //     setCurrentStep(3)
  //     setLoading(false)
  //   }
  // }

  const handleNextStep = async () => {
    setLoading(true)
    try {
      const productData = {
        ...newProductData,
        descriptionHtml: `<p>${newProductData.descriptionHtml}</p>`,
        variants: newProductData.variants.map(variant => ({
          optionName: variant.optionName,
          optionValues: variant.optionValues
        }))
      }
      console.log('sending data', productData)
      const response = await createProduct({ productData })
      console.log('res', response)

      if (response.status === 200) {
        // toast.success('Product created successfully')

        console.log('response', response.data.data)
        const createdVariants = response.data?.data?.product?.product?.variants?.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          price: edge.node.price || '',
          inventory: edge.node.inventoryQuantity || '',
          gst: '18%',
          idQuant: edge.node.inventoryItem?.id || '' // Capture inventory item ID
          // mrp: (parseFloat(edge.node.price) * 1.18).toFixed(2) || ''
        }))
        console.log('created data', createdVariants)

        setCreatedProductId(response.data?.data?.product?.product?.id)
        console.log('next', response.data?.data?.product?.id)
        setVariantDetails(createdVariants)
        setCurrentStep(2)
      } else {
        toast.error('Error creating product')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to create product')
    } finally {
      setCurrentStep(3)
      setLoading(false)
    }
  }

  const handleVariantInputChange = (index, field, value) => {
    setVariantDetails(prevDetails => {
      const updatedVariants = [...prevDetails]
      updatedVariants[index][field] = value
      if (field === 'price') {
        updatedVariants[index]['mrp'] = (parseFloat(value) * 1.18).toFixed(2)
      }

      // Capture the variant's ID and the updated fields
      const variantId = updatedVariants[index].id
      setVariantEdits(prevEdits => {
        const existingEdit = prevEdits.find(edit => edit.variantId === variantId)
        if (existingEdit) {
          return prevEdits.map(edit => (edit.variantId === variantId ? { ...edit, [field]: value } : edit))
        } else {
          return [...prevEdits, { variantId: variantId, [field]: value }]
        }
      })

      return updatedVariants
    })
  }

  const handleSaveEdit = async () => {
    setLoading(true)
    console.log('DDD', editData)
    try {
      const payload = {
        productId: editProductData.id,
        variants: editVariantDetails.map((variant, index) => ({
          variantId: variant.id,
          price: variant.price,
          comparePrice: variant.comparePrice,

          inventoryQuantity: `${variant.inventoryQuantity}`,
          idQuant: editData.variants[index].inventoryItem,
          // mrp: (parseFloat(variant.price) * 1.18).toFixed(2)
          mrp: (parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2),
          percentage: gstPercentage
        }))
      }

      console.log('Payload to API:', payload)

      const response = await updateProductPrice(payload)

      if (response?.status === 200) {
        toast.success('Variants updated successfully')
        setEditModalOpen(false)
        fetchAllProducts()
      } else {
        toast.error('Failed to update variants')
      }
    } catch (error) {
      console.error('Error updating variants:', error)
      toast.error('Error updating variants')
    } finally {
      setLoading(false)
    }
  }
  const handleAllDetailsSave = async () => {
    setLoading(true)
    console.log('edit2', editProductData)
    try {
      const productData = {
        id: editProductData.id,
        title: editProductData.title,
        descriptionHtml: `<p>${editProductData.descriptionHtml}</p>`,
        collection: editProductData.collection,
        tags: editProductData.tags,
        mediaUrl: editProductData.mediaUrl,
        vendor: editProductData.brand
      }

      const response = await updateProduct(productData)

      if (response?.status === 200) {
        toast.success('Product details updated successfully')
        setCurrentStep(2)
      } else {
        toast.error('Failed to update product details')
      }
    } catch (error) {
      console.error('Error updating product details:', error)
      toast.error('Error updating product details')
    } finally {
      setLoading(false)
    }
  }

  const formatBrand = text => {
    if (text) {
      const brandName = text.split('_')
      return brandName[1]
    }
    return text
  }
  const handleRemoveCollection = async data => {
    console.log('colldele', data)
    const getRequiredCollection = categories?.filter(cat => cat.title.toLowerCase() === data.toLowerCase())
    console.log('found', getRequiredCollection)
    const removeCollection = {
      id: editProductData?.id,
      removedCollection: getRequiredCollection
    }
    try {
      const response = await removeCollectionFromProduct(removeCollection)
      console.log('res', response)
      if (response?.status === 200) {
        toast.success('Collection removed successfully')
        setEditProductData(prevData => ({
          ...prevData,
          collection: prevData.collection.filter(title => title !== data)
        }))
      }
    } catch (error) {
      toast.error('Unable to remove collection')
    }
  }

  const capitalizeWord = text => {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
    return text
  }
  return (
    <Box p={3}>
      <ToastContainer />
      <ProductCard cardData={cardData} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader
          avatar={<ProductionQuantityLimitsSharp color='primary' fontSize='large' />} // Icon before title
          title='Products Management'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'Add or Edit Product'}
        />

        <Box sx={{ marginTop: 6 }}>
          {' '}
          <Button
            variant='contained'
            sx={{ backgroundColor: '#ffA500' }}
            startIcon={<Add />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: '1200', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Collections</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts?.map(product => (
              <React.Fragment key={product.id}>
                <TableRow
                  sx={{
                    backgroundColor: '#E0E0E0,',
                    '&:hover': {
                      backgroundColor: '#E0E0E0', // Hover effect
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
                      cursor: 'pointer',
                      '& td': {
                        transform: 'scale(0.92)', // Zoom-out effect
                        transition: 'transform 0.3s ease'
                      }
                    }
                  }}
                >
                  <TableCell>
                    <Typography>{capitalizeWord(product.title)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip key={''} label={product.productType} />
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                  </TableCell>
                  <TableCell>
                    {product?.images?.map((img, index) => (
                      <img
                        key={index}
                        src={img.originalSrc}
                        alt={img.altText}
                        style={{ width: '50px', height: '50px', marginRight: 8 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip key={product.id} label={formatBrand(product.vendor) || 'N/A'} />
                  </TableCell>

                  <TableCell>
                    {product?.collections?.map(collection => (
                      <Chip key={collection.id} label={collection.title} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <span>
                      ₹<CountUp start={0} end={Number(product?.priceRange?.minVariantPrice?.amount)} duration={1} /> - ₹
                      <CountUp start={0} end={Number(product?.priceRange?.maxVariantPrice?.amount)} duration={1} />
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.avgRating ? (
                      <>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index}>{index < product.avgRating ? '⭐' : '☆'}</span>
                        ))}

                        <IconButton onClick={() => handleOpenReviewModal(product.reviews)} color='primary'>
                          <CommentOutlined />
                          <Typography variant='body2' sx={{ ml: 0.5 }}>
                            {product.reviews.length}
                          </Typography>
                        </IconButton>
                      </>
                    ) : (
                      <Typography variant='body2'>No Reviews</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => openEditModal(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      disabled={userRole !== 'superadmin' && userRole !== 'admin'}
                      onClick={() => confirmDeleteProduct(product)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                    >
                      {expandedProductId === product.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedProductId === product.id} timeout='auto' unmountOnExit>
                      <Box margin={2}>
                        <Typography variant='h6' gutterBottom>
                          Variants
                        </Typography>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Title</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell>Comapre Price</TableCell>
                              <TableCell>Inventory Quantity</TableCell>
                              <TableCell>GST%</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product?.variants?.map(variant => (
                              <TableRow
                                sx={{
                                  backgroundColor: '#E0E0E0,',
                                  '&:hover': {
                                    backgroundColor: '#E0E0E0',
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.2)',
                                    cursor: 'pointer',
                                    '& td': {
                                      transform: 'scale(0.95)',
                                      transition: 'transform 0.3s ease'
                                    }
                                  }
                                }}
                                key={variant.id}
                              >
                                <TableCell>{variant.title}</TableCell>

                                <TableCell>
                                  {editableVariantId === variant.id ? (
                                    <TextField
                                      type='text'
                                      value={
                                        variantEdits.find(edit => edit.variantId === variant.id)?.price ??
                                        (variant.price !== undefined ? String(variant.price) : '')
                                      }
                                      onChange={e =>
                                        handleVariantEdit(variant.id, 'price', e.target.value, variant.inventoryItem)
                                      }
                                      onBlur={() => {
                                        if (!variantEdits.find(edit => edit.variantId === variant.id)) {
                                          setEditableVariantId(null)
                                        }
                                        console.log('yes')
                                      }}
                                    />
                                  ) : variantEdits.find(edit => edit.variantId === variant.id)?.price ? (
                                    `₹${variantEdits.find(edit => edit.variantId === variant.id)?.price}`
                                  ) : (
                                    <CountUp start={0} end={Number(variant.price)} prefix='₹' duration={1} />
                                  )}
                                </TableCell>

                                {
                                  <TableCell>
                                    {editableVariantId === variant.id ? (
                                      <TextField
                                        type='text'
                                        value={
                                          variantEdits.find(edit => edit.variantId === variant.id)?.comparePrice ??
                                          (variant.comparePrice !== undefined
                                            ? String(variant.compareAtPrice)
                                            : variant.compareAtPrice)
                                        }
                                        onChange={e =>
                                          handleVariantEdit(
                                            variant.id,
                                            'comparePrice',
                                            e.target.value,
                                            variant.inventoryItem
                                          )
                                        }
                                      />
                                    ) : (
                                      `₹${variantEdits.find(edit => edit.variantId === variant.id)?.compareAtPrice || variant?.compareAtPrice || 'N/A'}`
                                    )}
                                  </TableCell>
                                }

                                <TableCell>
                                  {editableVariantId === variant.id ? (
                                    <TextField
                                      type='text'
                                      value={
                                        variantEdits.find(edit => edit.variantId === variant.id)?.inventoryQuantity ??
                                        (variant.inventoryQuantity !== undefined
                                          ? String(variant.inventoryQuantity)
                                          : variant.inventoryQuantity)
                                      }
                                      onChange={e =>
                                        handleVariantEdit(
                                          variant.id,
                                          'inventoryQuantity',
                                          e.target.value,
                                          variant.inventoryItem
                                        )
                                      }
                                    />
                                  ) : variantEdits.find(edit => edit.variantId === variant.id)?.inventoryQuantity ? (
                                    `${variantEdits.find(edit => edit.variantId === variant.id)?.inventoryQuantity}`
                                  ) : variant?.inventoryQuantity ? (
                                    <CountUp start={0} end={Number(variant.inventoryQuantity)} duration={1} />
                                  ) : (
                                    'N/A'
                                  )}
                                </TableCell>

                                <TableCell>
                                  {product.appliedPercentage ? JSON.parse(product.appliedPercentage).tax + '%' : 'N/A'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {variantEdits.length > 0 && (
                          <Box mt={2} display='flex' justifyContent='space-between'>
                            <Button variant='contained' color='primary' onClick={handleSaveVariants}>
                              {loading ? <CircularProgress size={24} sx={{ ml: 2 }} /> : 'Save'}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(products.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        color='primary'
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
      />

      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange for the track
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'orange' // Orange for the progress bar
            }
          }}
          variant='indeterminate'
        />
      )}

      {/* <Modal open={isEditModalOpen || isAddModalOpen} onClose={closeAddModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            width: 700,
            height: '90vh',
            overflowY: 'auto',
            boxShadow: 3
          }}
        >
          <Typography variant='h4' gutterBottom textAlign='center' sx={{ mb: 3 }}>
            {isEditModalOpen ? 'Edit Product' : 'Add Product'}
          </Typography>

          <Box mb={3}>
            <Typography variant='body1' gutterBottom sx={{ mb: 1 }}>
              Upload Images
            </Typography>
            <Button variant='contained' component='label' startIcon={<Add />} sx={{ mb: 2 }} color='primary'>
              Choose Files
              <input type='file' accept='image/*' hidden multiple onChange={handleImageUpload} />
            </Button>
            {isUploading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
            <Box
              display='flex'
              flexWrap='wrap'
              gap={2}
              sx={{
                mt: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 1,
                justifyContent: 'flex-start'
              }}
            >
              {newProductData?.mediaUrl.map((url, index) => (
                <Card key={index} sx={{ width: 120, height: 120, position: 'relative', boxShadow: 2 }}>
                  <CardMedia
                    component='img'
                    src={url}
                    alt={`preview ${index}`}
                    height='120'
                    sx={{ borderRadius: 1, objectFit: 'cover' }}
                  />
                  <CardActions
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%'
                    }}
                  >
                    <IconButton
                      size='small'
                      onClick={() =>
                        setNewProductData(prevData => ({
                          ...prevData,
                          mediaUrl: prevData.mediaUrl.filter((_, i) => i !== index)
                        }))
                      }
                      color='error'
                    >
                      <Delete fontSize='small' />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              label='Title'
              value={newProductData.title}
              onChange={e => setNewProductData({ ...newProductData, title: e.target.value })}
              margin='normal'
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Description'
              value={newProductData.descriptionHtml}
              onChange={e => setNewProductData({ ...newProductData, descriptionHtml: e.target.value })}
              margin='normal'
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Tags'
              value={newProductData.tags}
              onChange={e => setNewProductData({ ...newProductData, tags: e.target.value })}
              margin='normal'
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Category'
              value={newProductData.category}
              onChange={e => setNewProductData({ ...newProductData, category: e.target.value })}
              margin='normal'
              sx={{ mb: 2 }}
            />
          </Box>
          {isAddModalOpen ? (
            <Box mb={3}>
              <Typography variant='body1' gutterBottom>
                Variants
              </Typography>
              {newProductData?.variants?.map((variant, index) => (
                <Box key={index} mb={3} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Variant {index + 1}
                  </Typography>
                  <TextField
                    label='Option Name'
                    fullWidth
                    value={variant.optionName}
                    onChange={e => handleVariantOptionChange(index, 'optionName', e.target.value)}
                    margin='normal'
                    sx={{ mb: 2 }}
                  />
                  {variant?.optionValues?.map((value, valIndex) => (
                    <TextField
                      key={valIndex}
                      label={`Option Value ${valIndex + 1}`}
                      fullWidth
                      value={value}
                      onChange={e => handleOptionValueChange(index, valIndex, e.target.value)}
                      margin='normal'
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <Button onClick={() => handleAddOptionValue(index)} variant='text' color='primary' sx={{ mt: 1 }}>
                    Add Option Value
                  </Button>
                </Box>
              ))}
              <Button
                onClick={handleAddVariantOption}
                variant='contained'
                color='primary'
                startIcon={<Add />}
                sx={{ mt: 2 }}
              >
                Add Variant Option
              </Button>
            </Box>
          ) : null}

          <Box mb={3}>
            <TextField
              fullWidth
              select
              label='Collection'
              value={newProductData?.collection}
              onChange={e => setNewProductData({ ...newProductData, collection: e.target.value })}
              margin='normal'
              sx={{ mb: 2 }}
            >
              {categories?.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display='flex' justifyContent='space-between' mt={3}>
            <Button onClick={closeAddModal} color='secondary' variant='outlined'>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct} color='primary' variant='contained'>
              {loading ? <CircularProgress size={24} sx={{ ml: 2 }} /> : 'Save'}
            </Button>
          </Box>
        </Box>
      </Modal> */}

      <Dialog open={isDeletedModal} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isVariantEditModalOpen} onClose={() => setVariantEditModalOpen(false)}>
        <DialogTitle>Edit Variant</DialogTitle>
        <DialogContent>
          <TextField
            label='Variant Title'
            fullWidth
            value={selectedVariant?.editedValue || ''}
            // onChange={e => setSelectedVariant({ ...selectedVariant, title: e.target.value })}
            onChange={e =>
              setSelectedVariant({
                ...selectedVariant,
                editedValue: e.target.value
              })
            }
            margin='normal'
          />
          <TextField
            label='Price'
            fullWidth
            type='text'
            value={selectedVariant?.price || ''}
            onChange={e => setSelectedVariant({ ...selectedVariant, price: e.target.value })}
            margin='normal'
          />
          <TextField
            label='Compare Price'
            fullWidth
            type='text'
            value={selectedVariant?.comparePrice || ''}
            onChange={e => setSelectedVariant({ ...selectedVariant, comparePrice: e.target.value })}
            margin='normal'
          />

          <TextField
            label='Inventory Quantity'
            fullWidth
            type='number'
            value={selectedVariant?.inventoryQuantity || ''}
            onChange={e =>
              setSelectedVariant({
                ...selectedVariant,
                inventoryQuantity: e.target.value
              })
            }
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariantEditModalOpen(false)} color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // handleVariantSave(selectedVariant)
            }}
            color='primary'
          >
            {loading ? <CircularProgress size={24} sx={{ ml: 2 }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{'Variant Price '}</DialogTitle>
        <DialogContent>
          <DialogContentText>You want to add Prices Variant now ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Skip
          </Button>
          <Button
            onClick={() => {
              setExpandedProductId(newlyCreatedProductId) // Expand product after dialog
              setEditableVariantId(null) // Ensure no variant is editable initially
              setOpenDialog(false)
            }}
            color='secondary'
          >
            okay
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={isReviewModalOpen} onClose={handleCloseReviewModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto'
          }}
        >
          <Typography variant='h5' gutterBottom>
            Product Reviews
          </Typography>
          {currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <Box key={index} mb={3} p={2} border='1px solid #ddd' borderRadius={2}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {review.customer_name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
                <Box mt={1} mb={1}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(review.rating) ? '⭐' : '☆'}</span>
                  ))}
                </Box>
                <Typography variant='body1'>{review.description}</Typography>
                {review.images && review.images.length > 0 && (
                  <Box mt={2} display='flex' flexWrap='wrap' gap={1}>
                    {review.images.map((image, imgIndex) => (
                      <CardMedia
                        key={imgIndex}
                        component='img'
                        image={image}
                        alt={`Review image ${imgIndex + 1}`}
                        sx={{ width: 100, height: 100, borderRadius: 1, objectFit: 'cover' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Typography variant='body2'>No reviews available.</Typography>
          )}
          <Box display='flex' justifyContent='flex-end' mt={2}>
            <Button variant='contained' color='primary' onClick={handleCloseReviewModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* <Modal open={isAddModalOpen} onClose={closeAddModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            width: 700,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 3
          }}
        >
          {currentStep === 1 ? (
            <>
              <Typography variant='h4' gutterBottom>
                Add Product Details
              </Typography>
              <Box mb={3}>
                <Typography variant='body1' gutterBottom sx={{ mb: 1 }}>
                  Upload Images
                </Typography>
                <Button variant='contained' component='label' startIcon={<Add />} sx={{ mb: 2 }} color='primary'>
                  Choose Files
                  <input type='file' accept='image/*' hidden multiple onChange={handleImageUpload} />
                </Button>
                {isUploading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
                <Box
                  display='flex'
                  flexWrap='wrap'
                  gap={2}
                  sx={{
                    mt: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    justifyContent: 'flex-start'
                  }}
                >
                  {newProductData?.mediaUrl.map((url, index) => (
                    <Card key={index} sx={{ width: 120, height: 120, position: 'relative', boxShadow: 2 }}>
                      <CardMedia
                        component='img'
                        src={url}
                        alt={`preview ${index}`}
                        height='120'
                        sx={{ borderRadius: 1, objectFit: 'cover' }}
                      />
                      <CardActions
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%'
                        }}
                      >
                        <IconButton
                          size='small'
                          onClick={() =>
                            setNewProductData(prevData => ({
                              ...prevData,
                              mediaUrl: prevData.mediaUrl.filter((_, i) => i !== index)
                            }))
                          }
                          color='error'
                        >
                          <Delete fontSize='small' />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Box>
              <TextField
                label='Title'
                fullWidth
                margin='normal'
                value={newProductData.title}
                onChange={e => setNewProductData({ ...newProductData, title: e.target.value })}
              />
              <TextField
                label='Description'
                fullWidth
                margin='normal'
                multiline
                rows={4}
                value={newProductData.descriptionHtml}
                onChange={e => setNewProductData({ ...newProductData, descriptionHtml: e.target.value })}
              />
              <TextField
                fullWidth
                label='Tags'
                value={newProductData.tags}
                onChange={e => setNewProductData({ ...newProductData, tags: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Category'
                value={newProductData.category}
                onChange={e => setNewProductData({ ...newProductData, category: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              />
              {isAddModalOpen ? (
                <Box mb={3}>
                  <Typography variant='body1' gutterBottom>
                    Variants
                  </Typography>
                  {newProductData?.variants?.map((variant, index) => (
                    <Box key={index} mb={3} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                      <Typography variant='subtitle1' gutterBottom>
                        Variant {index + 1}
                      </Typography>
                      <TextField
                        label='Option Name'
                        fullWidth
                        value={variant.optionName}
                        onChange={e => handleVariantOptionChange(index, 'optionName', e.target.value)}
                        margin='normal'
                        sx={{ mb: 2 }}
                      />
                      {variant?.optionValues?.map((value, valIndex) => (
                        <TextField
                          key={valIndex}
                          label={`Option Value ${valIndex + 1}`}
                          fullWidth
                          value={value}
                          onChange={e => handleOptionValueChange(index, valIndex, e.target.value)}
                          margin='normal'
                          sx={{ mb: 1 }}
                        />
                      ))}
                      <Button onClick={() => handleAddOptionValue(index)} variant='text' color='primary' sx={{ mt: 1 }}>
                        Add Option Value
                      </Button>
                    </Box>
                  ))}
                  <Button
                    onClick={handleAddVariantOption}
                    variant='contained'
                    color='primary'
                    startIcon={<Add />}
                    sx={{ mt: 2 }}
                  >
                    Add Variant Option
                  </Button>
                </Box>
              ) : null}
              <TextField
                fullWidth
                select
                label='Collection'
                value={newProductData?.collection}
                onChange={e => setNewProductData({ ...newProductData, collection: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              >
                {categories?.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label='Brands'
                value={newProductData?.brand}
                onChange={e => setNewProductData({ ...newProductData, brand: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              >
                {brands?.map((brand, index) => (
                  <MenuItem key={index} value={`${index + 1}_${brand.name}`}>
                    {`${index + 1}. ${brand.name}`}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant='contained' color='primary' onClick={handleNextStep} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Next'}
              </Button>
            </>
          ) : currentStep === 2 ? (
            <>
              <Typography variant='h4' gutterBottom>
                Add Variant Details
              </Typography>

              <Box mb={2}>
                <TextField
                  label='Comparable Price'
                  fullWidth
                  type='number'
                  value={newProductData.comparePrice || ''}
                  onChange={e => setNewProductData({ ...newProductData, comparePrice: e.target.value })}
                  margin='normal'
                />
              </Box>

              <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 3 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant Title</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Inventory Quantity</TableCell>
                      <TableCell>GST (18%)</TableCell>
                      <TableCell>MRP (Price + GST)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variantDetails?.map((variant, index) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.title}</TableCell>
                        <TableCell>
                          <TextField
                            type='number'
                            value={variant.price}
                            onChange={e => handleVariantInputChange(index, 'price', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type='number'
                            value={variant.inventory}
                            onChange={e => handleVariantInputChange(index, 'inventory', e.target.value)}
                            fullWidth
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            label='GST Percentage'
                            fullWidth
                            type='number'
                            value={gstPercentage}
                            onChange={e => setGstPercentage(Number(e.target.value))}
                            margin='normal'
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            label='MRP Price (with 18% GST)'
                            type='text'
                            // value={variant.price ? `₹${(parseFloat(variant.price) * 1.18).toFixed(2)}` : ''}
                            value={
                              variant.price
                                ? `₹${(parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2)}`
                                : ''
                            }
                            disabled
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display='flex' justifyContent='space-between'>
                <Button variant='outlined' onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button variant='contained' color='primary' onClick={createFinalProduct} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal> */}

      <Modal open={isAddModalOpen} onClose={closeAddModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            width: '80%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Box p={4}>
            <Stepper activeStep={currentStep - 1} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box mt={4}>
              {currentStep === 1 && (
                <>
                  <Typography variant='h5' gutterBottom>
                    Add Product Details
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    Fill in the details about your product.
                  </Typography>

                  {/* Image Upload Section */}
                  <Box mt={3}>
                    <Typography variant='subtitle1' gutterBottom>
                      Upload Images
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #ddd',
                        borderRadius: 2,
                        padding: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f9f9f9' }
                      }}
                      onClick={() => document.querySelector('#image-upload').click()}
                    >
                      <Typography variant='body2' color='textSecondary'>
                        Drag & drop images here, or click to upload
                      </Typography>
                      <input
                        id='image-upload'
                        type='file'
                        accept='image/*'
                        hidden
                        multiple
                        onChange={handleImageUpload}
                      />
                    </Box>
                    <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
                      {newProductData?.mediaUrl.map((url, index) => (
                        <Card key={index} sx={{ width: 120, height: 120, position: 'relative', boxShadow: 2 }}>
                          <CardMedia
                            component='img'
                            src={url}
                            alt={`Preview ${index + 1}`}
                            sx={{ objectFit: 'cover', height: '100%' }}
                          />
                          <CardActions
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '50%'
                            }}
                          >
                            <Button
                              color='error'
                              onClick={() =>
                                setNewProductData(prev => ({
                                  ...prev,
                                  mediaUrl: prev.mediaUrl.filter((_, i) => i !== index)
                                }))
                              }
                            >
                              <Delete />
                            </Button>
                          </CardActions>
                        </Card>
                      ))}
                    </Box>
                  </Box>

                  {/* Product Details Section */}
                  <Box mt={3}>
                    <TextField
                      label='Product Title'
                      fullWidth
                      value={newProductData.title}
                      onChange={e => setNewProductData({ ...newProductData, title: e.target.value })}
                      margin='normal'
                    />
                    <TextField
                      label='Description'
                      fullWidth
                      multiline
                      rows={4}
                      value={newProductData.descriptionHtml}
                      onChange={e => setNewProductData({ ...newProductData, descriptionHtml: e.target.value })}
                      margin='normal'
                    />
                    <TextField
                      label='Tags'
                      fullWidth
                      value={newProductData.tags}
                      onChange={e => setNewProductData({ ...newProductData, tags: e.target.value })}
                      margin='normal'
                    />
                    <TextField
                      fullWidth
                      label='Category'
                      value={newProductData.category}
                      onChange={e => setNewProductData({ ...newProductData, category: e.target.value })}
                      margin='normal'
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {/* Collections and Brands */}
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      select
                      label='Collection'
                      value={newProductData?.collection}
                      onChange={e => setNewProductData({ ...newProductData, collection: e.target.value })}
                      margin='normal'
                      sx={{ mb: 2 }}
                    >
                      {categories?.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      select
                      label='Brands'
                      value={newProductData?.brand}
                      onChange={e => setNewProductData({ ...newProductData, brand: e.target.value })}
                      margin='normal'
                      sx={{ mb: 2 }}
                    >
                      {brands?.map((brand, index) => (
                        <MenuItem key={index} value={`${index + 1}_${brand.name}`}>
                          {`${index + 1}. ${brand.name}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={currentStep === 1 ? handleModalPageCHange : null}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : currentStep === 3 ? 'Save' : 'Next'}
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Typography variant='h5' gutterBottom>
                    Add Variant Details
                  </Typography>
                  <Box mt={3}>
                    {newProductData?.variants?.map((variant, index) => (
                      <Box key={index} sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant='subtitle1'>Variant {index + 1}</Typography>
                        <TextField
                          label='Option Name'
                          fullWidth
                          value={variant.optionName}
                          onChange={e => handleVariantOptionChange(index, 'optionName', e.target.value)}
                          margin='normal'
                        />
                        {variant?.optionValues?.map((value, valIndex) => (
                          <TextField
                            key={valIndex}
                            label={`Option Value ${valIndex + 1}`}
                            fullWidth
                            value={value}
                            onChange={e => handleOptionValueChange(index, valIndex, e.target.value)}
                            margin='normal'
                            sx={{ mb: 1 }}
                          />
                        ))}
                        <Button
                          onClick={() => handleAddOptionValue(index)}
                          variant='text'
                          color='primary'
                          sx={{ mt: 1 }}
                        >
                          Add Option Value
                        </Button>
                      </Box>
                    ))}
                    <Button
                      onClick={handleAddVariantOption}
                      variant='contained'
                      color='primary'
                      startIcon={<Add />}
                      sx={{ mt: 2 }}
                    >
                      Add Variant Option
                    </Button>
                  </Box>

                  <Button
                    variant='contained'
                    color='primary'
                    onClick={currentStep === 2 ? handleNextStep : null}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : currentStep === 3 ? 'Save' : 'Next'}
                  </Button>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Typography variant='h4' gutterBottom>
                    Add Variant Details
                  </Typography>
                  <Box mb={2}>
                    <TextField
                      label='Comparable Price'
                      fullWidth
                      type='number'
                      value={newProductData.comparePrice || ''}
                      onChange={e => setNewProductData({ ...newProductData, comparePrice: e.target.value })}
                      // onChange={e => handleVariantInputChange(index, 'comparePrice', e.target.value)}
                      margin='normal'
                    />
                  </Box>
                  <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 3 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Variant Title</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Inventory Quantity</TableCell>
                          <TableCell>GST (18%)</TableCell>
                          <TableCell>MRP (Price + GST)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {variantDetails?.map((variant, index) => (
                          <TableRow key={variant.id}>
                            <TableCell>{variant.title}</TableCell>
                            <TableCell>
                              <TextField
                                type='number'
                                value={variant.price}
                                onChange={e => handleVariantInputChange(index, 'price', e.target.value)}
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type='number'
                                value={variant.inventory}
                                onChange={e => handleVariantInputChange(index, 'inventory', e.target.value)}
                                fullWidth
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                label='GST Percentage'
                                fullWidth
                                type='number'
                                value={gstPercentage}
                                onChange={e => setGstPercentage(Number(e.target.value))}
                                margin='normal'
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                label='MRP Price (with 18% GST)'
                                type='text'
                                // value={variant.price ? `₹${(parseFloat(variant.price) * 1.18).toFixed(2)}` : ''}
                                value={
                                  variant.price
                                    ? `₹${(parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2)}`
                                    : ''
                                }
                                disabled
                                fullWidth
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={currentStep === 3 ? createFinalProduct : null}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : currentStep === 3 ? 'Save' : 'Next'}
                  </Button>
                </>
              )}
            </Box>
            \
          </Box>
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            width: 900,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 3
          }}
        >
          {currentStep === 1 ? (
            <>
              <Typography variant='h4' gutterBottom>
                Edit Product Details
              </Typography>
              <Box mb={3}>
                <Typography variant='body1' gutterBottom sx={{ mb: 1 }}>
                  Upload Images
                </Typography>
                <Button variant='contained' component='label' startIcon={<Add />} sx={{ mb: 2 }} color='primary'>
                  Choose Files
                  <input type='file' accept='image/*' hidden multiple onChange={handleImageUpload} />
                </Button>
                {isUploading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
                <Box
                  display='flex'
                  flexWrap='wrap'
                  gap={2}
                  sx={{
                    mt: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    justifyContent: 'flex-start'
                  }}
                >
                  {editProductData?.mediaUrl?.map((url, index) => (
                    <Card key={index} sx={{ width: 120, height: 120, position: 'relative', boxShadow: 2 }}>
                      <CardMedia
                        component='img'
                        src={url}
                        alt={`preview ${index}`}
                        height='120'
                        sx={{ borderRadius: 1, objectFit: 'cover' }}
                      />
                      <CardActions
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%'
                        }}
                      >
                        <IconButton
                          size='small'
                          onClick={() =>
                            setEditProductData(prevData => ({
                              ...prevData,
                              mediaUrl: prevData.mediaUrl.filter((_, i) => i !== index)
                            }))
                          }
                          color='error'
                        >
                          <Delete fontSize='small' />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Box>

              <TextField
                label='Title'
                fullWidth
                margin='normal'
                value={editProductData.title}
                onChange={e => setEditProductData({ ...editProductData, title: e.target.value })}
              />
              <TextField
                label='Description'
                fullWidth
                margin='normal'
                multiline
                rows={4}
                value={editProductData.descriptionHtml}
                onChange={e => setEditProductData({ ...editProductData, descriptionHtml: e.target.value })}
              />
              <TextField
                label='Tags'
                fullWidth
                margin='normal'
                value={editProductData.tags}
                onChange={e => setEditProductData({ ...editProductData, tags: e.target.value })}
              />

              <TextField
                fullWidth
                select
                label='Collection'
                value={editProductData?.collection}
                onChange={e => setEditProductData({ ...editProductData, collection: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              >
                {categories?.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {Array.isArray(editProductData?.collection) &&
                  editProductData?.collection.map((collectionName, index) => (
                    <Chip
                      key={index}
                      label={collectionName}
                      color='primary'
                      variant='outlined'
                      onDelete={() => handleRemoveCollection(collectionName)}
                    />
                  ))}
              </Box>
              <TextField
                fullWidth
                select
                label='Brands'
                value={editProductData?.brand}
                onChange={e => setEditProductData({ ...editProductData, brand: e.target.value })}
                margin='normal'
                sx={{ mb: 2 }}
              >
                {brands?.map((brand, index) => (
                  <MenuItem key={index} value={`${index + 1}_${brand.name}`}>
                    {`${index + 1}. ${brand.name}`}
                  </MenuItem>
                ))}
              </TextField>
              <Chip
                key={editProductData?.brand}
                label={formatBrand(editProductData?.brand)}
                color='primary'
                variant='outlined'
                // onDelete={() => {
                //   const updatedCollections = editProductData.collection.filter((_, i) => i !== index)
                //   setEditProductData({ ...editProductData, collection: updatedCollections })
                // }}
              />

              <Box display='flex' justifyContent='flex-end' mt={3}>
                <Button variant='contained' color='primary' onClick={handleAllDetailsSave}>
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant='h4' gutterBottom>
                Edit Variant Details
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 3 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant Title</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Gst</TableCell>
                      <TableCell>Compare Price</TableCell>
                      <TableCell>Inventory Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editVariantDetails.map((variant, index) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.title}</TableCell>
                        <TableCell>
                          <TextField
                            type='number'
                            value={variant.price}
                            onChange={e => {
                              const updatedVariants = [...editVariantDetails]
                              updatedVariants[index].price = e.target.value
                              setEditVariantDetails(updatedVariants)
                            }}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        </TableCell>
                        <Box mb={2}>
                          <TextField
                            label='GST Percentage'
                            fullWidth
                            type='number'
                            value={gstPercentage}
                            onChange={e => setGstPercentage(Number(e.target.value))}
                            margin='normal'
                          />
                        </Box>

                        <TableCell>
                          <TextField
                            type='number'
                            value={variant.comparePrice}
                            onChange={e => {
                              const updatedVariants = [...editVariantDetails]
                              updatedVariants[index].comparePrice = e.target.value
                              setEditVariantDetails(updatedVariants)
                            }}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type='number'
                            value={variant.inventoryQuantity}
                            onChange={e => {
                              const updatedVariants = [...editVariantDetails]
                              updatedVariants[index].inventoryQuantity = e.target.value
                              setEditVariantDetails(updatedVariants)
                            }}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            label='MRP Price (with GST)'
                            type='text'
                            value={
                              variant.price
                                ? `₹${(parseFloat(variant.price) * (1 + gstPercentage / 100)).toFixed(2)}`
                                : ''
                            }
                            disabled
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display='flex' justifyContent='space-between' mt={3}>
                <Button variant='outlined' onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button variant='contained' color='primary' onClick={handleSaveEdit}>
                  Save
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default ProductTable
