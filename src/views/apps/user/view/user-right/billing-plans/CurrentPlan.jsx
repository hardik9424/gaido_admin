// // // // 'use client'

// // // // // MUI Imports
// // // // import Card from '@mui/material/Card'
// // // // import CardHeader from '@mui/material/CardHeader'
// // // // import CardContent from '@mui/material/CardContent'
// // // // import Grid from '@mui/material/Grid'
// // // // import Typography from '@mui/material/Typography'
// // // // import Button from '@mui/material/Button'
// // // // import Chip from '@mui/material/Chip'
// // // // import Alert from '@mui/material/Alert'
// // // // import AlertTitle from '@mui/material/AlertTitle'
// // // // import LinearProgress from '@mui/material/LinearProgress'

// // // // // Component Imports
// // // // import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
// // // // import UpgradePlan from '@components/dialogs/upgrade-plan'
// // // // import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// // // // const CurrentPlan = ({ data }) => {
// // // //   const buttonProps = (children, variant, color) => ({
// // // //     children,
// // // //     variant,
// // // //     color
// // // //   })

// // // //   return (
// // // //     <Card>
// // // //       <CardHeader title='Current Plan' />
// // // //       <CardContent>
// // // //         <Grid container spacing={6}>
// // // //           <Grid item xs={12} md={6} className='flex flex-col gap-4'>
// // // //             <div>
// // // //               <Typography className='font-medium text-textPrimary'>Your Current Plan is Basic</Typography>
// // // //               <Typography>A simple start for everyone</Typography>
// // // //             </div>
// // // //             <div>
// // // //               <Typography className='font-medium' color='text.primary'>
// // // //                 Active until Dec 09, 2021
// // // //               </Typography>
// // // //               <Typography>We will send you a notification upon Subscription expiration</Typography>
// // // //             </div>
// // // //             <div className='flex flex-col gap-1'>
// // // //               <div className='flex items-center gap-2'>
// // // //                 <Typography className='font-medium' color='text.primary'>
// // // //                   $99 Per Month
// // // //                 </Typography>
// // // //                 <Chip color='primary' label='Popular' size='small' variant='tonal' />
// // // //               </div>
// // // //               <Typography>Standard plan for small to medium businesses</Typography>
// // // //             </div>
// // // //           </Grid>
// // // //           <Grid item xs={12} md={6}>
// // // //             <Alert icon={false} severity='warning' className='mbe-4'>
// // // //               <AlertTitle>We need your attention!</AlertTitle>
// // // //               Your plan requires update
// // // //             </Alert>
// // // //             <div className='flex items-center justify-between'>
// // // //               <Typography className='font-medium' color='text.primary'>
// // // //                 Days
// // // //               </Typography>
// // // //               <Typography className='font-medium' color='text.primary'>
// // // //                 26 of 30 Days
// // // //               </Typography>
// // // //             </div>
// // // //             <LinearProgress variant='determinate' value={80} className='mlb-1 bs-2.5' />
// // // //             <Typography variant='body2'>Your plan requires update</Typography>
// // // //           </Grid>
// // // //           <Grid item xs={12} className='flex gap-4 flex-wrap'>
// // // //             <OpenDialogOnElementClick
// // // //               element={Button}
// // // //               elementProps={buttonProps('Upgrade plan', 'contained', 'primary')}
// // // //               dialog={UpgradePlan}
// // // //               dialogProps={{ data: data }}
// // // //             />
// // // //             <OpenDialogOnElementClick
// // // //               element={Button}
// // // //               elementProps={buttonProps('Cancel Subscription', 'tonal', 'error')}
// // // //               dialog={ConfirmationDialog}
// // // //               dialogProps={{ type: 'unsubscribe' }}
// // // //             />
// // // //           </Grid>
// // // //         </Grid>
// // // //       </CardContent>
// // // //     </Card>
// // // //   )
// // // // }

// // // // export default CurrentPlan



// // // // 'use client';

// // // // import React, { useState, useEffect, useMemo } from 'react';

// // // // import { useRouter } from 'next/navigation';

// // // // // MUI Imports
// // // // import {
// // // //   Box,
// // // //   Button,
// // // //   CircularProgress,
// // // //   Dialog,
// // // //   DialogActions,
// // // //   DialogContent,
// // // //   DialogTitle,
// // // //   FormControl,
// // // //   Grid,
// // // //   InputLabel,
// // // //   MenuItem,
// // // //   Select,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TablePagination,
// // // //   TableRow,
// // // //   TextField,
// // // //   Typography,
// // // //   Card,
// // // //   CardHeader
// // // // } from '@mui/material';
// // // // import { Edit, Delete } from '@mui/icons-material';
// // // // import { useTheme } from '@mui/material/styles';
// // // // import { ToastContainer, toast } from 'react-toastify';

// // // // // Third-party Imports
// // // // import classnames from 'classnames';
// // // // import { rankItem } from '@tanstack/match-sorter-utils';
// // // // import {
// // // //   createColumnHelper,
// // // //   flexRender,
// // // //   getCoreRowModel,
// // // //   useReactTable,
// // // //   getFilteredRowModel,
// // // //   getFacetedRowModel,
// // // //   getFacetedUniqueValues,
// // // //   getFacetedMinMaxValues,
// // // //   getPaginationRowModel,
// // // //   getSortedRowModel
// // // // } from '@tanstack/react-table';

// // // // // Custom Imports
// // // // import { useFormik } from 'formik';

// // // // import * as Yup from 'yup';

// // // // import CustomAvatar from '@core/components/mui/Avatar';
// // // // import CustomTextField from '@core/components/mui/TextField';
// // // // import TablePaginationComponent from '@components/TablePaginationComponent';
// // // // import tableStyles from '@core/styles/table.module.css';
// // // // import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // Fuzzy Filter Function
// // // // const fuzzyFilter = (row, columnId, value, addMeta) => {
// // // //   const itemRank = rankItem(row.getValue(columnId), value);

// // // //   addMeta({ itemRank });

// // // //   return itemRank.passed;
// // // // };

// // // // // Debounced Input Component
// // // // const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
// // // //   const [value, setValue] = useState(initialValue);

// // // //   useEffect(() => {
// // // //     setValue(initialValue);
// // // //   }, [initialValue]);

// // // //   useEffect(() => {
// // // //     const timeout = setTimeout(() => {
// // // //       onChange(value);
// // // //     }, debounce);

// // // //     return () => clearTimeout(timeout);
// // // //   }, [value, onChange, debounce]);

