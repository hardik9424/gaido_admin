'use client'

import React, { useState, useEffect } from 'react'

// import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import PetsTable from './PetsTable' // Import the table component
import PetForm from './PetForm' // Import the form component
import { getAllPets, deletePet } from '@/app/api' // Import your real API calls

const PetsManagement = () => {
  const [pets, setPets] = useState([]) // State to hold the list of pets
  const [isModalOpen, setModalOpen] = useState(false) // State to manage the modal
  const [editingPet, setEditingPet] = useState(null) // State to hold pet for editing
  const [loading, setLoading] = useState(true) // State to handle loading status
  const [userFilter, setUserFilter] = useState('')

  useEffect(() => {
    // Fetch pets when the component mounts
    const fetchPetsFromAPI = async () => {
      try {
        setLoading(true)
        const response = await getAllPets() // Fetch pets from the API
        console.log('pets', response)
        setPets(response.data?.data || []) // Set the pets data from the API response
      } catch (error) {
        console.error('Error fetching pets:', error)
      } finally {
        setLoading(false) // Turn off loading indicator
      }
    }
    fetchPetsFromAPI()
  }, [])

  const handleOpenModal = (pet = null) => {
    setEditingPet(pet) // Set pet for editing, or null for adding a new one
    setModalOpen(true) // Open the modal
  }

  const handleCloseModal = () => {
    setModalOpen(false) // Close the modal
    setEditingPet(null) // Reset the editing pet
  }

  const handleFormSubmit = newPetData => {
    if (editingPet) {
      // Update existing pet in the list
      setPets(prevPets => prevPets.map(pet => (pet.id === editingPet.id ? { ...pet, ...newPetData } : pet)))
    } else {
      // Add a new pet to the list
      setPets(prevPets => [...prevPets, { id: Date.now().toString(), ...newPetData }])
    }
    handleCloseModal() // Close the modal after submission
  }

  const handleDelete = async id => {
    console.log('petid', id)
    try {
      await deletePet(id)
      setPets(prevPets => prevPets.filter(pet => pet.id !== id))
    } catch (error) {
      console.error('Error deleting pet:', error)
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* <Button variant='contained' sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
        Add New Pet
      </Button> */}

      {/* Pets Table displaying a list of pets */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <PetsTable pets={pets} setPets={setPets} onEdit={handleOpenModal} onDelete={handleDelete} />
      )}

      {/* Pet Form inside a modal for adding or editing a pet */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth='sm'>
        {/* <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
        <DialogContent>
          <PetForm onSubmit={handleFormSubmit} initialData={editingPet || {}} />
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleCloseModal} color='secondary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PetsManagement
