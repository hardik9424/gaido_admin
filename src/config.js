const config = {
  BASE_URLS: {
    AUTH: 'http://localhost:2001', // Authentication service
    SUBSCRIPTION: 'http://localhost:2008', // Subscription service
    USER: 'http://localhost:3000' // User management service
    // Add more services as needed
  },
  API_PATHS: {
    LOGIN: '/authentication/api/v1',
    SUBSCRIPTION: '/subscription/api/v1',
    REGISTER: '/auth/register',
    CREATE_USER: '/user/create',
    GET_ALL_USERS: '/user/getAll',
    DELETE_USER: '/user/delete'
    // Add specific paths relevant to your API services
  }
}

export default config
