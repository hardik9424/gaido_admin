

import axios from 'axios';

export async function getAllCommunity(token){
try {
        const response = await axios.get("https://ships-api.applore.in/v1/api/admin/community/get_all_community",{
            headers:{
                'Authorization': `Bearer ${token}`,
                "Content-Type":'application/json'
            }
        })
    
        
    return response.data
} catch (error) {
    console.error('Error fetching community:', error);
    throw error; // Rethrow the error if you want to handle it in the calling 
    
}
    
}

export async function createCommunity(token,payload){
    try {
        const data = {
            name: payload.name,
            image: payload.image,
            description:payload.description,
            category:payload.category_ID
          };

        const response = await axios.post("https://ships-api.applore.in/v1/api/admin/community/create_community",
            data,
            {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json', // Ensure the correct content type
                }
              }
               
            

        )

        
return response.data;
        
    } catch (error) {
        console.error('Error creating category:', error.response ? error.response.data : error.message);
        throw error;
        
    }
}