// // // //   return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
// // // // };

// // // // // Column Definitions
// // // // const columnHelper = createColumnHelper();

// // // // const CurrentPlan = () => {
// // // //   const theme = useTheme();
// // // //   const [rowSelection, setRowSelection] = useState({});
// // // //   const [data, setData] = useState([]);
// // // //   const [globalFilter, setGlobalFilter] = useState('');
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [editModalOpen, setEditModalOpen] = useState(false);
// // // //   const [communityToDelete, setCommunityToDelete] = useState(null);
// // // //   const [editingCommunity, setEditingCommunity] = useState(null);
// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // // //   const [allcategories, setAllCategories] = useState([])
// // // //   const router = useRouter();

// // // //   // Fetch Data from API
// // // //   useEffect(() => {
// // // //     const fetchCommunities = async () => {
// // // //       try {
// // // //         const token = localStorage.getItem('token');

// // // //         if (!token) {
// // // //           router.push('/login');

// // // //           return;
// // // //         }

// // // //         const response = await getAllCommunity(token);
// // // //         const categories = await getAllCategory()

// // // //         setData(response.data.data);
// // // //       } catch (error) {
// // // //         console.error('Error fetching communities:', error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchCommunities();
// // // //   }, [router]);

// // // //   // Define Columns
// // // //   const columns = useMemo(
// // // //     () => [
// // // //       columnHelper.accessor('name', {
// // // //         header: 'Name',
// // // //         cell: ({ row }) => (
// // // //           <div className='flex items-center gap-4'>
// // // //             <div className='flex flex-col'>
// // // //               <Typography className='font-medium' color='text.primary'>
// // // //                 {row.original.name}
// // // //               </Typography>
// // // //             </div>
// // // //           </div>
// // // //         ),
// // // //       }),
// // // //       columnHelper.accessor('image', {
// // // //         header: 'Image',
// // // //         cell: ({ row }) => (
// // // //           <div className='flex items-center gap-4'>
// // // //             <img src={row.original.image} alt={row.original.name} width={50} height={50} />
// // // //           </div>
// // // //         ),
// // // //       }),
// // // //       columnHelper.accessor('action', {
// // // //         header: 'Actions',
// // // //         cell: ({ row }) => (
// // // //           <div className='flex items-center gap-2'>
// // // //             <Button variant="contained" color="primary" onClick={() => handleEdit(row.original)}>Edit</Button>
// // // //             <Button variant="contained" color="error" onClick={() => handleDelete(row.original)}>Delete</Button>
// // // //           </div>
// // // //         ),
// // // //         enableSorting: false,
// // // //       }),
// // // //     ],
// // // //     []
// // // //   );

// // // //   const handleEdit = (community) => {
// // // //     setEditingCommunity(community);
// // // //     setEditModalOpen(true);
// // // //   };

// // // //   const handleDelete = async (community) => {
// // // //     try {
// // // //       const token = localStorage.getItem('token');

// // // //       await deleteCommunity({ id: community._id }, token);
// // // //       setData((prevData) => prevData.filter((item) => item._id !== community._id));
// // // //       toast.success('Community deleted successfully');
// // // //     } catch (error) {
// // // //       console.error('Error deleting community:', error);
// // // //       toast.error('Failed to delete community');
// // // //     }
// // // //   };

// // // //   const handleEditSubmit = async (values) => {
// // // //     setSubmitting(true);

// // // //     try {
// // // //       const token = localStorage.getItem('token');

// // // //       const updatePayload = {
// // // //         ...values,
// // // //         community_id: editingCommunity._id,
// // // //       };

// // // //       await updateCommunity(updatePayload, token);

// // // //       setData((prevData) => prevData.map((item) =>
// // // //         item._id === editingCommunity._id ? { ...item, ...values } : item
// // // //       ));
// // // //       setEditModalOpen(false);
// // // //       toast.success('Community updated successfully');
// // // //     } catch (error) {
// // // //       console.error('Error updating community:', error);
// // // //       toast.error('Failed to update community');
// // // //     } finally {
// // // //       setSubmitting(false);
// // // //     }
// // // //   };

// // // //   const formik = useFormik({
// // // //     initialValues: {
// // // //       name: '',
// // // //       description: '',
// // // //       selectedCategory: '',
// // // //       image: '',
// // // //     },
// // // //     validationSchema: Yup.object({
// // // //       name: Yup.string().required('Name is required'),
// // // //       description: Yup.string().required('Description is required'),
// // // //       selectedCategory: Yup.string().required('Category is required'),
// // // //     }),
// // // //     onSubmit: handleEditSubmit,
// // // //     enableReinitialize: true,
// // // //   });

// // // //   useEffect(() => {
// // // //     if (editingCommunity) {
// // // //       formik.setValues({
// // // //         name: editingCommunity.name,
// // // //         description: editingCommunity.description,
// // // //         selectedCategory: editingCommunity.category,
// // // //         image: editingCommunity.image,
// // // //       });
// // // //     }
// // // //   }, [editingCommunity]);

// // // //   // Use React Table Hook
// // // //   const table = useReactTable({
// // // //     data,
// // // //     columns,
// // // //     filterFns: { fuzzy: fuzzyFilter },
// // // //     state: { rowSelection, globalFilter },
// // // //     initialState: { pagination: { pageSize: 5 } },
// // // //     enableRowSelection: true,
// // // //     globalFilterFn: fuzzyFilter,
// // // //     onRowSelectionChange: setRowSelection,
// // // //     getCoreRowModel: getCoreRowModel(),
// // // //     onGlobalFilterChange: setGlobalFilter,
// // // //     getFilteredRowModel: getFilteredRowModel(),
// // // //     getSortedRowModel: getSortedRowModel(),
// // // //     getPaginationRowModel: getPaginationRowModel(),
// // // //     getFacetedRowModel: getFacetedRowModel(),
// // // //     getFacetedUniqueValues: getFacetedUniqueValues(),
// // // //     getFacetedMinMaxValues: getFacetedMinMaxValues(),
// // // //   });

