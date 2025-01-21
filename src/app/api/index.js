import axios from '../../utils/axios'

//AUTH
export const verifyUser = data => axios('admin/auth/verifyadmin', 'POST', data)
export const loginAdminUser = data => axios('admin/auth/login', 'POST', data)
export const adminDetails = data => axios('admin/auth/admiindetails', 'POST', data)

//api to update admin email name number
export const changeAdminDetails = data=>axios('admin/auth/changedetails', 'PUT', data)

//api to get analytics
export const getUserAnalytics = data => axios('admin/auth/useranalytics', 'GET', data)

export const uploadFile = data => axios('admin/auth/file/upload', 'POST', data, true)

// get admin user lists
export const getAllAdminsUsers = data => axios('admin/auth/adminuserlists', 'GET', data)
// api to create admi user
export const createAdminUser = data => axios('admin/auth/adminusercreate', 'POST', data)
// api to delete admin user
export const deleteAdminUser = data => axios('admin/auth/deleteuser', 'DELETE', data)
// api to edit admi user details
export const editAdminUserDetails = data => axios('admin/auth/adminuser/update', 'PUT', data)
// App User Lists
export const appUserList = data => axios('admin/auth/userlists', 'GET')

// api to get all permissions
export const getAllPermissions = data => axios('admin/auth/getpermissions', 'GET', data)

// api to create role
export const createRole = data => axios('admin/auth/createrole', 'POST', data)
export const deleteRole = data => axios('admin/auth/deleterole', 'DELETE', data)
export const deleteAdminRole = data => axios('admin/auth/roleadmin', 'DELETE', data)
// api to update admin role only
export const updateRole = data => axios('admin/auth/roleupdate', 'PUT', data)
//a pi to get roles
export const getAllRoles = data => axios('admin/auth/getroles', 'GET', data)
// api to edit roles
export const editRoles = data => axios('admin/auth/adminuser/role/update', 'PUT', data)

// api to get all industry lists
export const getIndustryList = (page, limit, globalFilter) =>
  axios(`admin/auth/industrylists?page=${page}&limit=${limit}&search=${globalFilter}`, 'GET')
// export const getIndustryList = (page, limit, search = '') => {
//   const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '' // Add search term if provided
//   return axios(`admin/auth/industrylists?page=${page}&limit=${limit}${searchQuery}`, 'GET')
// }

// api to get functions
export const getFunctions = (page, limit, globalFilter) =>
  axios(`admin/auth/getallfunctions?page=${page}&limit=${limit}&search=${globalFilter}`, 'GET')

// api to get all jobs roles
export const getJobRoles = (page, limit) => axios(`admin/auth/getalljobs?page=${page}&limit=${limit}`, 'GET')
export const createJobRoles = data => axios('admin/auth/createjobrole', 'POST', data)
export const deleteJobRoles = data => axios('admin/auth/deletejobrole', 'DELETE', data)
export const updateJobRoles = data => axios('admin/auth/updatejobrole', 'PUT', data)

// api to create industry
export const createIndustry = data => axios('admin/auth/createindustry', 'POST', data)
//api to delete industry
export const deleteIndustry = data => axios('admin/auth/deleteindustry', 'DELETE', data)
//api to edit industry
export const editIndustry = data => axios('admin/auth/updateindustry', 'PUT', data)

// api to get all news
export const getAllNews = (page, limit) => axios(`admin/auth/getallnews?page=${page}&limit=${limit}`)

// api to get privacy policy
export const getPrivacyPolicy = data => axios('admin/auth/getprivacypolicy', 'GET')
//api to create privacy policy
export const createPrivacyPolicy = data => axios('admin/auth/settings/update', 'PUT', data)

//api to get terms & condition
export const getTermsAndConditions = data => axios('admin/auth/gettermsandcondition', 'GET')
export const createTermsAndConditions = data => axios('admin/auth/createtermsandcondition', 'POST', data)

// api to create functions
export const createFunction = data => axios('admin/auth/createfunction', 'POST', data)

//a pi to delete function
export const deleteFunction = data => axios('admin/auth/deletefunction', 'DELETE', data)
//api to edit function
export const editFunction = data => axios('admin/auth/editfunction', 'PUT', data)

export const getSettings = data => axios('admin/auth/settings', 'GET', data)

// api to create new
export const createNew = data => axios('admin/auth/createnews', 'POST', data)
export const updateNews = data => axios('admin/auth/updatenews', 'PUT', data)
export const deleteNews = data => axios('admin/auth/deletenews', 'DELETE', data)


// block/un apis
export const blockUser = data => axios('admin/auth/blockuser', 'PUT', data)
export const unBlockUser = data => axios('admin/auth/unblockuser', 'PUT',data)

// api for csv
export const uploadCsv = data=>axios('admin/auth/industry/import', 'POST', data, true)

export const uploadFunctionCsv = data=>axios('admin/auth/function/import', 'POST', data, true)

export const uploadJobCsv = data=>axios('admin/auth/job/import', 'POST', data, true)