// import { useEffect } from 'react'

// import CountUp from 'react-countup'

// // MUI Imports
// import Grid from '@mui/material/Grid'

// // Component Imports
// import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// // Vars
// // const data = [
// //   {
// //     title: 'Session',
// //     value: '21,459',
// //     avatarIcon: 'tabler-users',
// //     avatarColor: 'primary',
// //     change: 'positive',
// //     changeNumber: '29%',
// //     subTitle: 'Total User'
// //   },
// //   {
// //     title: 'Paid Users',
// //     value: '4,567',
// //     avatarIcon: 'tabler-user-plus',
// //     avatarColor: 'error',
// //     change: 'positive',
// //     changeNumber: '18%',
// //     subTitle: 'Last week analytics'
// //   },
// //   {
// //     title: 'Active Users',
// //     value: '19,860',
// //     avatarIcon: 'tabler-user-check',
// //     avatarColor: 'success',
// //     change: 'negative',
// //     changeNumber: '14%',
// //     subTitle: 'Last week analytics'
// //   },
// //   {
// //     title: 'Blocked User',
// //     value: '237',
// //     avatarIcon: 'tabler-user-search',
// //     avatarColor: 'warning',
// //     change: 'positive',
// //     changeNumber: '42%',
// //     subTitle: 'Last week analytics'
// //   }
// // ]

// const UserListCards = ({ data }) => {
//   useEffect(() => {
//     console.log('rec', data)
//   }, [data])
//   const dataMap = {}
//   data?.forEach(item => {
//     dataMap[item.label] = item.data
//   })

//   const dataAnalytic = [
//     {
//       title: 'Total Users',
//       value: <CountUp start={0} end={dataMap?.totalUsers || '0'} />,
//       avatarIcon: 'tabler-users',
//       avatarColor: 'primary',
//       change: 'positive',
//       changeNumber: '29%',
//       subTitle: 'Total User'
//     },
//     {
//       title: 'Highest Paw Points',
//       value: <CountUp start={0} end={dataMap.highestPawpoints?.pawPoints || '0'} />,

//       avatarIcon: 'tabler-user-plus',
//       avatarColor: 'error',
//       change: 'positive',
//       changeNumber: '18%',
//       subTitle: 'Last week analytics'
//     },
//     {
//       title: 'Highest Pets',
//       value: <CountUp start={0} end={dataMap.highestPets?.petCount || '0'} />,
//       avatarIcon: 'tabler-user-check',
//       avatarColor: 'success',
//       change: 'negative',
//       changeNumber: '14%',
//       subTitle: 'Last week analytics'
//     },
//     {
//       title: 'Blocked Users',
//       value: <CountUp start={0} end={dataMap.blockedUsers || '0'} />,
//       avatarIcon: 'tabler-user-search',
//       avatarColor: 'warning',
//       change: 'positive',
//       changeNumber: '42%',
//       subTitle: 'Last week analytics'
//     }
//   ]
//   return (
//     <Grid container spacing={6}>
//       {dataAnalytic?.map((item, i) => (
//         <Grid key={i} item xs={12} sm={6} md={3}>
//           <HorizontalWithSubtitle {...item} />
//         </Grid>
//       ))}
//     </Grid>
//   )
// }

// export default UserListCards

import { useEffect } from 'react'

import CountUp from 'react-countup'

// MUI Imports
import Grid from '@mui/material/Grid'

// React Slick Imports
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'
const UserListCards = ({ data }) => {
  useEffect(() => {
    console.log('Received Data:', data)
  }, [data])

  const dataMap = {}
  data?.forEach(item => {
    dataMap[item.label] = item.data
  })

  // Data analytic array
  const dataAnalytic = [
    {
      title: 'Total Users',
      value: <CountUp start={0} end={dataMap?.totalUsers || 0} />,
      avatarIcon: 'tabler-users',
      avatarColor: 'primary',
      change: 'positive',
      changeNumber: '29%',
      subTitle: 'Total Users'
    },
    {
      title: 'Total Courses',
      value: <CountUp start={0} end={dataMap?.totalCourses || 0} />,
      avatarIcon: 'tabler-user-plus',
      avatarColor: 'error',
      change: 'positive',
      changeNumber: '18%',
      subTitle: 'Highest User in Course'
    },
    {
      title: 'Total Streams',
      value: <CountUp start={0} end={dataMap?.totalStreams || 0} />,
      avatarIcon: 'tabler-user-check',
      avatarColor: 'success',
      change: 'negative',
      changeNumber: '14%',
      subTitle: 'Highest User in Stream'
    }
  ]

  // React Slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  return (
    <Slider {...settings}>
      {dataAnalytic?.map((item, i) => (
        <Grid key={i} item>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Slider>
  )
}

export default UserListCards
