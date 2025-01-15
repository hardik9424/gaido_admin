// // // // // MUI Imports
// // // // import Grid from '@mui/material/Grid'

// // // // // Component Imports
// // // // import ChangePassword from './ChangePassword'
// // // // import TwoStepVerification from './TwoStepVerification'
// // // // import RecentDevice from './RecentDevice'

// // // // const SecurityTab = () => {
// // // //   return (
// // // //     <>

// // // //     </>

// // // //   )
// // // // }

// // // // export default SecurityTab



// // // 'use client';

// // // import React, { useState, useEffect, useMemo } from 'react';

// // // // MUI Imports
// // // import {
// // //   Box,
// // //   Card,
// // //   CardHeader,
// // //   MenuItem,
// // //   TablePagination,
// // //   Typography,
// // //   CircularProgress,
// // //   TableContainer,
// // //   Table,
// // //   TableHead,
// // //   TableRow,
// // //   TableCell,
// // //   TableBody,
// // // } from '@mui/material';
// // // import { useTheme } from '@mui/material/styles';

// // // // Third-party Imports
// // // import classnames from 'classnames';
// // // import { rankItem } from '@tanstack/match-sorter-utils';
// // // import {
// // //   createColumnHelper,
// // //   flexRender,
// // //   getCoreRowModel,
// // //   useReactTable,
// // //   getFilteredRowModel,
// // //   getFacetedRowModel,
// // //   getFacetedUniqueValues,
// // //   getFacetedMinMaxValues,
// // //   getPaginationRowModel,
// // //   getSortedRowModel,
// // // } from '@tanstack/react-table';

// // // // Custom Imports
// // // import CustomAvatar from '@core/components/mui/Avatar';
// // // import CustomTextField from '@core/components/mui/TextField';
// // // import TablePaginationComponent from '@components/TablePaginationComponent';
// // // import tableStyles from '@core/styles/table.module.css';
// // // import { getAllSubCategory } from '@/app/api/subcategory/getAllSubCategory';

// // // // Fuzzy Filter Function
// // // const fuzzyFilter = (row, columnId, value, addMeta) => {
// // //   const itemRank = rankItem(row.getValue(columnId), value);

// // //   addMeta({ itemRank });

// // //   return itemRank.passed;
// // // };

// // // // Debounced Input Component
// // // const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
// // //   const [value, setValue] = useState(initialValue);

// // //   useEffect(() => {
// // //     setValue(initialValue);
// // //   }, [initialValue]);

// // //   useEffect(() => {
// // //     const timeout = setTimeout(() => {
// // //       onChange(value);
// // //     }, debounce);

// // //     return () => clearTimeout(timeout);
// // //   }, [value, onChange, debounce]);

// // //   return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
// // // };

// // // // Column Definitions
// // // const columnHelper = createColumnHelper();

// // // const SecurityTab = () => {
// // //   const theme = useTheme();
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [data, setData] = useState([]);
// // //   const [globalFilter, setGlobalFilter] = useState('');
// // //   const [loading, setLoading] = useState(true);

// // //   // Fetch Data from API
// // //   useEffect(() => {
// // //     const fetchSubCategories = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');
// // //         const response = await getAllSubCategory(token);

// // //         console.log(response)

// // //         const formattedData = response.data.map((subcategory) => ({
// // //           name: subcategory.name,
// // //           image: subcategory.image,
// // //         }));

// // //         setData(formattedData);
// // //       } catch (error) {
// // //         console.error('Error fetching subcategories:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchSubCategories();
// // //   }, []);

// // //   // Define Columns
// // //   const columns = useMemo(
// // //     () => [
// // //       columnHelper.accessor('name', {
// // //         header: 'Name',
// // //         cell: ({ row }) => (
// // //           <div className='flex items-center gap-4'>
// // //             <div className='flex flex-col'>
// // //               <Typography className='font-medium' color='text.primary'>
// // //                 {row.original.name}
// // //               </Typography>
// // //             </div>
// // //           </div>
// // //         ),
// // //       }),
// // //       columnHelper.accessor('image', {
// // //         header: 'Image',
// // //         cell: ({ row }) => (
// // //           <div className='flex items-center gap-4'>
// // //             <img src={row.original.image} alt={row.original.name} width={50} height={50} />
// // //           </div>
// // //         ),
// // //       }),
// // //     ],
// // //     []
// // //   );