// // // //   return (
// // // //     <Card>
// // // //       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
// // // //       <div className='flex items-center justify-between p-6 gap-4'>
// // // //         <div className='flex items-center gap-2'>
// // // //           <Typography>Show</Typography>
// // // //           <CustomTextField
// // // //             select
// // // //             value={table.getState().pagination.pageSize}
// // // //             onChange={(e) => table.setPageSize(Number(e.target.value))}
// // // //             className='is-[70px]'
// // // //           >
// // // //             <MenuItem value='5'>5</MenuItem>
// // // //             <MenuItem value='7'>7</MenuItem>
// // // //             <MenuItem value='10'>10</MenuItem>
// // // //           </CustomTextField>
// // // //         </div>
// // // //         <DebouncedInput
// // // //           value={globalFilter ?? ''}
// // // //           onChange={(value) => setGlobalFilter(String(value))}
// // // //           placeholder='Search Community'
// // // //         />
// // // //       </div>
// // // //       <div className='overflow-x-auto'>
// // // //         {loading ? (
// // // //           <Box display="flex" justifyContent="center" alignItems="center" height="300px">
// // // //             <CircularProgress />
// // // //           </Box>
// // // //         ) : (
// // // //           <table className={tableStyles.table}>
// // // //             <thead>
// // // //               {table.getHeaderGroups().map((headerGroup) => (
// // // //                 <tr key={headerGroup.id}>
// // // //                   {headerGroup.headers.map((header) => (
// // // //                     <th key={header.id}>
// // // //                       {header.isPlaceholder ? null : (
// // // //                         <div
// // // //                           className={classnames({
// // // //                             'flex items-center': header.column.getIsSorted(),
// // // //                             'cursor-pointer select-none': header.column.getCanSort(),
// // // //                           })}
// // // //                           onClick={header.column.getToggleSortingHandler()}
// // // //                         >
// // // //                           {flexRender(header.column.columnDef.header, header.getContext())}
// // // //                           {{
// // // //                             asc: <i className='tabler-chevron-up text-xl' />,
// // // //                             desc: <i className='tabler-chevron-down text-xl' />,
// // // //                           }[header.column.getIsSorted()] ?? null}
// // // //                         </div>
// // // //                       )}
// // // //                     </th>
// // // //                   ))}
// // // //                 </tr>
// // // //               ))}
// // // //             </thead>
// // // //             {table.getFilteredRowModel().rows.length === 0 ? (
// // // //               <tbody>
// // // //                 <tr>
// // // //                   <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
// // // //                     No data available
// // // //                   </td>
// // // //                 </tr>
// // // //               </tbody>
// // // //             ) : (
// // // //               <tbody>
// // // //                 {table
// // // //                   .getRowModel()
// // // //                   .rows.slice(0, table.getState().pagination.pageSize)
// // // //                   .map((row) => (
// // // //                     <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
// // // //                       {row.getVisibleCells().map((cell) => (
// // // //                         <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
// // // //                       ))}
// // // //                     </tr>
// // // //                   ))}
// // // //               </tbody>
// // // //             )}
// // // //           </table>
// // // //         )}
// // // //       </div>
// // // //       <TablePagination
// // // //         component={() => <TablePaginationComponent table={table} />}
// // // //         count={table.getFilteredRowModel().rows.length}
// // // //         rowsPerPage={table.getState().pagination.pageSize}
// // // //         page={table.getState().pagination.pageIndex}
// // // //         onPageChange={(_, page) => {
// // // //           table.setPageIndex(page);
// // // //         }}
// // // //       />
// // // //       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
// // // //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
// // // //         <form onSubmit={formik.handleSubmit}>
// // // //           <DialogContent>
// // // //             <TextField
// // // //               autoFocus
// // // //               margin="dense"
// // // //               label="Community Name"
// // // //               type="text"
// // // //               fullWidth
// // // //               name="name"
// // // //               value={formik.values.name}
// // // //               onChange={formik.handleChange}
// // // //               onBlur={formik.handleBlur}
// // // //               error={formik.touched.name && Boolean(formik.errors.name)}
// // // //               helperText={formik.touched.name && formik.errors.name}
// // // //             />
// // // //             <TextField
// // // //               margin="dense"
// // // //               label="Description"
// // // //               type="text"
// // // //               fullWidth
// // // //               name="description"
// // // //               value={formik.values.description}
// // // //               onChange={formik.handleChange}
// // // //               onBlur={formik.handleBlur}
// // // //               error={formik.touched.description && Boolean(formik.errors.description)}
// // // //               helperText={formik.touched.description && formik.errors.description}
// // // //             />
// // // //             <FormControl fullWidth margin="dense">
// // // //               <InputLabel>Category</InputLabel>
// // // //               <Select
// // // //                 name="selectedCategory"
// // // //                 value={formik.values.selectedCategory}
// // // //                 onChange={formik.handleChange}
// // // //                 onBlur={formik.handleBlur}
// // // //                 error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
// // // //               >
// // // //                 <MenuItem value="">
// // // //                   <em>None</em>
// // // //                 </MenuItem>
// // // //                 {/* Map categories dynamically */}
// // // //                 {/* Example */}
// // // //                 <MenuItem value="category1">Category 1</MenuItem>
// // // //                 <MenuItem value="category2">Category 2</MenuItem>
// // // //               </Select>
// // // //             </FormControl>
// // // //           </DialogContent>
// // // //           <DialogActions>
// // // //             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
// // // //             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
// // // //               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
// // // //             </Button>
// // // //           </DialogActions>
// // // //         </form>
// // // //       </Dialog>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default CurrentPlan




// // // 'use client';

// // // import React, { useState, useEffect, useMemo } from 'react';

// // // import { useRouter } from 'next/navigation';

// // // // MUI Imports
// // // import {
// // //   Box,
// // //   Button,
// // //   CircularProgress,
// // //   Dialog,
// // //   DialogActions,
// // //   DialogContent,
// // //   DialogTitle,
// // //   FormControl,
// // //   Grid,
// // //   InputLabel,
// // //   MenuItem,
// // //   Select,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TablePagination,
// // //   TableRow,
// // //   TextField,
// // //   Typography,
// // //   Card,
// // //   CardHeader
// // // } from '@mui/material';
// // // import { Edit, Delete } from '@mui/icons-material';
// // // import { useTheme } from '@mui/material/styles';
// // // import { ToastContainer, toast } from 'react-toastify';

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
// // //   getSortedRowModel
// // // } from '@tanstack/react-table';

// // // // Custom Imports
// // // import { useFormik } from 'formik';
// // // import * as Yup from 'yup';

// // // import CustomAvatar from '@core/components/mui/Avatar';
// // // import CustomTextField from '@core/components/mui/TextField';
// // // import TablePaginationComponent from '@components/TablePaginationComponent';
// // // import tableStyles from '@core/styles/table.module.css';
// // // import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// // // import 'react-toastify/dist/ReactToastify.css';

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

