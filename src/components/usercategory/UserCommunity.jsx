
// // 'use client';

// // import React, { useEffect, useState, useCallback } from 'react';

// // import { useRouter } from 'next/navigation';

// // import { useTheme } from '@mui/material/styles';
// // import useMediaQuery from '@mui/material/useMediaQuery';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Typography,
// //   Button,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   TextField,
// //   IconButton,
// //   MenuItem,
// //   Select,
// //   InputLabel,
// //   FormControl,
// //   Box,
// //   CircularProgress,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import EditIcon from '@mui/icons-material/Edit';
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';


// // import { getAllCategories } from '../../api/category/getAllCategory';
// // import { getAllCommunity, createCommunity, updateCommunity, uploadImage, deleteCommunity } from '@/app/api';

// // export default function UserTable() {
// //   const theme = useTheme();
// //   const router = useRouter();
// //   const [open, setOpen] = useState(false);
// //   const [communities, setCommunities] = useState([]);
// //   const [dropdownCategories, setDropdownCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [refreshCommunities, setRefreshCommunities] = useState(false);
// //   const [editingCommunity, setEditingCommunity] = useState(null);
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [communityToDelete, setCommunityToDelete] = useState(null);
// //   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

// //   const formik = useFormik({
// //     initialValues: {
// //       name: '',
// //       description: '',
// //       image: null,
// //       imagePreview: null,
// //       selectedCategory: '',
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required('Community name is required'),
// //       description: Yup.string().required('Description is required'),
// //       selectedCategory: Yup.string().required('Please select a category'),
// //     }),
// //     onSubmit: async (values, { resetForm }) => {
// //       try {
// //         const token = localStorage.getItem('token');

// //         if (!token) {
// //           router.push('/login');

// //           return;
// //         }

// //         let fileUrl = editingCommunity?.image || '';

// //         if (values.image) {
// //           const formData = new FormData();

// //           formData.append('file', values.image);
// //           const uploadResponse = await uploadImage(formData);

// //           fileUrl = uploadResponse.data.data.fileUrl;
// //         }

// //         const payload = {
// //           name: values.name,
// //           description: values.description,
// //           image: fileUrl,
// //           category: values.selectedCategory,
// //         };

// //         if (editingCommunity) {
// //           const updatePayload = {
// //             ...payload,
// //             community_id: editingCommunity._id,
// //           };

// //           await updateCommunity(updatePayload);
// //           setCommunities((prevCommunities) =>
// //             prevCommunities.map((community) =>
// //               community._id === editingCommunity._id ? { ...community, ...payload } : community
// //             )
// //           );
// //           setEditingCommunity(null);
// //         } else {
// //           const response = await createCommunity(payload);

// //           setCommunities((prevCommunities) => [...prevCommunities, response.data]);
// //         }

// //         setRefreshCommunities(!refreshCommunities);
// //         handleClose();
// //         resetForm();
// //       } catch (error) {
// //         console.error('Error creating/updating community:', error);
// //         setError('Failed to create/update community. Please try again later.');
// //       }
// //     },
// //   });

// //   const fetchCommunities = useCallback(async () => {
// //     try {
// //       const token = localStorage.getItem('token');

// //       if (!token) {
// //         router.push('/login');

// //         return;
// //       }

// //       const [communityResult, categoryResult] = await Promise.all([
// //         getAllCommunity(token),
// //         getAllCategories(token),
// //       ]);

// //       setCommunities(communityResult.data.data);
// //       setDropdownCategories(categoryResult.data);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //       setError('Failed to load data. Please try again later.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [router]);

// //   useEffect(() => {
// //     fetchCommunities();
// //   }, [fetchCommunities, refreshCommunities]);

// //   const handleClickOpen = () => {
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //     setEditingCommunity(null);
// //     formik.resetForm();
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];

// //     formik.setFieldValue('image', file);
// //     const reader = new FileReader();

// //     reader.onloadend = () => {
// //       formik.setFieldValue('imagePreview', reader.result);
// //     };

