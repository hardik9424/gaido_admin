// 'use client'

// // MUI Imports
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'
// import Avatar from '@mui/material/Avatar'
// import AvatarGroup from '@mui/material/AvatarGroup'
// import { styled } from '@mui/material/styles'
// import TimelineDot from '@mui/lab/TimelineDot'
// import TimelineItem from '@mui/lab/TimelineItem'
// import Typography from '@mui/material/Typography'
// import TimelineContent from '@mui/lab/TimelineContent'
// import TimelineSeparator from '@mui/lab/TimelineSeparator'
// import TimelineConnector from '@mui/lab/TimelineConnector'
// import MuiTimeline from '@mui/lab/Timeline'

// // Component Imports
// import CustomAvatar from '@core/components/mui/Avatar'

// // Styled Timeline component
// const Timeline = styled(MuiTimeline)({
//   paddingLeft: 0,
//   paddingRight: 0,
//   '& .MuiTimelineItem-root': {
//     width: '100%',
//     '&:before': {
//       display: 'none'
//     }
//   }
// })

// const UserActivityTimeLine = () => {
//   return (
//     <Card>
//       <CardHeader title='User Activity Timeline' />
//       <CardContent>
//         <Timeline>
//           <TimelineItem>
//             <TimelineSeparator>
//               <TimelineDot color='primary' />
//               <TimelineConnector />
//             </TimelineSeparator>
//             <TimelineContent>
//               <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   12 Invoices have been paid
//                 </Typography>
//                 <Typography variant='caption' color='text.disabled'>
//                   12 min ago
//                 </Typography>
//               </div>
//               <Typography className='mbe-2'>Invoices have been paid to the company</Typography>
//               <div className='flex items-center gap-2.5 is-fit bg-actionHover rounded plb-[5px] pli-2.5'>
//                 <img height={20} alt='invoice.pdf' src='/images/icons/pdf-document.png' />
//                 <Typography className='font-medium'>invoices.pdf</Typography>
//               </div>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineSeparator>
//               <TimelineDot color='success' />
//               <TimelineConnector />
//             </TimelineSeparator>
//             <TimelineContent>
//               <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Client Meeting
//                 </Typography>
//                 <Typography variant='caption' color='text.disabled'>
//                   45 min ago
//                 </Typography>
//               </div>
//               <Typography className='mbe-2'>Project meeting with john @10:15am</Typography>
//               <div className='flex items-center gap-2.5'>
//                 <CustomAvatar src='/images/avatars/1.png' size={32} />
//                 <div className='flex flex-col flex-wrap'>
//                   <Typography variant='body2' className='font-medium'>
//                     Lester McCarthy (Client)
//                   </Typography>
//                   <Typography variant='body2'>CEO of Pixinvent</Typography>
//                 </div>
//               </div>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineSeparator>
//               <TimelineDot color='info' />
//               <TimelineConnector />
//             </TimelineSeparator>
//             <TimelineContent>
//               <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
//                 <Typography className='font-medium' color='text.primary'>
//                   Create a new project for client
//                 </Typography>
//                 <Typography variant='caption' color='text.disabled'>
//                   2 Day Ago
//                 </Typography>
//               </div>
//               <Typography className='mbe-2'>6 team members in a project</Typography>
//               <AvatarGroup total={6} className='pull-up'>
//                 <Avatar alt='Travis Howard' src='/images/avatars/1.png' />
//                 <Avatar alt='Agnes Walker' src='/images/avatars/4.png' />
//                 <Avatar alt='John Doe' src='/images/avatars/2.png' />
//               </AvatarGroup>
//             </TimelineContent>
//           </TimelineItem>
//         </Timeline>
//       </CardContent>
//     </Card>
//   )
// }

// export default UserActivityTimeLine




'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Fuzzy Filter Function
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Debounced Input Component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)


    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserActivityTimeLine = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Fetch Data from Local Storage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    console.log(userData)

    if (userData && Array.isArray(userData.subcategory)) {
      const formattedData = userData.subcategory.map(subcategory => ({
        name: subcategory.name,
        image: subcategory.image // assuming each subcategory has an image field
      }))

      setData(formattedData)
    }
  }, [])

  // Define Columns
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          <CustomAvatar src={row.original.image} size={34} />
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.name}
            </Typography>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('image', {
      header: 'Image',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          <img src={row.original.image} alt={row.original.name} width={50} height={50} />
        </div>
      )
    })
  ], [])

  // Use React Table Hook
  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 7 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (

    // <Card>
    //   <CardHeader title="User's Sub-Category" className='flex flex-wrap gap-4' />
    //   <div className='flex items-center justify-between p-6 gap-4'>
    //     <div className='flex items-center gap-2'>
    //       <Typography>Show</Typography>
    //       <CustomTextField
    //         select
    //         value={table.getState().pagination.pageSize}
    //         onChange={e => table.setPageSize(Number(e.target.value))}
    //         className='is-[70px]'
    //       >
    //         <MenuItem value='5'>5</MenuItem>
    //         <MenuItem value='7'>7</MenuItem>
    //         <MenuItem value='10'>10</MenuItem>
    //       </CustomTextField>
    //     </div>
    //     <DebouncedInput
    //       value={globalFilter ?? ''}
    //       onChange={value => setGlobalFilter(String(value))}
    //       placeholder='Search Sub-Category'
    //     />
    //   </div>
    //   <div className='overflow-x-auto'>
    //     <table className={tableStyles.table}>
    //       <thead>
    //         {table.getHeaderGroups().map(headerGroup => (
    //           <tr key={headerGroup.id}>
    //             {headerGroup.headers.map(header => (
    //               <th key={header.id}>
    //                 {header.isPlaceholder ? null : (
    //                   <div
    //                     className={classnames({
    //                       'flex items-center': header.column.getIsSorted(),
    //                       'cursor-pointer select-none': header.column.getCanSort()
    //                     })}
    //                     onClick={header.column.getToggleSortingHandler()}
    //                   >
    //                     {flexRender(header.column.columnDef.header, header.getContext())}
    //                     {{
    //                       asc: <i className='tabler-chevron-up text-xl' />,
    //                       desc: <i className='tabler-chevron-down text-xl' />
    //                     }[header.column.getIsSorted()] ?? null}
    //                   </div>
    //                 )}
    //               </th>
    //             ))}
    //           </tr>
    //         ))}
    //       </thead>
    //       {table.getFilteredRowModel().rows.length === 0 ? (
    //         <tbody>
    //           <tr>
    //             <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
    //               No data available
    //             </td>
    //           </tr>
    //         </tbody>
    //       ) : (
    //         <tbody>
    //           {table
    //             .getRowModel()
    //             .rows.slice(0, table.getState().pagination.pageSize)
    //             .map(row => (
    //               <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
    //                 {row.getVisibleCells().map(cell => (
    //                   <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
    //                 ))}
    //               </tr>
    //             ))}
    //         </tbody>
    //       )}
    //     </table>
    //   </div>
    //   <TablePagination
    //     component={() => <TablePaginationComponent table={table} />}
    //     count={table.getFilteredRowModel().rows.length}
    //     rowsPerPage={table.getState().pagination.pageSize}
    //     page={table.getState().pagination.pageIndex}
    //     onPageChange={(_, page) => {
    //       table.setPageIndex(page)
    //     }}
    //   />
    // </Card>
    <>

    </>
  )
}

export default UserActivityTimeLine