// // // const CurrentPlan = () => {
// // //   const theme = useTheme();
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [data, setData] = useState([]);
// // //   const [globalFilter, setGlobalFilter] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [editModalOpen, setEditModalOpen] = useState(false);
// // //   const [editingCommunity, setEditingCommunity] = useState(null);
// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // //   const [allCategories, setAllCategories] = useState([]);
// // //   const [submitting, setSubmitting] = useState(false)
// // //   const router = useRouter();

// // //   // Fetch Data from API
// // //   useEffect(() => {
// // //     const fetchCommunities = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');

// // //         if (!token) {
// // //           router.push('/login');

// // //           return;
// // //         }

// // //         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);

// // //         setData(response.data.data);
// // //         setAllCategories(categories.data.data);
// // //       } catch (error) {
// // //         console.error('Error fetching communities:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCommunities();
// // //   }, [router]);

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
// // //       columnHelper.accessor('action', {
// // //         header: 'Actions',
// // //         cell: ({ row }) => (
// // //           <div className='flex items-center gap-2'>
// // //             <Button variant="contained" color="primary" onClick={() => handleEdit(row.original)}>Edit</Button>
// // //             <Button variant="contained" color="error" onClick={() => handleDelete(row.original)}>Delete</Button>
// // //           </div>
// // //         ),
// // //         enableSorting: false,
// // //       }),
// // //     ],
// // //     []
// // //   );

// // //   const handleEdit = (community) => {
// // //     setEditingCommunity(community);
// // //     setEditModalOpen(true);
// // //   };

// // //   const handleDelete = async (community) => {
// // //     try {
// // //       const token = localStorage.getItem('token');

// // //       await deleteCommunity({ id: community._id }, token);
// // //       setData((prevData) => prevData.filter((item) => item._id !== community._id));
// // //       toast.success('Community deleted successfully');
// // //     } catch (error) {
// // //       console.error('Error deleting community:', error);
// // //       toast.error('Failed to delete community');
// // //     }
// // //   };

// // //   const handleEditSubmit = async (values) => {
// // //     setSubmitting(true);

// // //     try {
// // //       const token = localStorage.getItem('token');

// // //       const updatePayload = {
// // //         ...values,
// // //         category: editingCommunity.category,
// // //         community_id: editingCommunity._id,
// // //       };

// // //       const result = await updateCommunity(updatePayload, token);

