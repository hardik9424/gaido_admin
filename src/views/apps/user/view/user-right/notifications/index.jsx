// // // 'use client'

// // // // MUI Imports
// // // import Card from '@mui/material/Card'
// // // import CardHeader from '@mui/material/CardHeader'
// // // import CardActions from '@mui/material/CardActions'
// // // import Typography from '@mui/material/Typography'
// // // import Checkbox from '@mui/material/Checkbox'
// // // import Button from '@mui/material/Button'

// // // // Style Imports
// // // import tableStyles from '@core/styles/table.module.css'

// // // // Vars
// // // const tableData = [
// // //   {
// // //     app: false,
// // //     email: true,
// // //     browser: false,
// // //     type: 'New for you'
// // //   },
// // //   {
// // //     app: true,
// // //     email: false,
// // //     browser: true,
// // //     type: 'Account activity'
// // //   },
// // //   {
// // //     app: true,
// // //     email: true,
// // //     browser: true,
// // //     type: 'A new browser used to sign in'
// // //   },
// // //   {
// // //     app: false,
// // //     email: false,
// // //     browser: true,
// // //     type: 'A new device is linked'
// // //   }
// // // ]

// // // const NotificationsTab = () => {
// // //   return (
// // //     <Card>
// // //       <CardHeader title='Notifications' subheader='You will receive notification for the below selected items' />
// // //       <div className='overflow-x-auto'>
// // //         <table className={tableStyles.table}>
// // //           <thead>
// // //             <tr>
// // //               <th>Type</th>
// // //               <th>App</th>
// // //               <th>Email</th>
// // //               <th>Browser</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className='border-be'>
// // //             {tableData.map((data, index) => (
// // //               <tr key={index}>
// // //                 <td>
// // //                   <Typography color='text.primary'>{data.type}</Typography>
// // //                 </td>
// // //                 <td>
// // //                   <Checkbox defaultChecked={data.app} />
// // //                 </td>
// // //                 <td>
// // //                   <Checkbox defaultChecked={data.email} />
// // //                 </td>
// // //                 <td>
// // //                   <Checkbox defaultChecked={data.browser} />
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //       <CardActions className='flex items-center gap-2'>
// // //         <Button variant='contained' type='submit'>
// // //           Save Changes
// // //         </Button>
// // //         <Button variant='tonal' color='secondary' type='reset'>
// // //           Discard
// // //         </Button>
// // //       </CardActions>
// // //     </Card>
// // //   )
// // // }

// // // export default NotificationsTab

// // 'use client';
// // import React, { useEffect, useState, useCallback } from 'react';

// // import {
// //   Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions,
// //   DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Paper, CircularProgress, IconButton, TablePagination
// // } from '@mui/material';
// // import { Add, Edit, Delete } from '@mui/icons-material';

// // import { ToastContainer, toast } from 'react-toastify';

// // import { getAllCommunity, createPost, uploadImage, getAllPost, getUserById } from '@/app/api';
// // import 'react-toastify/dist/ReactToastify.css';

