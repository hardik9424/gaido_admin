import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'

const ManageVets = () => {
  const [vets, setVets] = useState([])
  const router = useRouter()

  // Fetch all vets on component load
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await axios.get('/api/vets/getAllVets')
        setVets(response.data)
      } catch (error) {
        console.error('Error fetching vets', error)
      }
    }
    fetchVets()
  }, [])

  // Handle vet removal
  const handleRemoveVet = async vetId => {
    if (confirm('Are you sure you want to remove this vet?')) {
      try {
        await axios.delete(`/api/vets/deleteVet`, { data: { id: vetId } })
        alert('Vet removed successfully')
        setVets(vets.filter(vet => vet.id !== vetId)) // Remove vet from state
      } catch (error) {
        console.error('Error removing vet', error)
        alert('Failed to remove vet')
      }
    }
  }

  // Navigate to the vet editing page
  const handleEditVet = vetId => {
    router.push(`/vets/edit/${vetId}`)
  }

  return (
    <div>
      <h2>Manage Vets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Profile Picture</th>
            <th>Assigned Hospitals</th>
            <th>Ratings</th>
            <th>Consultation Fees</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vets.map(vet => (
            <tr key={vet.id}>
              <td>{vet.name}</td>
              <td>{vet.specialization}</td>
              <td>
                {vet.profilePicture ? (
                  <img src={vet.profilePicture} alt='Profile' width={50} height={50} />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                {vet.Clinic && vet.Clinic.length > 0
                  ? vet.Clinic.map(clinic => clinic.name).join(', ')
                  : 'Not Assigned'}
              </td>
              <td>{vet.ratings ?? 'No Ratings'}</td>
              <td>{vet.consultationFees ?? 'N/A'}</td>
              <td>{vet.experience ?? 'N/A'}</td>
              <td>
                <button onClick={() => handleEditVet(vet.id)}>Edit</button>
                <button onClick={() => handleRemoveVet(vet.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageVets
