

import axios from 'axios';

export async function getAllCategories(token, id = null) {
  try {
    const response = await axios.get('https://ships-api.applore.in/v1/api/admin/category/get_all_category', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(response)

    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error // Rethrow the error if you want to handle it in the calling function
  }
}

export async function createCategory(payload, token) {
  try {
    const data = {
      name: payload.name,
      image: payload.image
    }

    const response = await axios.post('https://ships-api.applore.in/v1/api/admin/category/create_category', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // Ensure the correct content type
      }
    })

    return response.data
  } catch (error) {
    console.error('Error creating category:', error.response ? error.response.data : error.message)
    throw error
  }
}

export async function updateCategory(payload, token) {
  try {
    const response = await axios.patch(
      `https://ships-api.applore.in/v1/api/admin/category/update_category`,
      {
        category_id: payload.category_id,
        name: payload.name,
        image: payload.image
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}