// // const NotificationsTab = () => {
// //   const [open, setOpen] = useState(false);
// //   const [posts, setPosts] = useState([]);
// //   const [newPost, setNewPost] = useState({ name: '', image: '', community: '' });
// //   const [imageName, setImageName] = useState('');
// //   const [communities, setCommunities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [imageUrl, setImageUrl] = useState('');
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   useEffect(() => {
// //     async function fetchData() {
// //       try {
// //         const userId = localStorage.getItem('id');

// //         // const [communityResponse, postResponse] = await Promise.all([
// //         //   getAllCommunity(),
// //         //   getAllPost()
// //         // ]);
// //         const postResponse =await getUserById(userId);

// //         setCommunities(postResponse.data.data);

// //         setPosts(postResponse.data.posts);
// //       } catch (error) {
// //         console.error('Failed to fetch data:', error);
// //         toast.error('Failed to fetch data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, []);

// //   const handleOpen = useCallback(() => setOpen(true), []);

// //   const handleClose = useCallback(() => {
// //     setOpen(false);
// //     setNewPost({ name: '', image: '', community: '' });
// //     setImageName('');
// //     setImageUrl('');
// //   }, []);

// //   const handleChange = useCallback((e) => {
// //     const { name, value } = e.target;

// //     setNewPost((prev) => ({ ...prev, [name]: value }));
// //   }, []);

// //   const handleSubmit = useCallback(async () => {
// //     setSubmitting(true);

// //     try {
// //       const payload = {
// //         community_id: newPost.community,
// //         thought: newPost.name,
// //         media: imageUrl
// //       };

// //       await createPost(payload);
// //       setPosts((prev) => [...prev, { ...newPost, image: imageUrl }]);
// //       toast.success('Post created successfully');
// //       handleClose();
// //     } catch (error) {
// //       console.error('Error creating post:', error);
// //       toast.error('Error creating post');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }, [newPost, imageUrl, handleClose]);

// //   const handleImageChange = async (e) => {
// //     const file = e.target.files[0];

// //     if (file) {
// //       const formData = new FormData();

// //       formData.append('file', file);

// //       try {
// //         const uploadResponse = await uploadImage(formData);
// //         const imageUrl = uploadResponse.data.data.fileUrl;

// //         setNewPost((prev) => ({ ...prev, image: imageUrl }));
// //         setImageName(file.name);
// //         setImageUrl(imageUrl);
// //       } catch (error) {
// //         console.error('Error uploading image:', error);
// //         toast.error('Error uploading image');
// //       }
// //     }
// //   };

// //   const handleEdit = (post) => {
// //     setNewPost({ name: post.thought, image: post.media, community: post.community_id });
// //     setImageName(post.media.split('/').pop());
// //     setImageUrl(post.media);
// //     setOpen(true);
// //   };

// //   const handleDelete = async (postId) => {
// //     try {
// //       // Implement delete functionality
// //       setPosts(posts.filter((post) => post._id !== postId));
// //       toast.success('Post deleted successfully');
// //     } catch (error) {
// //       console.error('Error deleting post:', error);
// //       toast.error('Error deleting post');
// //     }
// //   };

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" height="300px">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto' }}>
// //       <ToastContainer />
// //       {/* <FormControl variant="outlined" fullWidth margin="normal">
// //         <InputLabel sx={{ paddingLeft: 0, paddingBottom: 1 }}>Community</InputLabel>
// //         <Select
// //           name="community"
// //           value={newPost.community}
// //           onChange={handleChange}
// //           label="Community"
// //         >
// //           {communities.map((community) => (
// //             <MenuItem key={community._id} value={community._id}>
// //               {community.name}
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl> */}
// //       {/* <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
// //         Add New Post
// //       </Button> */}
// //       <Paper sx={{ mt: 4, p: 2 }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
// //               <TableCell sx={{ fontWeight: 'bold' }}>Post Name</TableCell>

// //               {/* <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> */}
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {posts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post, index) => (
// //               <TableRow key={index}>
// //                 <TableCell> <img src={post.media} alt={post.name} width="100" height="100" /></TableCell>
// //                 <TableCell>
// //                   {post.thought}
// //                 </TableCell>
// //                 {/* <TableCell>
// //                   <Box display="flex" justifyContent="flex-start">
// //                     <IconButton onClick={() => handleEdit(post)}>
// //                       <Edit />
// //                     </IconButton>
// //                     <IconButton onClick={() => handleDelete(post._id)}>
// //                       <Delete />
// //                     </IconButton>
// //                   </Box>
// //                 </TableCell> */}
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //         <TablePagination
// //           component="div"
// //           count={posts.length}
// //           page={page}
// //           onPageChange={handleChangePage}
// //           rowsPerPage={rowsPerPage}
// //           onRowsPerPageChange={handleChangeRowsPerPage}
// //         />
// //       </Paper>
// //       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
// //         <DialogTitle>Add New Post</DialogTitle>
// //         <DialogContent dividers>
// //           <TextField
// //             autoFocus
// //             margin="dense"
// //             label="Post Name"
// //             type="text"
// //             fullWidth
// //             name="name"
// //             value={newPost.name}
// //             onChange={handleChange}
// //             variant="outlined"
// //           />
// //           <InputLabel style={{ marginTop: 12 }}>Upload Image</InputLabel>
// //           {imageUrl && (
// //             <Box mt={2} display="flex" justifyContent="center">
// //               <img
// //                 src={imageUrl}
// //                 alt="Preview"
// //                 style={{ width: 100, height: 100, borderRadius: '8px' }}
// //               />
// //             </Box>
// //           )}
// //           {imageName && (
// //             <Box mt={1}>
// //               <Typography variant="body2">Selected file: {imageName}</Typography>
// //             </Box>
// //           )}
// //           <Button
// //             variant="contained"
// //             component="label"
// //             color="primary"
// //             style={{ marginTop: 10 }}
// //           >
// //             Choose File
// //             <input
// //               accept="image/*"
// //               type="file"
// //               onChange={handleImageChange}
// //               hidden
// //             />
// //           </Button>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleClose} variant="contained" sx={{ color: 'white', '&:hover': { backgroundColor: 'red' } }}>
// //             Cancel
// //           </Button>
// //           <Button
// //             variant="contained"
// //             sx={{ color: 'white', '&:hover': { backgroundColor: 'green' } }}
// //             onClick={handleSubmit}
// //             disabled={submitting}
// //           >
// //             {submitting ? <CircularProgress size={24} /> : 'Add Post'}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box >
// //   );
// // };

// // export default NotificationsTab

// //-----------------------------------------------

// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';

// import {
//   Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions,
//   DialogContent, DialogTitle, TextField, Box, Typography, Paper, CircularProgress, TablePagination, Alert
// } from '@mui/material';

// import { ToastContainer, toast } from 'react-toastify';

// import 'react-toastify/dist/ReactToastify.css';
// // import { getUserById, createPost, uploadImage } from '@/app/api';

// const UserPosts = () => {
//   const [open, setOpen] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState({ name: '', image: '', community: '' });
//   const [imageName, setImageName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const userId = localStorage.getItem('id');
//         // const userResponse = await getUserById(userId);

//         if (userResponse.data && userResponse.data.posts) {
//           setPosts(userResponse.data.posts);
//         }
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//         toast.error('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   const handleOpen = useCallback(() => setOpen(true), []);

//   const handleClose = useCallback(() => {
//     setOpen(false);
//     setNewPost({ name: '', image: '', community: '' });
//     setImageName('');
//     setImageUrl('');
//   }, []);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;

//     setNewPost((prev) => ({ ...prev, [name]: value }));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     setSubmitting(true);

//     try {
//       const payload = {
//         community_id: newPost.community,
//         thought: newPost.name,
//         media: imageUrl
//       };

//       await createPost(payload);

//       setPosts((prev) => [...prev, { ...newPost, image: imageUrl }]);
//       toast.success('Post created successfully');
//       handleClose();
//     } catch (error) {
//       console.error('Error creating post:', error);
//       toast.error('Error creating post');
//     } finally {
//       setSubmitting(false);
//     }
//   }, [newPost, imageUrl, handleClose]);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];

//     if (file) {

//       const formData = new FormData();

//       formData.append('file', file);

//       try {
//         // const uploadResponse = await uploadImage(formData);
//         const imageUrl = uploadResponse.data.data.fileUrl;

//         setNewPost((prev) => ({ ...prev, image: imageUrl }));
//         setImageName(file.name);
//         setImageUrl(imageUrl);
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         toast.error('Error uploading image');
//       }
//     }
//   };

//   const handleEdit = (post) => {
//     setNewPost({ name: post.thought, image: post.media, community: post.community_id });
//     setImageName(post.media.split('/').pop());
//     setImageUrl(post.media);
//     setOpen(true);
//   };

//   const handleDelete = async (postId) => {
//     try {
//       setPosts(posts.filter((post) => post._id !== postId));
//       toast.success('Post deleted successfully');
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       toast.error('Error deleting post');
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="300px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto' }}>
//       <ToastContainer />
//       <Paper sx={{ mt: 4, p: 2 }}>
//         {posts.length === 0 ? (
//           <Alert severity="info" sx={{ textAlign: 'center', marginY: 3 }}>
//             No posts available for this user.
//           </Alert>
//         ) : (
//           <>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Post Name</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <img src={post.media} alt={post.name} width="100" height="100" />
//                     </TableCell>
//                     <TableCell>
//                       {post.thought}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <TablePagination
//               component="div"
//               count={posts.length}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </>
//         )}
//       </Paper>
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Add New Post</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Post Name"
//             type="text"
//             fullWidth
//             name="name"
//             value={newPost.name}
//             onChange={handleChange}
//             variant="outlined"
//           />
//           {/* <InputLabel style={{ marginTop: 12 }}>Upload Image</InputLabel> */}
//           {imageUrl && (
//             <Box mt={2} display="flex" justifyContent="center">
//               <img
//                 src={imageUrl}
//                 alt="Preview"
//                 style={{ width: 100, height: 100, borderRadius: '8px' }}
//               />
//             </Box>
//           )}
//           {imageName && (
//             <Box mt={1}>
//               <Typography variant="body2">Selected file: {imageName}</Typography>
//             </Box>
//           )}
//           <Button
//             variant="contained"
//             component="label"
//             color="primary"
//             style={{ marginTop: 10 }}
//           >
//             Choose File
//             <input
//               accept="image/*"
//               type="file"
//               onChange={handleImageChange}
//               hidden
//             />
//           </Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} variant="contained" sx={{ color: 'white', '&:hover': { backgroundColor: 'red' } }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ color: 'white', '&:hover': { backgroundColor: 'green' } }}
//             onClick={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? <CircularProgress size={24} /> : 'Add Post'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default UserPosts;

const UserPosts = () => {
  return <></>
}

export default UserPosts