// // //   // Use React Table Hook
// // //   const table = useReactTable({
// // //     data,
// // //     columns,
// // //     filterFns: { fuzzy: fuzzyFilter },
// // //     state: { rowSelection, globalFilter },
// // //     initialState: { pagination: { pageSize: 7 } },
// // //     enableRowSelection: true,
// // //     globalFilterFn: fuzzyFilter,
// // //     onRowSelectionChange: setRowSelection,
// // //     getCoreRowModel: getCoreRowModel(),
// // //     onGlobalFilterChange: setGlobalFilter,
// // //     getFilteredRowModel: getFilteredRowModel(),
// // //     getSortedRowModel: getSortedRowModel(),
// // //     getPaginationRowModel: getPaginationRowModel(),
// // //     getFacetedRowModel: getFacetedRowModel(),
// // //     getFacetedUniqueValues: getFacetedUniqueValues(),
// // //     getFacetedMinMaxValues: getFacetedMinMaxValues(),
// // //   });

// // //   return (
// // //     <Card>
// // //       <CardHeader title="Subcategories" className='flex flex-wrap gap-4' />
// // //       <div className='flex items-center justify-between p-6 gap-4'>
// // //         <div className='flex items-center gap-2'>
// // //           <Typography>Show</Typography>
// // //           <CustomTextField
// // //             select
// // //             value={table.getState().pagination.pageSize}
// // //             onChange={(e) => table.setPageSize(Number(e.target.value))}
// // //             className='is-[70px]'
// // //           >
// // //             <MenuItem value='5'>5</MenuItem>
// // //             <MenuItem value='7'>7</MenuItem>
// // //             <MenuItem value='10'>10</MenuItem>
// // //           </CustomTextField>
// // //         </div>
// // //         <DebouncedInput
// // //           value={globalFilter ?? ''}
// // //           onChange={(value) => setGlobalFilter(String(value))}
// // //           placeholder='Search Subcategory'
// // //         />
// // //       </div>
// // //       <div className='overflow-x-auto'>
// // //         {loading ? (
// // //           <Box display="flex" justifyContent="center" alignItems="center" height="300px">
// // //             <CircularProgress />
// // //           </Box>
// // //         ) : (
// // //           <table className={tableStyles.table}>
// // //             <thead>
// // //               {table.getHeaderGroups().map((headerGroup) => (
// // //                 <tr key={headerGroup.id}>
// // //                   {headerGroup.headers.map((header) => (
// // //                     <th key={header.id}>
// // //                       {header.isPlaceholder ? null : (
// // //                         <div
// // //                           className={classnames({
// // //                             'flex items-center': header.column.getIsSorted(),
// // //                             'cursor-pointer select-none': header.column.getCanSort(),
// // //                           })}
// // //                           onClick={header.column.getToggleSortingHandler()}
// // //                         >
// // //                           {flexRender(header.column.columnDef.header, header.getContext())}
// // //                           {{
// // //                             asc: <i className='tabler-chevron-up text-xl' />,
// // //                             desc: <i className='tabler-chevron-down text-xl' />,
// // //                           }[header.column.getIsSorted()] ?? null}
// // //                         </div>
// // //                       )}
// // //                     </th>
// // //                   ))}
// // //                 </tr>
// // //               ))}
// // //             </thead>
// // //             {table.getFilteredRowModel().rows.length === 0 ? (
// // //               <tbody>
// // //                 <tr>
// // //                   <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
// // //                     No data available
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             ) : (
// // //               <tbody>
// // //                 {table
// // //                   .getRowModel()
// // //                   .rows.slice(0, table.getState().pagination.pageSize)
// // //                   .map((row) => (
// // //                     <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
// // //                       {row.getVisibleCells().map((cell) => (
// // //                         <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
// // //                       ))}
// // //                     </tr>
// // //                   ))}
// // //               </tbody>
// // //             )}
// // //           </table>
// // //         )}
// // //       </div>
// // //       <TablePagination
// // //         component={() => <TablePaginationComponent table={table} />}
// // //         count={table.getFilteredRowModel().rows.length}
// // //         rowsPerPage={table.getState().pagination.pageSize}
// // //         page={table.getState().pagination.pageIndex}
// // //         onPageChange={(_, page) => {
// // //           table.setPageIndex(page);
// // //         }}
// // //       />
// // //     </Card>
// // //   );
// // // };

// // // export default SecurityTab;



// // 'use client';

// // import React, { useState, useEffect, useMemo } from 'react';

// // import { useRouter } from 'next/navigation';

// // // MUI Imports
// // import {
// //   Box,
// //   Card,
// //   CardHeader,
// //   MenuItem,
// //   TablePagination,
// //   Typography,
// //   CircularProgress,
// //   TableContainer,
// //   Table,
// //   TableHead,
// //   TableRow,
// //   TableCell,
// //   TableBody,
// //   Button,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   TextField,
// //   IconButton
// // } from '@mui/material';
// // import { useTheme } from '@mui/material/styles';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import EditIcon from '@mui/icons-material/Edit';

// // // Third-party Imports
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';

// // // Component Imports
// // import { ToastContainer, toast } from 'react-toastify';

// // import CustomAvatar from '@core/components/mui/Avatar';
// // import CustomTextField from '@core/components/mui/TextField';
// // import 'react-toastify/dist/ReactToastify.css';

// // // API Imports
// // import { getUserById, updateSubCategory, uploadImage, deleteCategory } from '@/app/api';

// // // Style Imports
// // import tableStyles from '@core/styles/table.module.css';

// // // Debounced Input Component
// // const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
// //   const [value, setValue] = useState(initialValue);

// //   useEffect(() => {
// //     setValue(initialValue);
// //   }, [initialValue]);

// //   useEffect(() => {
// //     const timeout = setTimeout(() => {
// //       onChange(value);
// //     }, debounce);

// //     return () => clearTimeout(timeout);
// //   }, [value, onChange, debounce]);

// //   return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
// // };

// // const SecurityTab = () => {
// //   const router = useRouter();
// //   const theme = useTheme();
// //   const [data, setData] = useState([]);
// //   const [globalFilter, setGlobalFilter] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [open, setOpen] = useState(false);
// //   const [editingSubCategory, setEditingSubCategory] = useState(null);
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       const userId = localStorage.getItem('id');

// //       if (!userId) {
// //         router.push('/login');

// //         return;
// //       }

// //       try {
// //         const userDetailsResponse = await getUserById(userId);

// //         if (userDetailsResponse) {
// //           const formattedData = userDetailsResponse.data.data[0].subcategories.map((subcategory) => ({
// //             id: subcategory._id,
// //             name: subcategory.name,
// //             image: subcategory.image,
// //             categoryId: userDetailsResponse.data.data[0]._id, // assuming each subcategory belongs to a single category
// //           }));

// //           setData(formattedData);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         toast.error('Failed to load data. Please try again later.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [router]);

// //   const handleEditOpen = (subcategory) => {
// //     setEditingSubCategory(subcategory);
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //     setEditingSubCategory(null);
// //   };

// //   const handleDeleteSubCategory = async (subcategoryId) => {
// //     try {
// //       await deleteCategory({ id: subcategoryId }); // Assuming this is the correct delete API
// //       setData((prevData) => prevData.filter((subcategory) => subcategory.id !== subcategoryId));
// //       toast.success('Subcategory deleted successfully');
// //     } catch (error) {
// //       console.error('Error deleting subcategory:', error);
// //       toast.error('Failed to delete subcategory. Please try again later.');
// //     }
// //   };

// //   const formik = useFormik({
// //     initialValues: {
// //       name: '',
// //       image: null,
// //       imagePreview: null,
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required('Subcategory name is required'),
// //       image: Yup.mixed().required('Image is required'),
// //     }),
// //     onSubmit: async (values, { resetForm }) => {
// //       setLoading(true);
// //       console.log(values)

// //       try {
// //         let imageUrl = editingSubCategory.image;

// //         if (values.image && values.image instanceof File) {
// //           const formData = new FormData();

// //           formData.append('file', values.image);
// //           const uploadResponse = await uploadImage(formData);

// //           imageUrl = uploadResponse.data.data.fileUrl;
// //         }

// //         const payload = {
// //           category_id: editingSubCategory.categoryId,
// //           subcategory_id: editingSubCategory.id,
// //           name: values.name,
// //           image: imageUrl,
// //         };

// //         const result = await updateSubCategory(payload);

// //         console.log(result)
// //         setData((prevData) =>
// //           prevData.map((subcategory) =>
// //             subcategory.id === editingSubCategory.id ? { ...subcategory, name: values.name, image: imageUrl } : subcategory
// //           )
// //         );
// //         toast.success('Subcategory updated successfully');
// //         resetForm();
// //         handleClose();
// //       } catch (error) {
// //         console.error('Error updating subcategory:', error);
// //         toast.error('Failed to update subcategory. Please try again later.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     },
// //   });

// //   useEffect(() => {
// //     if (editingSubCategory) {
// //       formik.setValues({
// //         name: editingSubCategory.name,
// //         image: null,
// //         imagePreview: editingSubCategory.image,
// //       });
// //     }
// //   }, [editingSubCategory]);

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

// //   const columns = useMemo(
// //     () => [
// //       {
// //         accessorKey: 'name',
// //         header: 'Name',
// //         cell: ({ row }) => (
// //           <div className="flex items-center gap-4">
// //             <div className="flex flex-col">
// //               <Typography className="font-medium" color="text.primary">
// //                 {row.original.name}
// //               </Typography>
// //             </div>
// //           </div>
// //         ),
// //       },
// //       {
// //         accessorKey: 'image',
// //         header: 'Image',
// //         cell: ({ row }) => (
// //           <div className="flex items-center gap-4">
// //             <img src={row.original.image} alt={row.original.name} width={50} height={50} />
// //           </div>
// //         ),
// //       },
// //       {
// //         id: 'actions',
// //         header: 'Actions',
// //         cell: ({ row }) => (
// //           <div className="flex items-center gap-2">
// //             <IconButton onClick={() => handleEditOpen(row.original)}>
// //               <EditIcon />
// //             </IconButton>
// //             <IconButton onClick={() => handleDeleteSubCategory(row.original.id)}>
// //               <DeleteIcon />
// //             </IconButton>
// //           </div>
// //         ),
// //       },
// //     ],
// //     []
// //   );

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Card>
// //       <ToastContainer />
// //       <CardHeader title="Subcategories" className="flex flex-wrap gap-4" />
// //       <div className="flex items-center justify-between p-6 gap-4">
// //         <div className="flex items-center gap-2">
// //           <Typography>Show</Typography>
// //           <CustomTextField
// //             select
// //             value={rowsPerPage}
// //             onChange={(e) => setRowsPerPage(Number(e.target.value))}
// //             className="is-[70px]"
// //           >
// //             <MenuItem value={5}>5</MenuItem>
// //             <MenuItem value={7}>7</MenuItem>
// //             <MenuItem value={10}>10</MenuItem>
// //           </CustomTextField>
// //         </div>
// //         <DebouncedInput
// //           value={globalFilter ?? ''}
// //           onChange={(value) => setGlobalFilter(String(value))}
// //           placeholder="Search Subcategory"
// //         />
// //       </div>
// //       <TableContainer component={Box} className="overflow-x-auto">
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Name</TableCell>
// //               <TableCell>Image</TableCell>
// //               <TableCell>Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {data
// //               .filter((subcategory) => subcategory.name.toLowerCase().includes(globalFilter.toLowerCase()))
// //               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //               .map((subcategory) => (
// //                 <TableRow key={subcategory.id}>
// //                   <TableCell>
// //                     <div className="flex items-center gap-4">
// //                       <CustomAvatar src={subcategory.image} size={34} />
// //                       <div className="flex flex-col">
// //                         <Typography className="font-medium" color="text.primary">
// //                           {subcategory.name}
// //                         </Typography>
// //                       </div>
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     <img src={subcategory.image} alt={subcategory.name} width={50} height={50} />
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center gap-2">
// //                       <IconButton onClick={() => handleEditOpen(subcategory)}>
// //                         <EditIcon />
// //                       </IconButton>
// //                       <IconButton onClick={() => handleDeleteSubCategory(subcategory.id)}>
// //                         <DeleteIcon />
// //                       </IconButton>
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //       <TablePagination
// //         rowsPerPageOptions={[5, 10, 25]}
// //         component="div"
// //         count={data.length}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={(_, newPage) => {
// //           setPage(newPage);
// //         }}
// //         onRowsPerPageChange={(event) => {
// //           setRowsPerPage(parseInt(event.target.value, 10));
// //           setPage(0);
// //         }}
// //       />
// //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// //         <DialogTitle>{editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
// //         <form onSubmit={formik.handleSubmit}>
// //           <DialogContent>
// //             <TextField
// //               autoFocus
// //               margin="dense"
// //               label="Subcategory Name"
// //               type="text"
// //               fullWidth
// //               name="name"
// //               value={formik.values.name}
// //               onChange={formik.handleChange}
// //               onBlur={formik.handleBlur}
// //               error={formik.touched.name && Boolean(formik.errors.name)}
// //               helperText={formik.touched.name && formik.errors.name}
// //             />
// //             <Button
// //               variant="contained"
// //               component="label"
// //               sx={{ mt: 2 }}
// //             >
// //               Choose File
// //               <input
// //                 type="file"
// //                 hidden
// //                 onChange={handleImageChange}
// //               />
// //             </Button>
// //             {formik.values.imagePreview && (
// //               <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
// //                 <img
// //                   src={formik.values.imagePreview}
// //                   alt="Preview"
// //                   style={{ width: 100, height: 100 }}
// //                 />
// //               </Box>
// //             )}
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleClose}>Cancel</Button>
// //             <Button type="submit" variant="contained" color="primary">
// //               {editingSubCategory ? 'Update' : 'Save'}
// //             </Button>
// //           </DialogActions>
// //         </form>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default SecurityTab;



// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';

// import { useRouter } from 'next/navigation';

// // MUI Imports
// import {
//   Box,
//   Card,
//   CardHeader,
//   MenuItem,
//   TablePagination,
//   Typography,
//   CircularProgress,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   IconButton
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';

// // Third-party Imports
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// // Component Imports
// import { ToastContainer, toast } from 'react-toastify';

// import CustomAvatar from '@core/components/mui/Avatar';
// import CustomTextField from '@core/components/mui/TextField';
// import 'react-toastify/dist/ReactToastify.css';

// // API Imports
// import { getUserById, updateSubCategory, uploadImage, deleteCategory } from '@/app/api';

// // Style Imports
// import tableStyles from '@core/styles/table.module.css';

// // Debounced Input Component
// const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value);
//     }, debounce);

//     return () => clearTimeout(timeout);
//   }, [value, onChange, debounce]);

//   return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
// };

// const SecurityTab = () => {
//   const router = useRouter();
//   const theme = useTheme();
//   const [data, setData] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [editingSubCategory, setEditingSubCategory] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const userId = localStorage.getItem('id');

//       if (!userId) {
//         router.push('/login');

//         return;
//       }

//       try {
//         const userDetailsResponse = await getUserById(userId);

//         if (userDetailsResponse) {
//           const formattedData = userDetailsResponse.data.data[0].subcategories.map((subcategory) => ({
//             id: subcategory._id,
//             name: subcategory.name,
//             image: subcategory.image,
//             categoryId: userDetailsResponse.data.data[0]._id, // assuming each subcategory belongs to a single category
//           }));