// // //       console.log(result)
// // //       setData((prevData) =>
// // //         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
// // //       );
// // //       setEditModalOpen(false);
// // //       toast.success('Community updated successfully');
// // //     } catch (error) {
// // //       console.error('Error updating community:', error);
// // //       toast.error('Failed to update community');
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const formik = useFormik({
// // //     initialValues: {
// // //       name: '',
// // //       description: '',

// // //       // selectedCategory: '',
// // //       image: '',
// // //     },
// // //     validationSchema: Yup.object({
// // //       name: Yup.string().required('Name is required'),
// // //       description: Yup.string().required('Description is required'),

// // //       // selectedCategory: Yup.string().required('Category is required'),
// // //     }),
// // //     onSubmit: handleEditSubmit,
// // //     enableReinitialize: true,
// // //   });

// // //   useEffect(() => {
// // //     if (editingCommunity) {
// // //       formik.setValues({
// // //         name: editingCommunity.name,
// // //         description: editingCommunity.description,

// // //         // selectedCategory: editingCommunity.category,
// // //         image: editingCommunity.image,
// // //       });
// // //     }
// // //   }, [editingCommunity]);

// // //   // Use React Table Hook
// // //   const table = useReactTable({
// // //     data,
// // //     columns,
// // //     filterFns: { fuzzy: fuzzyFilter },
// // //     state: { rowSelection, globalFilter },
// // //     initialState: { pagination: { pageSize: 5 } },
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
// // //       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
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
// // //           placeholder='Search Community'
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
// // //       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
// // //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
// // //         <form onSubmit={formik.handleSubmit}>
// // //           <DialogContent>
// // //             <TextField
// // //               autoFocus
// // //               margin="dense"
// // //               label="Community Name"
// // //               type="text"
// // //               fullWidth
// // //               name="name"
// // //               value={formik.values.name}
// // //               onChange={formik.handleChange}
// // //               onBlur={formik.handleBlur}
// // //               error={formik.touched.name && Boolean(formik.errors.name)}
// // //               helperText={formik.touched.name && formik.errors.name}
// // //             />
// // //             <TextField
// // //               margin="dense"
// // //               label="Description"
// // //               type="text"
// // //               fullWidth
// // //               name="description"
// // //               value={formik.values.description}
// // //               onChange={formik.handleChange}
// // //               onBlur={formik.handleBlur}
// // //               error={formik.touched.description && Boolean(formik.errors.description)}
// // //               helperText={formik.touched.description && formik.errors.description}
// // //             />
// // //             <FormControl fullWidth margin="dense">
// // //               <InputLabel>Category</InputLabel>
// // //               <Select
// // //                 name="selectedCategory"
// // //                 value={formik.values.selectedCategory}
// // //                 onChange={formik.handleChange}
// // //                 onBlur={formik.handleBlur}
// // //                 error={formik.touched.selectedCategory && Boolean(formik.errors.selectedCategory)}
// // //               >
// // //                 <MenuItem value="">
// // //                   <em>None</em>
// // //                 </MenuItem>
// // //                 {/* Map categories dynamically */}
// // //                 {allCategories.map((category) => (
// // //                   <MenuItem key={category._id} value={category._id}>
// // //                     {category.name}
// // //                   </MenuItem>
// // //                 ))}
// // //               </Select>
// // //             </FormControl>
// // //           </DialogContent>
// // //           <DialogActions>
// // //             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
// // //             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
// // //               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
// // //             </Button>
// // //           </DialogActions>
// // //         </form>
// // //       </Dialog>
// // //     </Card>
// // //   );
// // // };

// // // export default CurrentPlan;








// // // 'use client';

// // // import React, { useState, useEffect, useMemo } from 'react';

// // // import { useRouter } from 'next/navigation';

// // // // MUI Imports
// // // import {
// // //   Box,
// // //   Button,
// // //   CircularProgress,
// // //   Dialog,
// // //   DialogActions,
// // //   DialogContent,
// // //   DialogTitle,
// // //   FormControl,
// // //   Grid,
// // //   InputLabel,
// // //   MenuItem,
// // //   Select,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TablePagination,
// // //   TableRow,
// // //   TextField,
// // //   Typography,
// // //   Card,
// // //   CardHeader
// // // } from '@mui/material';
// // // import { Edit, Delete } from '@mui/icons-material';
// // // import { useTheme } from '@mui/material/styles';
// // // import { ToastContainer, toast } from 'react-toastify';

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
// // //   getSortedRowModel
// // // } from '@tanstack/react-table';

// // // // Custom Imports
// // // import { useFormik } from 'formik';
// // // import * as Yup from 'yup';

// // // import CustomAvatar from '@core/components/mui/Avatar';
// // // import CustomTextField from '@core/components/mui/TextField';
// // // import TablePaginationComponent from '@components/TablePaginationComponent';
// // // import tableStyles from '@core/styles/table.module.css';
// // // import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// // // import 'react-toastify/dist/ReactToastify.css';

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

// // // const CurrentPlan = () => {
// // //   const theme = useTheme();
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [data, setData] = useState([]);
// // //   const [globalFilter, setGlobalFilter] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [editModalOpen, setEditModalOpen] = useState(false);
// // //   const [editingCommunity, setEditingCommunity] = useState(null);
// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // //   const [allCategories, setAllCategories] = useState([]);
// // //   const [submitting, setSubmitting] = useState(false)
// // //   const router = useRouter();

// // //   // Fetch Data from API
// // //   useEffect(() => {
// // //     const fetchCommunities = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');

// // //         if (!token) {
// // //           router.push('/login');

// // //           return;
// // //         }

// // //         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);

// // //         setData(response.data.data);
// // //         setAllCategories(categories.data.data);
// // //       } catch (error) {
// // //         console.error('Error fetching communities:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCommunities();
// // //   }, [router]);

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
// // //       columnHelper.accessor('action', {
// // //         header: 'Actions',
// // //         cell: ({ row }) => (
// // //           <div className='flex items-center gap-2'>
// // //             <Button variant="contained" color="primary" onClick={() => handleEdit(row.original)}>Edit</Button>
// // //             <Button variant="contained" color="error" onClick={() => handleDelete(row.original)}>Delete</Button>
// // //           </div>
// // //         ),
// // //         enableSorting: false,
// // //       }),
// // //     ],
// // //     []
// // //   );

// // //   const handleEdit = (community) => {
// // //     setEditingCommunity(community);
// // //     setEditModalOpen(true);
// // //   };

// // //   const handleDelete = async (community) => {
// // //     try {
// // //       const token = localStorage.getItem('token');

// // //       await deleteCommunity({ id: community._id }, token);
// // //       setData((prevData) => prevData.filter((item) => item._id !== community._id));
// // //       toast.success('Community deleted successfully');
// // //     } catch (error) {
// // //       console.error('Error deleting community:', error);
// // //       toast.error('Failed to delete community');
// // //     }
// // //   };

// // //   const handleEditSubmit = async (values) => {
// // //     setSubmitting(true);

// // //     try {
// // //       const token = localStorage.getItem('token');

// // //       const updatePayload = {
// // //         ...values,
// // //         category: values.category,
// // //         community_id: editingCommunity._id,
// // //       };

// // //       const result = await updateCommunity(updatePayload, token);

// // //       setData((prevData) =>
// // //         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
// // //       );
// // //       setEditModalOpen(false);
// // //       toast.success('Community updated successfully');
// // //     } catch (error) {
// // //       console.error('Error updating community:', error);
// // //       toast.error('Failed to update community');
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const formik = useFormik({
// // //     initialValues: {
// // //       name: '',
// // //       description: '',
// // //       category: '',
// // //       image: '',
// // //     },
// // //     validationSchema: Yup.object({
// // //       name: Yup.string().required('Name is required'),
// // //       description: Yup.string().required('Description is required'),
// // //       category: Yup.string().required('Category is required'),
// // //     }),
// // //     onSubmit: handleEditSubmit,
// // //     enableReinitialize: true,
// // //   });

// // //   useEffect(() => {
// // //     if (editingCommunity) {
// // //       formik.setValues({
// // //         name: editingCommunity.name,
// // //         description: editingCommunity.description,
// // //         category: editingCommunity.category,
// // //         image: editingCommunity.image,
// // //       });
// // //     }
// // //   }, [editingCommunity]);

// // //   // Use React Table Hook
// // //   const table = useReactTable({
// // //     data,
// // //     columns,
// // //     filterFns: { fuzzy: fuzzyFilter },
// // //     state: { rowSelection, globalFilter },
// // //     initialState: { pagination: { pageSize: 5 } },
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
// // //       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
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
// // //           placeholder='Search Community'
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
// // //       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
// // //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
// // //         <form onSubmit={formik.handleSubmit}>
// // //           <DialogContent>
// // //             <TextField
// // //               autoFocus
// // //               margin="dense"
// // //               label="Community Name"
// // //               type="text"
// // //               fullWidth
// // //               name="name"
// // //               value={formik.values.name}
// // //               onChange={formik.handleChange}
// // //               onBlur={formik.handleBlur}
// // //               error={formik.touched.name && Boolean(formik.errors.name)}
// // //               helperText={formik.touched.name && formik.errors.name}
// // //             />
// // //             <TextField
// // //               margin="dense"
// // //               label="Description"
// // //               type="text"
// // //               fullWidth
// // //               name="description"
// // //               value={formik.values.description}
// // //               onChange={formik.handleChange}
// // //               onBlur={formik.handleBlur}
// // //               error={formik.touched.description && Boolean(formik.errors.description)}
// // //               helperText={formik.touched.description && formik.errors.description}
// // //             />
// // //             <FormControl fullWidth margin="dense">
// // //               <InputLabel>Category</InputLabel>
// // //               <Select
// // //                 name="category"
// // //                 value={formik.values.category}
// // //                 onChange={formik.handleChange}
// // //                 onBlur={formik.handleBlur}
// // //                 error={formik.touched.category && Boolean(formik.errors.category)}
// // //               >
// // //                 <MenuItem value="">
// // //                   <em>None</em>
// // //                 </MenuItem>
// // //                 {allCategories.map((category) => (
// // //                   <MenuItem key={category._id} value={category._id}>
// // //                     {category.name}
// // //                   </MenuItem>
// // //                 ))}
// // //               </Select>
// // //             </FormControl>
// // //           </DialogContent>
// // //           <DialogActions>
// // //             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
// // //             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
// // //               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
// // //             </Button>
// // //           </DialogActions>
// // //         </form>
// // //       </Dialog>
// // //     </Card>
// // //   );
// // // };

// // // export default CurrentPlan;




// // 'use client';

// // import React, { useState, useEffect } from 'react';

// // import { useRouter } from 'next/navigation';

// // // MUI Imports
// // import {
// //   Box,
// //   Button,
// //   CircularProgress,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   FormControl,
// //   Grid,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   TextField,
// //   Typography,
// //   Card,
// //   CardHeader,
// //   IconButton,
// //   CardContent,
// //   CardActions,
// // } from '@mui/material';
// // import { Edit, Delete } from '@mui/icons-material';
// // import { useTheme } from '@mui/material/styles';
// // import { ToastContainer, toast } from 'react-toastify';

// // // Custom Imports
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';

// // import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// // import 'react-toastify/dist/ReactToastify.css';

// // const CurrentPlan = () => {
// //   const theme = useTheme();
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editModalOpen, setEditModalOpen] = useState(false);
// //   const [editingCommunity, setEditingCommunity] = useState(null);
// //   const [allCategories, setAllCategories] = useState([]);
// //   const [submitting, setSubmitting] = useState(false);
// //   const router = useRouter();

// //   // Fetch Data from API
// //   useEffect(() => {
// //     const fetchCommunities = async () => {
// //       try {
// //         const token = localStorage.getItem('token');

// //         if (!token) {
// //           router.push('/login');

// //           return;
// //         }

// //         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);

// //         setData(response.data.data);
// //         setAllCategories(categories.data.data);
// //       } catch (error) {
// //         console.error('Error fetching communities:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCommunities();
// //   }, [router]);

// //   const handleEdit = (community) => {
// //     setEditingCommunity(community);
// //     setEditModalOpen(true);
// //   };

// //   const handleDelete = async (community) => {
// //     try {
// //       const token = localStorage.getItem('token');

// //       await deleteCommunity({ id: community._id }, token);
// //       setData((prevData) => prevData.filter((item) => item._id !== community._id));
// //       toast.success('Community deleted successfully');
// //     } catch (error) {
// //       console.error('Error deleting community:', error);
// //       toast.error('Failed to delete community');
// //     }
// //   };

// //   const handleEditSubmit = async (values) => {
// //     setSubmitting(true);

// //     try {
// //       const token = localStorage.getItem('token');

// //       const updatePayload = {
// //         ...values,
// //         community_id: editingCommunity._id,
// //       };

// //       const result = await updateCommunity(updatePayload, token);

// //       setData((prevData) =>
// //         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
// //       );
// //       setEditModalOpen(false);
// //       toast.success('Community updated successfully');
// //     } catch (error) {
// //       console.error('Error updating community:', error);
// //       toast.error('Failed to update community');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const formik = useFormik({
// //     initialValues: {
// //       name: '',
// //       description: '',
// //       category: '',
// //       image: '',
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required('Name is required'),
// //       description: Yup.string().required('Description is required'),
// //       category: Yup.string().required('Category is required'),
// //     }),
// //     onSubmit: handleEditSubmit,
// //     enableReinitialize: true,
// //   });

// //   useEffect(() => {
// //     if (editingCommunity) {
// //       formik.setValues({
// //         name: editingCommunity.name,
// //         description: editingCommunity.description,
// //         category: editingCommunity.category,
// //         image: editingCommunity.image,
// //       });
// //     }
// //   }, [editingCommunity]);

// //   return (
// //     <Box sx={{ padding: theme.spacing(2) }}>
// //       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
// //       <Grid container spacing={2}>
// //         {loading ? (
// //           <Box display="flex" justifyContent="center" alignItems="center" height="300px" width="100%">
// //             <CircularProgress />
// //           </Box>
// //         ) : (
// //           data.map((community) => (
// //             <Grid item xs={12} sm={6} md={4} lg={3} key={community._id}>
// //               <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
// //                 <CardContent sx={{ flexGrow: 1 }}>
// //                   <Typography variant="h6" gutterBottom>{community.name}</Typography>
// //                   <Box
// //                     component="img"
// //                     src={community.image}
// //                     alt={community.name}
// //                     sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 1 }}
// //                   />
// //                   <Typography variant="body2" mt={2}>{community.description}</Typography>
// //                 </CardContent>
// //                 <CardActions sx={{ justifyContent: 'flex-end' }}>
// //                   <IconButton onClick={() => handleEdit(community)} color="primary">
// //                     <Edit />
// //                   </IconButton>
// //                   <IconButton onClick={() => handleDelete(community)} color="error">
// //                     <Delete />
// //                   </IconButton>
// //                 </CardActions>
// //               </Card>
// //             </Grid>
// //           ))
// //         )}
// //       </Grid>

// //       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
// //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
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
// //               <InputLabel>Category</InputLabel>
// //               <Select
// //                 name="category"
// //                 value={formik.values.category}
// //                 onChange={formik.handleChange}
// //                 onBlur={formik.handleBlur}
// //                 error={formik.touched.category && Boolean(formik.errors.category)}
// //               >
// //                 <MenuItem value="">
// //                   <em>None</em>
// //                 </MenuItem>
// //                 {allCategories.map((category) => (
// //                   <MenuItem key={category._id} value={category._id}>
// //                     {category.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
// //             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
// //               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
// //             </Button>
// //           </DialogActions>
// //         </form>
// //       </Dialog>
// //       <ToastContainer />
// //     </Box>
// //   );
// // };

// // export default CurrentPlan;


// // 'use client';

// // import React, { useState, useEffect } from 'react';

// // import { useRouter } from 'next/navigation';

// // // MUI Imports
// // import {
// //   Box,
// //   Button,
// //   CircularProgress,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   FormControl,
// //   Grid,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   TextField,
// //   Typography,
// //   Card,
// //   CardHeader,
// //   IconButton,
// //   CardContent,
// //   CardActions,
// // } from '@mui/material';
// // import { Edit, Delete } from '@mui/icons-material';
// // import { useTheme } from '@mui/material/styles';
// // import { ToastContainer, toast } from 'react-toastify';

// // // Custom Imports
// // import { useFormik } from 'formik';
// // import * as Yup from 'yup';

// // import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// // import 'react-toastify/dist/ReactToastify.css';

// // const CurrentPlan = () => {
// //   const theme = useTheme();
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editModalOpen, setEditModalOpen] = useState(false);
// //   const [editingCommunity, setEditingCommunity] = useState(null);
// //   const [allCategories, setAllCategories] = useState([]);
// //   const [submitting, setSubmitting] = useState(false);
// //   const router = useRouter();

// //   // Fetch Data from API
// //   useEffect(() => {
// //     const fetchCommunities = async () => {
// //       try {
// //         const token = localStorage.getItem('token');

// //         if (!token) {
// //           router.push('/login');

// //           return;
// //         }

// //         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);

// //         setData(response.data.data);
// //         setAllCategories(categories.data.data);
// //       } catch (error) {
// //         console.error('Error fetching communities:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCommunities();
// //   }, [router]);

// //   const handleEdit = (community) => {
// //     setEditingCommunity(community);
// //     setEditModalOpen(true);
// //   };

// //   const handleDelete = async (community) => {
// //     try {
// //       const token = localStorage.getItem('token');

// //       await deleteCommunity({ id: community._id }, token);
// //       setData((prevData) => prevData.filter((item) => item._id !== community._id));
// //       toast.success('Community deleted successfully');
// //     } catch (error) {
// //       console.error('Error deleting community:', error);
// //       toast.error('Failed to delete community');
// //     }
// //   };

// //   const handleEditSubmit = async (values) => {
// //     setSubmitting(true);

// //     try {
// //       const token = localStorage.getItem('token');

// //       const updatePayload = {
// //         ...values,
// //         community_id: editingCommunity._id,
// //       };

// //       await updateCommunity(updatePayload, token);

// //       setData((prevData) =>
// //         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
// //       );
// //       setEditModalOpen(false);
// //       toast.success('Community updated successfully');
// //     } catch (error) {
// //       console.error('Error updating community:', error);
// //       toast.error('Failed to update community');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const formik = useFormik({
// //     initialValues: {
// //       name: '',
// //       description: '',
// //       category: '',
// //       image: '',
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required('Name is required'),
// //       description: Yup.string().required('Description is required'),
// //       category: Yup.string().required('Category is required'),
// //     }),
// //     onSubmit: handleEditSubmit,
// //     enableReinitialize: true,
// //   });

// //   useEffect(() => {
// //     if (editingCommunity) {
// //       formik.setValues({
// //         name: editingCommunity.name,
// //         description: editingCommunity.description,
// //         category: editingCommunity.category,
// //         image: editingCommunity.image,
// //       });
// //     }
// //   }, [editingCommunity]);

// //   return (
// //     <Box sx={{ padding: theme.spacing(2) }}>
// //       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
// //       <Grid container spacing={2}>
// //         {loading ? (
// //           <Box display="flex" justifyContent="center" alignItems="center" height="300px" width="100%">
// //             <CircularProgress />
// //           </Box>
// //         ) : (
// //           data.map((community) => (
// //             <Grid item xs={12} sm={6} md={4} lg={3} key={community._id}>
// //               <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
// //                 <CardContent sx={{ flexGrow: 1 }}>
// //                   <Typography variant="h6" gutterBottom>{community.name}</Typography>
// //                   <Box
// //                     component="img"
// //                     src={community.image}
// //                     alt={community.name}
// //                     sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 1 }}
// //                   />
// //                   <Typography variant="body2" mt={2}>{community.description}</Typography>
// //                 </CardContent>
// //                 <CardActions sx={{ justifyContent: 'flex-end' }}>
// //                   <IconButton onClick={() => handleEdit(community)} color="primary">
// //                     <Edit />
// //                   </IconButton>
// //                   <IconButton onClick={() => handleDelete(community)} color="error">
// //                     <Delete />
// //                   </IconButton>
// //                 </CardActions>
// //               </Card>
// //             </Grid>
// //           ))
// //         )}
// //       </Grid>

// //       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
// //         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
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
// //               <InputLabel>Category</InputLabel>
// //               <Select
// //                 name="category"
// //                 value={formik.values.category}
// //                 onChange={formik.handleChange}
// //                 onBlur={formik.handleBlur}
// //                 error={formik.touched.category && Boolean(formik.errors.category)}
// //               >
// //                 <MenuItem value="">
// //                   <em>None</em>
// //                 </MenuItem>
// //                 {allCategories.map((category) => (
// //                   <MenuItem key={category._id} value={category._id}>
// //                     {category.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
// //             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
// //               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
// //             </Button>
// //           </DialogActions>
// //         </form>
// //       </Dialog>
// //       <ToastContainer />
// //     </Box>
// //   );
// // };

// // export default CurrentPlan;





// 'use client';

// import React, { useState, useEffect } from 'react';

// import { useRouter } from 'next/navigation';

// // MUI Imports
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Card,
//   CardHeader,
//   IconButton,
//   CardContent,
//   CardActions,
// } from '@mui/material';
// import { Edit, Delete } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import { ToastContainer, toast } from 'react-toastify';

// // Custom Imports
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory } from '@/app/api';
// import 'react-toastify/dist/ReactToastify.css';

// const CurrentPlan = () => {
//   const theme = useTheme();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingCommunity, setEditingCommunity] = useState(null);
//   const [allCategories, setAllCategories] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const router = useRouter();

//   // Fetch Data from API
//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           router.push('/login');

//           return;
//         }

//         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);

//         setData(response.data.data);
//         setAllCategories(categories.data.data);
//       } catch (error) {
//         console.error('Error fetching communities:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCommunities();
//   }, [router]);

//   const handleEdit = (community) => {
//     setEditingCommunity(community);
//     setEditModalOpen(true);
//   };

//   const handleDelete = async (community) => {
//     try {
//       const token = localStorage.getItem('token');

//       await deleteCommunity({ id: community._id }, token);
//       setData((prevData) => prevData.filter((item) => item._id !== community._id));
//       toast.success('Community deleted successfully');
//     } catch (error) {
//       console.error('Error deleting community:', error);
//       toast.error('Failed to delete community');
//     }
//   };

//   const handleEditSubmit = async (values) => {
//     setSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');

//       const updatePayload = {
//         ...values,
//         community_id: editingCommunity._id,
//       };

//       await updateCommunity(updatePayload, token);

//       setData((prevData) =>
//         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
//       );
//       setEditModalOpen(false);
//       toast.success('Community updated successfully');
//     } catch (error) {
//       console.error('Error updating community:', error);
//       toast.error('Failed to update community');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       description: '',
//       category: '',
//       image: '',
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Name is required'),
//       description: Yup.string().required('Description is required'),
//       category: Yup.string().required('Category is required'),
//     }),
//     onSubmit: handleEditSubmit,
//     enableReinitialize: true,
//   });

//   useEffect(() => {
//     if (editingCommunity) {
//       formik.setValues({
//         name: editingCommunity.name,
//         description: editingCommunity.description,
//         category: editingCommunity.category,
//         image: editingCommunity.image,
//       });
//     }
//   }, [editingCommunity]);

//   return (
//     <Box sx={{ padding: theme.spacing(2) }}>
//       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
//       <Grid container spacing={2}>
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" height="300px" width="100%">
//             <CircularProgress />
//           </Box>
//         ) : (
//           data.map((community) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={community._id}>
//               <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" gutterBottom>{community.name}</Typography>
//                   <Box
//                     component="img"
//                     src={community.image}
//                     alt={community.name}
//                     sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 1 }}
//                   />
//                   <Typography variant="body2" mt={2} sx={{ maxHeight: '100px', overflowY: 'auto' }}>
//                     {community.description}
//                   </Typography>
//                 </CardContent>
//                 <CardActions sx={{ justifyContent: 'flex-end' }}>
//                   <IconButton onClick={() => handleEdit(community)} color="primary">
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(community)} color="error">
//                     <Delete />
//                   </IconButton>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>