// //     if (file) {
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleDeleteCommunity = async () => {
// //     try {


// //       const result = await deleteCommunity({ id: communityToDelete._id });

// //       console.log(result)

// //       setCommunities((prevCommunities) =>
// //         prevCommunities.filter((community) => community._id !== communityToDelete._id)
// //       );
// //       setCommunityToDelete(null);
// //       setDeleteDialogOpen(false);
// //     } catch (error) {
// //       console.error('Error deleting community:', error);
// //     }
// //   };

// //   const handleEditOpen = (community) => {
// //     setEditingCommunity(community);
// //     formik.setValues({
// //       name: community.name,
// //       description: community.description,
// //       selectedCategory: community.category,
// //       image: null, // reset image to avoid unintentional uploads
// //       imagePreview: community.image,
// //     });
// //     setOpen(true);
// //   };

// //   const handleOpenDeleteDialog = (community) => {
// //     setCommunityToDelete(community);
// //     setDeleteDialogOpen(true);
// //   };

// //   const handleCloseDeleteDialog = () => {
// //     setDeleteDialogOpen(false);
// //     setCommunityToDelete(null);
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <>
// //       <Box display="flex" justifyContent="flex-end" mb={2}>
// //         <Button
// //           variant="contained"
// //           startIcon={<i className="tabler-plus" />}
// //           onClick={handleClickOpen}
// //           className="is-full sm:is-auto"
// //         >
// //           Add New Community
// //         </Button>
// //       </Box>
// //       {error && (
// //         <Typography color="error" mb={2}>
// //           {error}
// //         </Typography>
// //       )}
// //       <TableContainer component={Paper}>
// //         <Table sx={{ minWidth: 650 }} aria-label="simple table">
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>
// //                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                   Community Name
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                   Image
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                   Description
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                   Actions
// //                 </Typography>
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {communities.map((community) => (
// //               <TableRow key={community._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
// //                 <TableCell>{community.name}</TableCell>
// //                 <TableCell>
// //                   {community.image && (
// //                     <img
// //                       src={community.image}
// //                       alt="Community"
// //                       style={{ width: 50, height: 50, marginLeft: 10 }}
// //                     />
// //                   )}
// //                 </TableCell>
// //                 <TableCell>{community.description}</TableCell>
// //                 <TableCell>
// //                   <Box display="flex" alignItems="center">
// //                     <IconButton
// //                       aria-label="edit"
// //                       onClick={() => handleEditOpen(community)}
// //                     >
// //                       <EditIcon />
// //                     </IconButton>
// //                     <IconButton
// //                       aria-label="delete"
// //                       onClick={() => handleOpenDeleteDialog(community)}
// //                     >
// //                       <DeleteIcon />
// //                     </IconButton>
// //                   </Box>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add New Community'}</DialogTitle>
// //         <form onSubmit={formik.handleSubmit}>
// //           <DialogContent>
// //             <TextField
// //               autoFocus
// //               margin="dense"
// //               label="Community Name"
// //               type="text"
// //               fullWidth
// //               name="name"
// //               value={formik.values.name}
// //               onChange={formik.handleChange}
// //               onBlur={formik.handleBlur}
// //               error={formik.touched.name && Boolean(formik.errors.name)}
// //               helperText={formik.touched.name && formik.errors.name}
// //             />
// //             <TextField
// //               margin="dense"
// //               label="Description"
// //               type="text"
// //               fullWidth
// //               name="description"
// //               value={formik.values.description}
// //               onChange={formik.handleChange}
// //               onBlur={formik.handleBlur}
// //               error={formik.touched.description && Boolean(formik.errors.description)}
// //               helperText={formik.touched.description && formik.errors.description}
// //             />
// //             <FormControl fullWidth margin="dense">
// //               <InputLabel id="category-select-label">Category</InputLabel>
// //               <Select
// //                 labelId="category-select-label"
// //                 id="category-select"
// //                 name="selectedCategory"
// //                 value={formik.values.selectedCategory || ""}
// //                 onChange={formik.handleChange}
// //                 onBlur={formik.handleBlur}
// //                 error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
// //               >
// //                 {dropdownCategories.map((category) => (
// //                   <MenuItem key={category._id} value={category._id}>
// //                     {category.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //             <input
// //               id="fileInput"
// //               accept="image/*"
// //               type="file"
// //               onChange={handleImageChange}
// //               style={{ display: 'none' }}
// //             />
// //             <Button
// //               variant="contained"
// //               startIcon={<i className="tabler-upload" />}
// //               onClick={() => document.getElementById('fileInput').click()}
// //               sx={{ mt: 2 }}
// //             >
// //               Choose File
// //             </Button>
// //             {formik.values.imagePreview && (
// //               <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
// //                 <img
// //                   src={formik.values.imagePreview}
// //                   alt="Preview"
// //                   style={{ width: 100, height: 100 }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   color="secondary"
// //                   onClick={() => formik.setFieldValue('imagePreview', null)}
// //                   sx={{ ml: 2 }}
// //                 >
// //                   Delete
// //                 </Button>
// //               </Box>
// //             )}
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleClose}>Cancel</Button>
// //             <Button type="submit" variant="contained" color="primary">{editingCommunity ? 'Update' : 'Save'}</Button>
// //           </DialogActions>
// //         </form>
// //       </Dialog>
// //       <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
// //         <DialogTitle>Confirm Delete</DialogTitle>
// //         <DialogContent>
// //           <Typography>Are you sure you want to delete this community?</Typography>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
// //           <Button onClick={handleDeleteCommunity} color="secondary">Delete</Button>
// //         </DialogActions>
// //       </Dialog>
// //     </>
// //   );
// // }

// // 'use client';

// // import React, { useEffect, useState, useCallback } from 'react';

// // import { useRouter } from 'next/navigation';

// // import { useTheme } from '@mui/material/styles';
// // import useMediaQuery from '@mui/material/useMediaQuery';
// // import {
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     Paper,
// //     Typography,
// //     Button,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     TextField,
// //     IconButton,
// //     MenuItem,
// //     Select,
// //     InputLabel,
// //     FormControl,
// //     Box,
// //     CircularProgress,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import EditIcon from '@mui/icons-material/Edit';
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // import { getAllCategory, getAllCommunity, createCommunity, updateCommunity, uploadImage, deleteCommunity, getUserById } from '../../app/api';


// // export default function UserTable() {
// //     const theme = useTheme();
// //     const router = useRouter();
// //     const [open, setOpen] = useState(false);
// //     const [communities, setCommunities] = useState([]);
// //     const [dropdownCategories, setDropdownCategories] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState('');
// //     const [refreshCommunities, setRefreshCommunities] = useState(false);
// //     const [editingCommunity, setEditingCommunity] = useState(null);
// //     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //     const [communityToDelete, setCommunityToDelete] = useState(null);
// //     const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

// //     const formik = useFormik({
// //         initialValues: {
// //             name: '',
// //             description: '',
// //             image: null,
// //             imagePreview: null,
// //             selectedCategory: '',
// //         },
// //         validationSchema: Yup.object({
// //             name: Yup.string().required('Community name is required'),
// //             description: Yup.string().required('Description is required'),
// //             selectedCategory: Yup.string().required('Please select a category'),
// //         }),
// //         onSubmit: async (values, { resetForm }) => {
// //             setLoading(true);

// //             try {


// //                 let fileUrl = editingCommunity?.image || '';

// //                 if (values.image) {
// //                     const formData = new FormData();

// //                     formData.append('file', values.image);
// //                     const uploadResponse = await uploadImage(formData);

// //                     fileUrl = uploadResponse.data.data.fileUrl;
// //                 }

// //                 const payload = {
// //                     name: values.name,
// //                     description: values.description,
// //                     image: fileUrl,
// //                     category: values.selectedCategory,
// //                 };

// //                 if (editingCommunity) {
// //                     const updatePayload = {
// //                         ...payload,
// //                         community_id: editingCommunity._id,
// //                     };

// //                     await updateCommunity(updatePayload);
// //                     setCommunities((prevCommunities) =>
// //                         prevCommunities.map((community) =>
// //                             community._id === editingCommunity._id ? { ...community, ...payload } : community
// //                         )
// //                     );
// //                     toast.success('Community updated successfully');
// //                     setEditingCommunity(null);
// //                 } else {
// //                     const response = await createCommunity(payload);

// //                     setCommunities((prevCommunities) => [...prevCommunities, response.data]);
// //                     toast.success('Community created successfully');
// //                 }

// //                 setRefreshCommunities(!refreshCommunities);
// //                 handleClose();
// //                 resetForm();
// //             } catch (error) {
// //                 console.error('Error creating/updating community:', error);
// //                 toast.error('Failed to create/update community. Please try again later.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         },
// //     });

// //     const fetchCommunities = useCallback(async () => {
// //         setLoading(true);

// //         try {
// //             const token = localStorage.getItem('token');

// //             if (!token) {
// //                 router.push('/login');

// //                 return;
// //             }

// //             const [communityResult, categoryResult] = await Promise.all([
// //                 getAllCommunity(token),

// //                 getAllCategory(),
// //             ]);


// //             getUserById(localStorage.getItem("id"))
// //             console.log("cat", categoryResult)

// //             console.log(communityResult)
// //             setCommunities(communityResult.data.data);
// //             setDropdownCategories(categoryResult.data.data);
// //         } catch (error) {
// //             console.error('Error fetching data:', error);
// //             setError('Failed to load data. Please try again later.');
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [router]);

// //     useEffect(() => {
// //         fetchCommunities();
// //     }, [fetchCommunities, refreshCommunities]);

// //     const handleClickOpen = () => {
// //         setOpen(true);
// //     };

// //     const handleClose = () => {
// //         setOpen(false);
// //         setEditingCommunity(null);
// //         formik.resetForm();
// //     };

// //     const handleImageChange = (e) => {
// //         const file = e.target.files[0];

// //         formik.setFieldValue('image', file);
// //         const reader = new FileReader();

// //         reader.onloadend = () => {
// //             formik.setFieldValue('imagePreview', reader.result);
// //         };

// //         if (file) {
// //             reader.readAsDataURL(file);
// //         }
// //     };

// //     const handleDeleteCommunity = async () => {
// //         try {
// //             await deleteCommunity({ id: communityToDelete._id });
// //             setCommunities((prevCommunities) =>
// //                 prevCommunities.filter((community) => community._id !== communityToDelete._id)
// //             );
// //             toast.success('Community deleted successfully');
// //             setCommunityToDelete(null);
// //             setDeleteDialogOpen(false);
// //         } catch (error) {
// //             console.error('Error deleting community:', error);
// //             toast.error('Failed to delete community. Please try again later.');
// //         }
// //     };

// //     const handleEditOpen = (community) => {
// //         setEditingCommunity(community);
// //         formik.setValues({
// //             name: community.name,
// //             description: community.description,
// //             selectedCategory: community.category,
// //             image: null,
// //             imagePreview: community.image,
// //         });
// //         setOpen(true);
// //     };

// //     const handleOpenDeleteDialog = (community) => {
// //         setCommunityToDelete(community);
// //         setDeleteDialogOpen(true);
// //     };

// //     const handleCloseDeleteDialog = () => {
// //         setDeleteDialogOpen(false);
// //         setCommunityToDelete(null);
// //     };

// //     if (loading) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
// //                 <CircularProgress />
// //             </Box>
// //         );
// //     }

// //     return (
// //         <>
// //             <ToastContainer />
// //             <Box display="flex" justifyContent="flex-end" mb={2}>
// //                 <Button
// //                     variant="contained"
// //                     startIcon={<i className="tabler-plus" />}
// //                     onClick={handleClickOpen}
// //                     className="is-full sm:is-auto"
// //                 >
// //                     Add New Community
// //                 </Button>
// //             </Box>
// //             {error && (
// //                 <Typography color="error" mb={2}>
// //                     {error}
// //                 </Typography>
// //             )}
// //             <TableContainer component={Paper}>
// //                 <Table sx={{ minWidth: 650 }} aria-label="simple table">
// //                     <TableHead>
// //                         <TableRow>
// //                             <TableCell>
// //                                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                                     Community Name
// //                                 </Typography>
// //                             </TableCell>
// //                             <TableCell>
// //                                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                                     Image
// //                                 </Typography>
// //                             </TableCell>
// //                             <TableCell>
// //                                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                                     Description
// //                                 </Typography>
// //                             </TableCell>
// //                             <TableCell>
// //                                 <Typography variant="h6" color={theme.palette.primary.main}>
// //                                     Actions
// //                                 </Typography>
// //                             </TableCell>
// //                         </TableRow>
// //                     </TableHead>
// //                     <TableBody>
// //                         {communities.map((community) => (
// //                             <TableRow key={community._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
// //                                 <TableCell>{community.name}</TableCell>
// //                                 <TableCell>
// //                                     {community.image && (
// //                                         <img
// //                                             src={community.image}
// //                                             alt="Community"
// //                                             style={{ width: 50, height: 50, marginLeft: 10 }}
// //                                         />
// //                                     )}
// //                                 </TableCell>
// //                                 <TableCell>{community.description}</TableCell>
// //                                 <TableCell>
// //                                     <Box display="flex" alignItems="center">
// //                                         <IconButton
// //                                             aria-label="edit"
// //                                             onClick={() => handleEditOpen(community)}
// //                                         >
// //                                             <EditIcon />
// //                                         </IconButton>
// //                                         <IconButton
// //                                             aria-label="delete"
// //                                             onClick={() => handleOpenDeleteDialog(community)}
// //                                         >
// //                                             <DeleteIcon />
// //                                         </IconButton>
// //                                     </Box>
// //                                 </TableCell>
// //                             </TableRow>
// //                         ))}
// //                     </TableBody>
// //                 </Table>
// //             </TableContainer>
// //             <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// //                 <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add New Community'}</DialogTitle>
// //                 <form onSubmit={formik.handleSubmit}>
// //                     <DialogContent>
// //                         <TextField
// //                             autoFocus
// //                             margin="dense"
// //                             label=" NAME"
// //                             type="text"
// //                             fullWidth
// //                             name="name"
// //                             value={formik.values.name}
// //                             onChange={formik.handleChange}
// //                             onBlur={formik.handleBlur}
// //                             error={formik.touched.name && Boolean(formik.errors.name)}
// //                             helperText={formik.touched.name && formik.errors.name}
// //                         />
// //                         <TextField
// //                             margin="dense"
// //                             label={`DESCRIPTION\u00A0`}
// //                             type="text"
// //                             fullWidth
// //                             name="description"
// //                             value={formik.values.description}
// //                             onChange={formik.handleChange}
// //                             onBlur={formik.handleBlur}
// //                             error={formik.touched.description && Boolean(formik.errors.description)}
// //                             helperText={formik.touched.description && formik.errors.description}
// //                         />
// //                         <FormControl fullWidth margin="dense">
// //                             <InputLabel id="category-select-label">CATEGORY</InputLabel>
// //                             <Select
// //                                 labelId="category-select-label"
// //                                 id="category-select"
// //                                 label="CATEGORY"
// //                                 name="selectedCategory"
// //                                 variant='outlined'
// //                                 fullWidth
// //                                 margin="normal"

// //                                 value={formik.values.selectedCategory || ""}
// //                                 onChange={formik.handleChange}
// //                                 onBlur={formik.handleBlur}
// //                                 error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}

// //                             // sx={{ '& .MuiInputLabel-outlined': { transform: 'scale(0.75)' } }}

// //                             //
// //                             >
// //                                 {dropdownCategories.map((category) => (
// //                                     <MenuItem key={category._id} value={category._id}>
// //                                         {category.name}
// //                                     </MenuItem>
// //                                 ))}
// //                             </Select>
// //                         </FormControl>
// //                         <Button
// //                             variant="contained"
// //                             startIcon={<i className="tabler-upload" />}
// //                             onClick={() => document.getElementById('fileInput').click()}
// //                             sx={{ mt: 2 }}
// //                         >
// //                             Choose File
// //                         </Button>
// //                         <input
// //                             id="fileInput"
// //                             accept="image/*"
// //                             type="file"
// //                             onChange={handleImageChange}
// //                             style={{ display: 'none' }}
// //                         />

// //                         {formik.values.imagePreview && (
// //                             <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
// //                                 <img
// //                                     src={formik.values.imagePreview}
// //                                     alt="Preview"
// //                                     style={{ width: 100, height: 100 }}
// //                                 />

// //                             </Box>
// //                         )}
// //                     </DialogContent>
// //                     <DialogActions>
// //                         <Button onClick={handleClose}>Cancel</Button>
// //                         <Button type="submit" variant="contained" color="primary">
// //                             {editingCommunity ? 'Update' : 'Save'}
// //                         </Button>
// //                     </DialogActions>
// //                 </form>
// //             </Dialog>
// //             <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
// //                 <DialogTitle>Confirm Delete</DialogTitle>
// //                 <DialogContent>
// //                     <Typography>Are you sure you want to delete this community?</Typography>
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
// //                     <Button onClick={handleDeleteCommunity} color="secondary">Delete</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </>
// //     );
// // }


// // 'use client';

// // import React, { useEffect, useState, useCallback } from 'react';

// // import { useRouter } from 'next/navigation';

// // import { useTheme } from '@mui/material/styles';
// // import useMediaQuery from '@mui/material/useMediaQuery';
// // import {
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     Paper,
// //     Typography,
// //     Button,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     TextField,
// //     IconButton,
// //     MenuItem,
// //     Select,
// //     InputLabel,
// //     FormControl,
// //     Box,
// //     CircularProgress,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import EditIcon from '@mui/icons-material/Edit';
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // import { getAllCategory, getAllCommunity, createCommunity, updateCommunity, uploadImage, deleteCommunity, getUserById } from '../../app/api';

// // export default function UserTable() {
// //     const theme = useTheme();
// //     const router = useRouter();
// //     const [open, setOpen] = useState(false);
// //     const [communities, setCommunities] = useState([]);
// //     const [dropdownCategories, setDropdownCategories] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState('');
// //     const [userDetails, setUserDetails] = useState({});
// //     const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

// //     const formik = useFormik({
// //         initialValues: {
// //             name: '',
// //             description: '',
// //             image: null,
// //             imagePreview: null,
// //             selectedCategory: '',
// //         },
// //         validationSchema: Yup.object({
// //             name: Yup.string().required('Community name is required'),
// //             description: Yup.string().required('Description is required'),
// //             selectedCategory: Yup.string().required('Please select a category'),
// //         }),
// //         onSubmit: async (values, { resetForm }) => {
// //             setLoading(true);

// //             try {
// //                 let fileUrl = editingCommunity?.image || '';

// //                 if (values.image) {
// //                     const formData = new FormData();

// //                     formData.append('file', values.image);
// //                     const uploadResponse = await uploadImage(formData);

// //                     fileUrl = uploadResponse.data.data.fileUrl;
// //                 }

// //                 const payload = {
// //                     name: values.name,
// //                     description: values.description,
// //                     image: fileUrl,
// //                     category: values.selectedCategory,
// //                 };

// //                 if (editingCommunity) {
// //                     const updatePayload = { ...payload, community_id: editingCommunity._id };

// //                     await updateCommunity(updatePayload);
// //                     setCommunities((prevCommunities) =>
// //                         prevCommunities.map((community) =>
// //                             community._id === editingCommunity._id ? { ...community, ...payload } : community
// //                         )
// //                     );
// //                     toast.success('Community updated successfully');
// //                 } else {
// //                     const response = await createCommunity(payload);

// //                     setCommunities((prevCommunities) => [...prevCommunities, response.data]);
// //                     toast.success('Community created successfully');
// //                 }

// //                 resetForm();
// //                 setOpen(false);
// //             } catch (error) {
// //                 console.error('Error creating/updating community:', error);
// //                 toast.error('Failed to create/update community. Please try again later.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         },
// //     });

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             setLoading(true);
// //             const userId = localStorage.getItem('id');

// //             if (!userId) {
// //                 router.push('/login');

// //                 return;
// //             }

// //             try {
// //                 const userDetailsResponse = await getUserById(userId);

// //                 setUserDetails(userDetailsResponse.data.data.communities);

// //                 const [communityResult, categoryResult] = await Promise.all([
// //                     getAllCommunity(),
// //                     getAllCategory(),
// //                 ]);

// //                 setCommunities(communityResult.data.data);
// //                 setDropdownCategories(categoryResult.data.data);
// //             } catch (error) {
// //                 console.error('Error fetching data:', error);
// //                 setError('Failed to load data. Please try again later.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, [router]);

// //     const handleDeleteCommunity = async (communityId) => {
// //         try {
// //             await deleteCommunity({ id: communityId });
// //             setCommunities((prevCommunities) =>
// //                 prevCommunities.filter((community) => community._id !== communityId)
// //             );
// //             toast.success('Community deleted successfully');
// //         } catch (error) {
// //             console.error('Error deleting community:', error);
// //             toast.error('Failed to delete community. Please try again later.');
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
// //                 <CircularProgress />
// //             </Box>
// //         );
// //     }

// //     return (
// //         <>
// //             <ToastContainer />

// //             <Box display="flex" justifyContent="flex-end" mb={2}>
// //                 <Button variant="contained" onClick={() => setOpen(true)}>
// //                     Add New Community
// //                 </Button>
// //             </Box>
// //             {error && <Typography color="error">{error}</Typography>}
// //             <TableContainer component={Paper}>
// //                 <Table>
// //                     <TableHead>
// //                         <TableRow>
// //                             <TableCell>Community Name</TableCell>
// //                             <TableCell>Image</TableCell>
// //                             <TableCell>Description</TableCell>
// //                             <TableCell>Actions</TableCell>
// //                         </TableRow>
// //                     </TableHead>
// //                     <TableBody>
// //                         {communities.map((community) => (
// //                             <TableRow key={community._id}>
// //                                 <TableCell>{community.name}</TableCell>
// //                                 <TableCell>
// //                                     {community.image && (
// //                                         <img src={community.image} alt={community.name} style={{ width: 50, height: 50 }} />
// //                                     )}
// //                                 </TableCell>
// //                                 <TableCell>{community.description}</TableCell>
// //                                 <TableCell>
// //                                     <IconButton onClick={() => {
// //                                         formik.setValues({
// //                                             name: community.name,
// //                                             description: community.description,
// //                                             selectedCategory: community.category,
// //                                             imagePreview: community.image
// //                                         });
// //                                         setOpen(true);
// //                                     }}>
// //                                         <EditIcon />
// //                                     </IconButton>
// //                                     <IconButton onClick={() => handleDeleteCommunity(community._id)}>
// //                                         <DeleteIcon />
// //                                     </IconButton>
// //                                 </TableCell>
// //                             </TableRow>
// //                         ))}
// //                     </TableBody>
// //                 </Table>
// //             </TableContainer>
// //         </>
// //     );
// // }


// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';

// import { useRouter } from 'next/navigation';

// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     TextField,
//     IconButton,
//     MenuItem,
//     Select,
//     InputLabel,
//     FormControl,
//     Box,
//     CircularProgress,
//     TablePagination
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { getAllCategory, createCommunity, updateCommunity, uploadImage, deleteCommunity, getUserById } from '../../app/api';

// export default function UserTable() {
//     const theme = useTheme();
//     const router = useRouter();
//     const [open, setOpen] = useState(false);
//     const [communities, setCommunities] = useState([]);
//     const [dropdownCategories, setDropdownCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [userDetails, setUserDetails] = useState({});
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [editingCommunity, setEditingCommunity] = useState(null);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [communityToDelete, setCommunityToDelete] = useState(null);
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//     const formik = useFormik({
//         initialValues: {
//             name: '',
//             description: '',
//             image: null,
//             imagePreview: null,
//             selectedCategory: '',
//         },
//         validationSchema: Yup.object({
//             name: Yup.string().required('Community name is required'),
//             description: Yup.string().required('Description is required'),
//             selectedCategory: Yup.string().required('Please select a category'),
//         }),
//         onSubmit: async (values, { resetForm }) => {
//             setLoading(true);

//             try {
//                 let fileUrl = editingCommunity?.image || '';

//                 if (values.image) {
//                     const formData = new FormData();

//                     formData.append('file', values.image);
//                     const uploadResponse = await uploadImage(formData);

//                     fileUrl = uploadResponse.data.data.fileUrl;
//                 }

//                 const payload = {
//                     name: values.name,
//                     description: values.description,
//                     image: fileUrl,
//                     category: values.selectedCategory,
//                 };

//                 if (editingCommunity) {
//                     const updatePayload = { ...payload, community_id: editingCommunity._id };

//                     await updateCommunity(updatePayload);
//                     setCommunities((prevCommunities) =>
//                         prevCommunities.map((community) =>
//                             community._id === editingCommunity._id ? { ...community, ...payload } : community
//                         )
//                     );
//                     toast.success('Community updated successfully');
//                 } else {
//                     const response = await createCommunity(payload);

//                     setCommunities((prevCommunities) => [...prevCommunities, response.data]);
//                     toast.success('Community created successfully');
//                 }

//                 resetForm();
//                 setOpen(false);
//             } catch (error) {
//                 console.error('Error creating/updating community:', error);
//                 toast.error('Failed to create/update community. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             const userId = localStorage.getItem('id');

//             if (!userId) {
//                 router.push('/login');

//                 return;
//             }

//             try {
//                 const userDetailsResponse = await getUserById(userId);

//                 console.log(userDetailsResponse)
//                 const categoryResult = await getAllCategory();

//                 setUserDetails(userDetailsResponse.data);
//                 setCommunities(userDetailsResponse.data.data.communities);
//                 setDropdownCategories(categoryResult.data.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setError('Failed to load data. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [router]);

//     const handleDeleteCommunity = async (communityId) => {
//         try {
//             await deleteCommunity({ id: communityId });
//             setCommunities((prevCommunities) =>
//                 prevCommunities.filter((community) => community._id !== communityId)
//             );
//             toast.success('Community deleted successfully');
//         } catch (error) {
//             console.error('Error deleting community:', error);
//             toast.error('Failed to delete community. Please try again later.');
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setEditingCommunity(null);
//         formik.resetForm();
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];

//         formik.setFieldValue('image', file);
//         const reader = new FileReader();

//         reader.onloadend = () => {
//             formik.setFieldValue('imagePreview', reader.result);
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleEditOpen = (community) => {
//         setEditingCommunity(community);
//         formik.setValues({
//             name: community.name,
//             description: community.description,
//             selectedCategory: community.category,
//             image: null, // reset image to avoid unintentional uploads
//             imagePreview: community.image,
//         });
//         setOpen(true);
//     };

//     const handleOpenDeleteDialog = (community) => {
//         setCommunityToDelete(community);
//         setDeleteDialogOpen(true);
//     };

//     const handleCloseDeleteDialog = () => {
//         setDeleteDialogOpen(false);
//         setCommunityToDelete(null);
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <>
//             <ToastContainer />
//             <Typography variant="h4" gutterBottom>
//                 Welcome {userDetails.name}
//             </Typography>
//             <Box display="flex" justifyContent="flex-end" mb={2}>
//                 <Button variant="contained" onClick={handleClickOpen}>
//                     Add New Community
//                 </Button>
//             </Box>
//             {error && <Typography color="error">{error}</Typography>}
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Community Name</TableCell>
//                             <TableCell>Image</TableCell>
//                             <TableCell>Description</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {communities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((community) => (
//                             <TableRow key={community._id}>
//                                 <TableCell>{community.name}</TableCell>
//                                 <TableCell>
//                                     {community.image && (
//                                         <img src={community.image} alt={community.name} style={{ width: 50, height: 50 }} />
//                                     )}
//                                 </TableCell>
//                                 <TableCell>{community.description}</TableCell>
//                                 <TableCell>
//                                     <IconButton onClick={() => handleEditOpen(community)}>
//                                         <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleOpenDeleteDialog(community)}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={communities.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </TableContainer>
//             <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//                 <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add New Community'}</DialogTitle>
//                 <form onSubmit={formik.handleSubmit}>
//                     <DialogContent>
//                         <TextField
//                             autoFocus
//                             margin="dense"
//                             label="Community Name"
//                             type="text"
//                             fullWidth
//                             name="name"
//                             value={formik.values.name}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.name && Boolean(formik.errors.name)}
//                             helperText={formik.touched.name && formik.errors.name}
//                         />
//                         <TextField
//                             margin="dense"
//                             label="Description"
//                             type="text"
//                             fullWidth
//                             name="description"
//                             value={formik.values.description}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.description && Boolean(formik.errors.description)}
//                             helperText={formik.touched.description && formik.errors.description}
//                         />
//                         <FormControl fullWidth margin="dense">
//                             <InputLabel id="category-select-label">Category</InputLabel>
//                             <Select
//                                 labelId="category-select-label"
//                                 id="category-select"
//                                 name="selectedCategory"
//                                 value={formik.values.selectedCategory || ""}
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
//                             >
//                                 {dropdownCategories.map((category) => (
//                                     <MenuItem key={category._id} value={category._id}>
//                                         {category.name}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <Button
//                             variant="contained"
//                             component="label"
//                             sx={{ mt: 2 }}
//                         >
//                             Choose File
//                             <input
//                                 type="file"
//                                 hidden
//                                 onChange={handleImageChange}
//                             />
//                         </Button>
//                         {formik.values.imagePreview && (
//                             <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
//                                 <img
//                                     src={formik.values.imagePreview}
//                                     alt="Preview"
//                                     style={{ width: 100, height: 100 }}
//                                 />
//                             </Box>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleClose}>Cancel</Button>
//                         <Button type="submit" variant="contained" color="primary">
//                             {editingCommunity ? 'Update' : 'Save'}
//                         </Button>
//                     </DialogActions>
//                 </form>
//             </Dialog>
//             <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
//                 <DialogTitle>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                     <Typography>Are you sure you want to delete this community?</Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
//                     <Button onClick={() => handleDeleteCommunity(communityToDelete._id)} color="secondary">Delete</Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }




'use client';

import React, { useEffect, useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    CircularProgress,
    TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAllCategory, createCommunity, updateCommunity, uploadImage, deleteCommunity, getUserById } from '../../app/api';

export default function UserTable() {
    const theme = useTheme();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [dropdownCategories, setDropdownCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingCommunity, setEditingCommunity] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [communityToDelete, setCommunityToDelete] = useState(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const formik = useFormik({
      initialValues: {
        name: '',
        description: '',
        image: null,
        imagePreview: null,
        selectedCategory: ''
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Community name is required'),
        description: Yup.string().required('Description is required'),
        selectedCategory: Yup.string().required('Please select a category')
      }),
      onSubmit: async (values, { resetForm }) => {
        setLoading(true)

        try {
          let fileUrl = editingCommunity?.image || ''

          if (values.image) {
            const formData = new FormData()

            formData.append('file', values.image)
            const uploadResponse = await uploadImage(formData)

            fileUrl = uploadResponse?.data?.data?.fileUrl
          }

          const payload = {
            name: values.name,
            description: values.description,
            image: fileUrl,
            category: values.selectedCategory
          }

          if (editingCommunity) {
            console.log(editingCommunity)

            const updatePayload = {
              ...payload,
              community_id: editingCommunity._id,
              community_id: editingCommunity.created_by
            }

            await updateCommunity(updatePayload)
            setCommunities(prevCommunities =>
              prevCommunities.map(community =>
                community._id === editingCommunity._id ? { ...community, ...payload } : community
              )
            )
            toast.success('Community updated successfully')
          } else {
            const response = await createCommunity(payload)

            setCommunities(prevCommunities => [...prevCommunities, response.data])
            toast.success('Community created successfully')
          }

          resetForm()
          setOpen(false)
        } catch (error) {
          console.error('Error creating/updating community:', error)
          toast.error('Failed to create/update community. Please try again later.')
        } finally {
          setLoading(false)
        }
      }
    })

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        const userId = localStorage.getItem('id')

        if (!userId) {
          router.push('/login')

          return
        }

        try {
          const userDetailsResponse = await getUserById(userId)

          console.log(userDetailsResponse)
          const categoryResult = await getAllCategory()

          setUserDetails(userDetailsResponse?.data)
          setCommunities(userDetailsResponse?.data?.data[0].communities || [])
          setDropdownCategories(categoryResult?.data.data)
        } catch (error) {
          console.error('Error fetching data:', error)
          setError('Failed to load data. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }, [router])

    const handleDeleteCommunity = async (communityId) => {
        try {
            await deleteCommunity({ id: communityId });
            setCommunities((prevCommunities) =>
                prevCommunities.filter((community) => community._id !== communityId)
            );
            toast.success('Community deleted successfully');
        } catch (error) {
            console.error('Error deleting community:', error);
            toast.error('Failed to delete community. Please try again later.');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCommunity(null);
        formik.resetForm();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        formik.setFieldValue('image', file);
        const reader = new FileReader();

        reader.onloadend = () => {
            formik.setFieldValue('imagePreview', reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleEditOpen = (community) => {
        setEditingCommunity(community);
        formik.setValues({
            name: community.name,
            description: community.description,
            selectedCategory: community.category,
            image: null, // reset image to avoid unintentional uploads
            imagePreview: community.image,
        });
        setOpen(true);
    };

    const handleOpenDeleteDialog = (community) => {
        setCommunityToDelete(community);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCommunityToDelete(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <ToastContainer />
            <Typography variant="h4" gutterBottom>
                Welcome {userDetails.name}
            </Typography>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                {/* <Button variant="contained" onClick={handleClickOpen}>
                    Add New Community
                </Button> */}
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Community Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Description</TableCell>
                            {/* <TableCell>Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {communities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((community) => (
                            <TableRow key={community._id}>
                                <TableCell>{community.name}</TableCell>
                                <TableCell>
                                    {community.image && (
                                        <img src={community.image} alt={community.name} style={{ width: 50, height: 50 }} />
                                    )}
                                </TableCell>
                                <TableCell>{community.description}</TableCell>
                                {/* <TableCell>
                                    <IconButton onClick={() => handleEditOpen(community)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDeleteDialog(community)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={communities.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add New Community'}</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Community Name"
                            type="text"
                            fullWidth
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                name="selectedCategory"
                                value={formik.values.selectedCategory || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
                            >
                                {dropdownCategories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2 }}
                        >
                            Choose File
                            <input
                                type="file"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                        {formik.values.imagePreview && (
                            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                                <img
                                    src={formik.values.imagePreview}
                                    alt="Preview"
                                    style={{ width: 100, height: 100 }}
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingCommunity ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this community?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
                    <Button onClick={() => handleDeleteCommunity(communityToDelete.created_by)} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