//           setData(formattedData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   const handleEditOpen = (subcategory) => {
//     setEditingSubCategory(subcategory);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditingSubCategory(null);
//   };

//   const handleDeleteSubCategory = async (subcategoryId) => {
//     try {
//       await deleteCategory({ id: subcategoryId }); // Assuming this is the correct delete API
//       setData((prevData) => prevData.filter((subcategory) => subcategory.id !== subcategoryId));
//       toast.success('Subcategory deleted successfully');
//     } catch (error) {
//       console.error('Error deleting subcategory:', error);
//       toast.error('Failed to delete subcategory. Please try again later.');
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       image: null,
//       imagePreview: null,
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Subcategory name is required'),
//       image: Yup.mixed().required('Image is required'),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       setLoading(true);
//       console.log('Submitting form with values:', values); // Added logging

//       try {
//         let imageUrl = editingSubCategory.image;

//         if (values.image && values.image instanceof File) {
//           const formData = new FormData();

//           formData.append('file', values.image);
//           const uploadResponse = await uploadImage(formData);

//           imageUrl = uploadResponse.data.data.fileUrl;
//         }

//         const payload = {
//           category_id: editingSubCategory.categoryId,
//           subcategory_id: editingSubCategory.id,
//           name: values.name,
//           image: imageUrl,
//         };

