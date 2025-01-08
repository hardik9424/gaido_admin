import React, { useState, useEffect } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { AnimatePresence, motion } from 'framer-motion'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  IconButton,
  TablePagination,
  CardHeader,
  TextField,
  Modal,
  Box,
  LinearProgress
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { blockPet, unblockPet } from '@/app/api'
import { Group } from '@mui/icons-material'

const PetsTable = ({ pets, setPets }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [petsData, setPetsData] = useState(pets)
  const [filteredPets, setFilteredPets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [images, setImages] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Animated Placeholder Data
  const [animateData] = useState(['Search users', 'Search pets'])
  const [currentIndex, setCurrentIndex] = useState(0)

  const searchParams = useSearchParams()
  const handleOpenModal = images => {
    setImages(images)
    setOpenModal(true)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % animateData.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [animateData])

  const handleCloseModal = () => {
    setOpenModal(false)
    setImages([])
  }

  useEffect(() => {
    const queryParam = searchParams.get('user')
    console.log('fsdff', queryParam, searchParams.size)
    if (queryParam) {
      const newData = pets?.filter(pet => pet.userId === queryParam)
      setFilteredPets(newData)
    } else {
      setFilteredPets(pets)
    }
  }, [searchParams, pets])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = e => {
    setLoading(true)
    try {
      setSearchTerm(e.target.value)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBlock = async (petId, isActive) => {
    const payload = { petId }
    console.log('is', isActive)

    try {
      // Call blockPet if the pet is currently active; otherwise, call unblockPet
      const response = isActive ? await blockPet(petId, payload) : await unblockPet(petId, payload)

      if (response?.status === 200) {
        // Immediately update the pet's status in the local state
        const updatedPets = petsData.map(pet => (pet.id === petId ? { ...pet, status: !isActive } : pet))
        // setPetsData(updatedPets)
        setPets(updatedPets)

        toast.success(isActive ? 'Pet blocked successfully' : 'Pet UnBlocked successfully')
      } else {
        toast.error('Failed to update pet status')
      }
    } catch (error) {
      console.error('Error blocking/unblocking pet:', error)
      toast.error('An error occurred while updating pet status')
    }
  }

  // Filter pets based on the search term, checking within filteredPets (either query-filtered or full data)
  const displayedPets = (filteredPets || petsData).filter(
    pet =>
      pet?.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length)
  }

  const isPdf = url => url?.endsWith('.pdf')

  const navigation = useRouter()

  const handleImageOpen = imagesArray => {
    console.log('im', imagesArray)
    setOpenModal(true)

    if (imagesArray) {
      setImages(imagesArray)
    } else {
      setImages([])
    }
  }

  return (
    <>
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
      <ToastContainer />
      <TableContainer component={Paper}>
        <CardHeader
          avatar={<Group color='primary' fontSize='large' />} // Icon before title
          title='Pets Database'
          titleTypographyProps={{
            variant: 'h5', // Set the text size
            color: 'textPrimary', // Optional: Change text color
            fontWeight: 'bold' // Optional: Make it bold
          }}
          subheader={'View pets'}
        />
        {searchParams.size === 0 ? null : (
          <Button
            variant='conatined'
            onClick={() => {
              navigation.back()
            }}
          >
            Back To User
          </Button>
        )}
        <TextField
          onClick={() => {
            setClicked(true)
          }}
          onBlur={() => {
            setClicked(false)
          }}
          // label='Search Pets'
          placeholder=''
          InputProps={{
            startAdornment: (
              <>
                {!clicked && !searchTerm ? (
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      width: '200px'
                    }}
                  >
                    <AnimatePresence>
                      <motion.div
                        key={animateData[currentIndex]}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 120,
                          damping: 14
                        }}
                        style={{
                          fontSize: '16px',
                          color: 'rgba(0, 0, 0, 0.6)',
                          position: 'absolute',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {animateData[currentIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                ) : null}
              </>
            )
          }}
          variant='outlined'
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          sx={{ marginBottom: '16px' }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'semiBold', padding: '10px' }}>Parent Name</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Pet Name</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Images</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Breed</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Vaccination Card</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Deworming Card</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>KCI Certification</TableCell>
              <TableCell sx={{ fontWeight: '', padding: '10px' }}>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPets?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(pet => (
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
                  },
                  borderBottom: '1px solid #e0e0e0'
                }}
                key={pet.id}
              >
                <TableCell sx={{ padding: '10px' }}>
                  <Tooltip title={pet?.User?.name}>
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px',
                        display: 'block'
                      }}
                    >
                      <Link href={`/pawmanagment/${pet.id}`} state={{ pet }}>
                        {pet?.User?.name}
                      </Link>
                    </span>
                  </Tooltip>
                </TableCell>

                <TableCell sx={{ padding: '10px' }}>
                  <Link
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'orange',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                    href={`/pawmanagment/${pet.id}`}
                  >
                    {pet.name}
                  </Link>
                </TableCell>
                <TableCell
                  onClick={() => {
                    handleImageOpen(pet.images)
                  }}
                >
                  {pet?.images.length}
                </TableCell>

                <TableCell sx={{ padding: '10px' }}>{pet.type}</TableCell>
                <TableCell sx={{ padding: '10px' }}>{pet.breed}</TableCell>

                <TableCell sx={{ padding: '10px' }}>
                  {pet?.vaccinationCard ? (
                    isPdf(pet.vaccinationCard) ? (
                      <a href={pet.vaccinationCard} target='_blank' rel='noopener noreferrer'>
                        <IconButton size='small'>
                          <PictureAsPdfIcon />
                        </IconButton>
                      </a>
                    ) : (
                      <img
                        src={pet.vaccinationCard}
                        alt='Vaccination Card'
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )
                  ) : (
                    'No Vaccination Card'
                  )}
                </TableCell>

                <TableCell sx={{ padding: '10px' }}>
                  {pet?.dewormingCard ? (
                    isPdf(pet.dewormingCard) ? (
                      <a href={pet.dewormingCard} target='_blank' rel='noopener noreferrer'>
                        <IconButton size='small'>
                          <PictureAsPdfIcon />
                        </IconButton>
                      </a>
                    ) : (
                      <img
                        src={pet.dewormingCard}
                        alt='Deworming Card'
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )
                  ) : (
                    'No Deworming Card'
                  )}
                </TableCell>

                <TableCell sx={{ padding: '10px' }}>
                  {pet.kciCertification ? (
                    isPdf(pet.kciCertification) ? (
                      <a href={pet.kciCertification} target='_blank' rel='noopener noreferrer'>
                        <IconButton size='small'>
                          <PictureAsPdfIcon />
                        </IconButton>
                      </a>
                    ) : (
                      'Image Certificate'
                    )
                  ) : (
                    'Not Available'
                  )}
                </TableCell>

                <TableCell sx={{ padding: '10px' }}>
                  <Button
                    variant='contained'
                    onClick={() => handleToggleBlock(pet.id, pet.status)}
                    color={pet.status ? 'success' : 'error'}
                    size='small'
                  >
                    {pet.status ? 'Block' : 'UnBlock'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={displayedPets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: '10%', textAlign: 'center', position: 'relative' }}>
          {images.length > 0 ? (
            <div>
              <img
                src={images[currentImageIndex]}
                alt={`Slide ${currentImageIndex + 1}`}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
              <Box sx={{ mt: 2 }}>
                <IconButton onClick={handlePrevImage} disabled={images.length <= 1}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <span>
                  {currentImageIndex + 1} / {images.length}
                </span>
                <IconButton onClick={handleNextImage} disabled={images.length <= 1}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </div>
          ) : (
            <p>No images available.</p>
          )}
        </Box>
      </Modal>
    </>
  )
}

export default PetsTable
