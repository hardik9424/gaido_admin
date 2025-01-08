import axios from 'axios'

export async function getMyProfile(token){
    try {
        const response = await axios.get("https://ships-api.applore.in/v1/api/admin/user/get_admin",{
            headers:{
         'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
            }
        })

        console.log(response)

return response.data;

        
    } catch (error) {
        console.error('Error fetching admin user details', error);
        throw error; // Rethrow the error if you want to handle it in the calling function
        
    }
}


export async function updateProfile(token,payload){

    const data = {
        "first_name": payload.firstName,
        "last_name": payload.lastName,
        "country_code": "91",
        "email": payload.email,
        "isOnboard": true,
        "profile": "https://applore-dev-projects-2.s3.ap-south-1.amazonaws.com/ships/27a9d4c4-de7c-4bbd-9b39-2d07d12bfb4b1719386061140.jpg",
        "about": "finding peace ",
        "isActive": true,
        "date_of_Birth": "2006-01-01T00:00:00.000",
        "home_port": "pune",
        "name": "backdev",
        "category_ids": [
            "667a71bb27f70ea0c4dd7cf0"
        ],
        "subcategory_ids": [
            "667abab58ab8691354a167bc",
            "667abaf28ab8691354a167c6",
            "667ab7498ab8691354a1671f",
            "667ab8bf8ab8691354a16760"
        ],
        "isBlocked": false,
        "isDeleted": false
      };

    try {
        const response = axios.post("https://0wzvh135-5000.inc1.devtunnels.ms/v1/api/user/profile/update_profile",
            data,{
                headers:{
               'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

                }
            }
        )

        
return response
        
    } catch (error) {
        console.error("Error Updating User Details")
        throw error
        
    }
}