//         const result = await updateSubCategory(payload);

//         console.log('API response:', result); // Added logging

//         setData((prevData) =>
//           prevData.map((subcategory) =>
//             subcategory.id === editingSubCategory.id ? { ...subcategory, name: values.name, image: imageUrl } : subcategory
//           )
//         );
//         toast.success('Subcategory updated successfully');
//         resetForm();
//         handleClose();
//       } catch (error) {
//         console.error('Error updating subcategory:', error);
//         toast.error('Failed to update subcategory. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   useEffect(() => {
//     if (editingSubCategory) {
//       formik.setValues({
//         name: editingSubCategory.name,
//         image: null,
//         imagePreview: editingSubCategory.image,
//       });
//     }
//   }, [editingSubCategory]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     formik.setFieldValue('image', file);
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       formik.setFieldValue('imagePreview', reader.result);
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Name',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-4">
//             <div className="flex flex-col">
//               <Typography className="font-medium" color="text.primary">
//                 {row.original.name}
//               </Typography>
//             </div>
//           </div>
//         ),
//       },
//       {
//         accessorKey: 'image',
//         header: 'Image',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-4">
//             <img src={row.original.image} alt={row.original.name} width={50} height={50} />
//           </div>
//         ),
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             <IconButton onClick={() => handleEditOpen(row.original)}>
//               <EditIcon />
//             </IconButton>
//             <IconButton onClick={() => handleDeleteSubCategory(row.original.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Card>
//       <ToastContainer />
//       <CardHeader title="Subcategories" className="flex flex-wrap gap-4" />
//       <div className="flex items-center justify-between p-6 gap-4">
//         <div className="flex items-center gap-2">
//           <Typography>Show</Typography>
//           <CustomTextField
//             select
//             value={rowsPerPage}
//             onChange={(e) => setRowsPerPage(Number(e.target.value))}
//             className="is-[70px]"
//           >
//             <MenuItem value={5}>5</MenuItem>
//             <MenuItem value={7}>7</MenuItem>
//             <MenuItem value={10}>10</MenuItem>
//           </CustomTextField>
//         </div>
//         <DebouncedInput
//           value={globalFilter ?? ''}
//           onChange={(value) => setGlobalFilter(String(value))}
//           placeholder="Search Subcategory"
//         />
//       </div>
//       <TableContainer component={Box} className="overflow-x-auto">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data
//               .filter((subcategory) => subcategory.name.toLowerCase().includes(globalFilter.toLowerCase()))
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((subcategory) => (
//                 <TableRow key={subcategory.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-4">
//                       <CustomAvatar src={subcategory.image} size={34} />
//                       <div className="flex flex-col">
//                         <Typography className="font-medium" color="text.primary">
//                           {subcategory.name}
//                         </Typography>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <img src={subcategory.image} alt={subcategory.name} width={50} height={50} />
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <IconButton onClick={() => handleEditOpen(subcategory)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton onClick={() => handleDeleteSubCategory(subcategory.id)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(_, newPage) => {
//           setPage(newPage);
//         }}
//         onRowsPerPageChange={(event) => {
//           setRowsPerPage(parseInt(event.target.value, 10));
//           setPage(0);
//         }}
//       />
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>{editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Subcategory Name"
//               type="text"
//               fullWidth
//               name="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.name && Boolean(formik.errors.name)}
//               helperText={formik.touched.name && formik.errors.name}
//             />
//             <Button
//               variant="contained"
//               component="label"
//               sx={{ mt: 2 }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 hidden
//                 onChange={handleImageChange}
//               />
//             </Button>
//             {formik.values.imagePreview && (
//               <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
//                 <img
//                   src={formik.values.imagePreview}
//                   alt="Preview"
//                   style={{ width: 100, height: 100 }}
//                 />
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit" variant="contained" color="primary">
//               {editingSubCategory ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Card>
//   );
// };

// export default SecurityTab;



'use client';

import React, { useState, useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';

// MUI Imports
import {
  Box,
  Card,
  CardHeader,
  MenuItem,
  TablePagination,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Third-party Imports
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Component Imports
import { ToastContainer, toast } from 'react-toastify';

import CustomAvatar from '@core/components/mui/Avatar';
import CustomTextField from '@core/components/mui/TextField';
import 'react-toastify/dist/ReactToastify.css';

// API Imports
// import { getUserById, updateSubCategory, uploadImage, deleteCategory } from '@/app/api';

// Style Imports
import tableStyles from '@core/styles/table.module.css';

// Debounced Input Component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

const SecurityTab = () => {
  const router = useRouter();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

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

        if (userDetailsResponse) {
          const formattedData = userDetailsResponse?.data?.data[0].subcategories.map(subcategory => ({
            id: subcategory._id,
            name: subcategory.name,
            image: subcategory.image,
            categoryId: userDetailsResponse.data.data[0]._id // assuming each subcategory belongs to a single category
          }))

          setData(formattedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleEditOpen = subcategory => {
    setEditingSubCategory(subcategory)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingSubCategory(null)
  }
  const filteredData = useMemo(() => {
    return data.filter(subcategory => subcategory.name.toLowerCase().includes(globalFilter.toLowerCase()))
  }, [data, globalFilter])

  const handleDeleteSubCategory = async subcategoryId => {
    try {
      // await deleteCategory({ id: subcategoryId }) // Assuming this is the correct delete API
      setData(prevData => prevData.filter(subcategory => subcategory.id !== subcategoryId))
      toast.success('Subcategory deleted successfully')
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast.error('Failed to delete subcategory. Please try again later.')
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      image: null,
      imagePreview: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Subcategory name is required'),
      image: Yup.mixed().required('Image is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)

      try {
        let imageUrl = editingSubCategory.image

        if (values.image && values.image instanceof File) {
          const formData = new FormData()

          formData.append('file', values.image)
          // const uploadResponse = await uploadImage(formData)

          imageUrl = uploadResponse.data.data.fileUrl
        }

        const payload = {
          category_id: editingSubCategory.categoryId,
          subcategory_id: editingSubCategory.id,
          name: values.name,
          image: imageUrl
        }

        // await updateSubCategory(payload)
        setData(prevData =>
          prevData.map(subcategory =>
            subcategory.id === editingSubCategory.id
              ? { ...subcategory, name: values.name, image: imageUrl }
              : subcategory
          )
        )
        toast.success('Subcategory updated successfully')
        resetForm()
        handleClose()
      } catch (error) {
        console.error('Error updating subcategory:', error)
        toast.error('Failed to update subcategory. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (editingSubCategory) {
      formik.setValues({
        name: editingSubCategory.name,
        image: editingSubCategory.image,
        imagePreview: editingSubCategory.image
      })
    }
  }, [editingSubCategory])

  const handleImageChange = e => {
    const file = e.target.files[0]

    formik.setFieldValue('image', file)
    const reader = new FileReader()

    reader.onloadend = () => {
      formik.setFieldValue('imagePreview', reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <img src={row.original.image} alt={row.original.name} width={50} height={50} />
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <IconButton onClick={() => handleEditOpen(row.original)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteSubCategory(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        )
      }
    ],
    []
  )
  useEffect(() => {
    setGlobalFilter(searchTerm)
    setPage(0)
  }, [searchTerm])
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Card>
      <ToastContainer />
      <CardHeader title='Subcategories' className='flex flex-wrap gap-4' />
      <div className='flex items-center justify-between p-6 gap-4'>
        <div className='flex items-center gap-2'>
          {/* <Typography>Show</Typography> */}
          {/* <CustomTextField
            select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="is-[70px]"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </CustomTextField> */}
        </div>
        <DebouncedInput
          value={searchTerm ?? ''}
          onChange={value => setSearchTerm(String(value))}
          placeholder='Search Subcategory'
        />
      </div>
      <TableContainer component={Box} className='overflow-x-auto'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(subcategory => (
              <TableRow key={subcategory.id}>
                <TableCell>
                  <div className='flex items-center gap-4'>
                    <CustomAvatar src={subcategory.image} size={34} />
                    <div className='flex flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {subcategory.name}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <img src={subcategory.image} alt={subcategory.name} width={50} height={50} />
                </TableCell>
                {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <IconButton onClick={() => handleEditOpen(subcategory)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteSubCategory(subcategory.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage)
        }}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10))
          setPage(0)
        }}
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>{editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Subcategory Name'
              type='text'
              fullWidth
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Button variant='contained' component='label' sx={{ mt: 2 }}>
              Choose File
              <input type='file' hidden onChange={handleImageChange} />
            </Button>
            {formik.values.imagePreview && (
              <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
                <img src={formik.values.imagePreview} alt='Preview' style={{ width: 100, height: 100 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit' variant='contained' color='primary'>
              {editingSubCategory ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
};

export default SecurityTab;