//       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Community Name"
//               type="text"
//               fullWidth
//               name="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.name && Boolean(formik.errors.name)}
//               helperText={formik.touched.name && formik.errors.name}
//             />
//             <TextField
//               margin="dense"
//               label="Description"
//               type="text"
//               fullWidth
//               name="description"
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.description && Boolean(formik.errors.description)}
//               helperText={formik.touched.description && formik.errors.description}
//             />
//             <FormControl fullWidth margin="dense">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 name="category"
//                 value={formik.values.category}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.category && Boolean(formik.errors.category)}
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {allCategories.map((category) => (
//                   <MenuItem key={category._id} value={category._id}>
//                     {category.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
//             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
//               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//       <ToastContainer />
//     </Box>
//   );
// };

// export default CurrentPlan;


// 'use client';

// import React, { useState, useEffect } from 'react';

// import { useRouter } from 'next/navigation';

// // MUI Imports
// import { parse } from 'next/dist/build/swc';

// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Card,
//   CardHeader,
//   IconButton,
//   CardContent,
//   CardActions,
// } from '@mui/material';
// import { Edit, Delete } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import { ToastContainer, toast } from 'react-toastify';

// // Custom Imports
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// import { getAllCommunity, updateCommunity, deleteCommunity, getAllCategory, getUserById } from '@/app/api';
// import 'react-toastify/dist/ReactToastify.css';

// const CurrentPlan = () => {
//   const theme = useTheme();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingCommunity, setEditingCommunity] = useState(null);
//   const [allCategories, setAllCategories] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const router = useRouter();

//   // Fetch Data from API
//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           router.push('/login');

//           return;
//         }


//         // const userId = localStorage.getItem("id")
//         // const parseId = JSON.parse(userId)
//         const [response, categories] = await Promise.all([getAllCommunity(token), getAllCategory(token)]);


//         // console.log("ud", userDetails)

//         setData(response.data.data);
//         setAllCategories(categories.data.data);
//       } catch (error) {
//         console.error('Error fetching communities:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCommunities();
//   }, [router]);

//   const handleEdit = (community) => {
//     setEditingCommunity(community);
//     setEditModalOpen(true);
//   };

//   const handleDelete = async (community) => {
//     try {
//       const token = localStorage.getItem('token');

//       await deleteCommunity({ id: community._id }, token);
//       setData((prevData) => prevData.filter((item) => item._id !== community._id));
//       toast.success('Community deleted successfully');
//     } catch (error) {
//       console.error('Error deleting community:', error);
//       toast.error('Failed to delete community');
//     }
//   };

//   const handleEditSubmit = async (values) => {
//     setSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');

//       const updatePayload = {
//         ...values,
//         community_id: editingCommunity._id,
//       };

//       await updateCommunity(updatePayload, token);

//       setData((prevData) =>
//         prevData.map((item) => (item._id === editingCommunity._id ? { ...item, ...values } : item))
//       );
//       setEditModalOpen(false);
//       toast.success('Community updated successfully');
//     } catch (error) {
//       console.error('Error updating community:', error);
//       toast.error('Failed to update community');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       description: '',
//       category: '',
//       image: '',
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Name is required'),
//       description: Yup.string().required('Description is required'),
//       category: Yup.string().required('Category is required'),
//     }),
//     onSubmit: handleEditSubmit,
//     enableReinitialize: true,
//   });

//   useEffect(() => {
//     if (editingCommunity) {
//       formik.setValues({
//         name: editingCommunity.name,
//         description: editingCommunity.description,
//         category: editingCommunity.category,
//         image: editingCommunity.image,
//       });
//     }
//   }, [editingCommunity]);

//   return (
//     <Box sx={{ padding: theme.spacing(2) }}>
//       <CardHeader title="Communities" className='flex flex-wrap gap-4' />
//       <Grid container spacing={2}>
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" height="300px" width="100%">
//             <CircularProgress />
//           </Box>
//         ) : (
//           data.map((community) => (
//             <Grid item xs={12} sm={6} md={6} lg={6} key={community._id}>
//               <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" gutterBottom>{community.name}</Typography>
//                   <Box
//                     component="img"
//                     src={community.image}
//                     alt={community.name}
//                     sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 1 }}
//                   />
//                   <Typography variant="body2" mt={2} sx={{ maxHeight: '100px', overflowY: 'auto' }}>
//                     {community.description}
//                   </Typography>
//                 </CardContent>
//                 <CardActions sx={{ justifyContent: 'flex-end' }}>
//                   <IconButton onClick={() => handleEdit(community)} color="primary">
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(community)} color="error">
//                     <Delete />
//                   </IconButton>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>

//       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingCommunity ? 'Edit Community' : 'Add Community'}</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Community Name"
//               type="text"
//               fullWidth
//               name="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.name && Boolean(formik.errors.name)}
//               helperText={formik.touched.name && formik.errors.name}
//             />
//             <TextField
//               margin="dense"
//               label="Description"
//               type="text"
//               fullWidth
//               name="description"
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.description && Boolean(formik.errors.description)}
//               helperText={formik.touched.description && formik.errors.description}
//             />
//             <FormControl fullWidth margin="dense">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 name="category"
//                 value={formik.values.category}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.category && Boolean(formik.errors.category)}
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {allCategories.map((category) => (
//                   <MenuItem key={category._id} value={category._id}>
//                     {category.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
//             <Button type="submit" color="primary" disabled={formik.isSubmitting}>
//               {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//       <ToastContainer />
//     </Box>
//   );
// };

// export default CurrentPlan;
