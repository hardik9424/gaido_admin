

import axios from 'axios';

export async function getAllSubCategory(token) {
  try {
    const response = await axios.get(
      `https://ships-api.applore.in/v1/api/admin/subcategory/get_all_subcategory?category=&page=${1}&limit=${100}`,
      {
        headers: {
          'ngrok-skip-browser-warning': 'asas',
          Authorization: `Bearer ${token}`,
          'Content-Type': `application/json`
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error // Rethrow the error if you want to handle it in the calling
  }
}

export async function createSubCategory(payload, token) {
  try {
    const data = {
      name: payload.name,
      image: payload.image,
      category_id: payload.categoryId
    }

    const response = await axios.post(
      'https://ships-api.applore.in/v1/api/admin/subcategory/create_subcategory',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Ensure the correct content type
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error creating category:', error.response ? error.response.data : error.message)
    throw error
  }
}

//  export async function updateSubCategory(categoryId, subCategoryId, name, image, token) {
//    try {
//      const response = await axios.patch(
//        'https://ships-api.applore.in/v1/api/admin/subcategory/update_subcategory',
//        {
//          category_id: categoryId,
//          subcategory_id: subCategoryId,
//          name: name,
//          image: image
//        },
//        {
//          headers: {
//            Authorization: `Bearer ${token}`
//          }
//        }
//      )

//      return response.data
//    } catch (error) {
//      console.error('Error updating category:', error)
//      throw error
//    }
//  }

export async function updateSubCategory(payload, token) {
  try {
    const response = await axios.patch(
      'https://ships-api.applore.in/v1/api/admin/subcategory/update_subcategory',
      {
        category_id: payload.categoryId,
        subcategory_id: payload.subCategoryId,
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