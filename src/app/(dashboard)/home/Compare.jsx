// 'use client'

// // Next Imports
// import dynamic from 'next/dynamic'

// // MUI Imports
// import Card from '@mui/material/Card'
// import { useColorScheme, useTheme } from '@mui/material/styles'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'

// // Util Imports
// import { rgbaToHex } from '@/utils/rgbaToHex'

// // Styled Component Imports
// const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// // Vars
// const radialBarColors = {
//   series1: '#fdd835',
//   series2: '#32baff',
//   series3: '#00d4bd',
//   series4: '#7367f0',
//   series5: '#FFA1A1'
// }

// const ApexRadialBarChart = ({ serverMode }) => {
//   // Hooks
//   const theme = useTheme()
//   const { mode } = useColorScheme()

//   // Vars
//   const _mode = (mode === 'system' ? serverMode : mode) || serverMode
//   const textSecondary = rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.7)`)

//   const options = {
//     stroke: { lineCap: 'round' },
//     labels: ['Paid User', 'Free User'],
//     legend: {
//       show: true,
//       fontSize: '13px',
//       position: 'bottom',
//       labels: {
//         colors: textSecondary
//       },
//       markers: {
//         offsetX: theme.direction === 'rtl' ? 7 : -4
//       },
//       itemMargin: {
//         horizontal: 9
//       }
//     },
//     colors: [radialBarColors.series1, radialBarColors.series2],
//     plotOptions: {
//       radialBar: {
//         hollow: { size: '30%' },
//         track: {
//           margin: 15,
//           background: theme.palette.customColors.trackBg
//         },
//         dataLabels: {
//           name: {
//             fontSize: '2rem'
//           },
//           value: {
//             fontSize: '15px',
//             fontWeight: 500,
//             color: textSecondary
//           },
//           total: {
//             show: true,
//             fontWeight: 500,
//             label: 'Users',
//             fontSize: '1.125rem',
//             color: rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.9)`),
//             formatter: function (w) {
//               const totalValue =
//                 w.globals.seriesTotals.reduce((a, b) => {
//                   return a + b
//                 }, 0) / w.globals.series.length

//               if (totalValue % 1 === 0) {
//                 return totalValue + '%'
//               } else {
//                 return totalValue.toFixed(2) + '%'
//               }
//             }
//           }
//         }
//       }
//     },
//     grid: {
//       padding: {
//         top: -35,
//         bottom: -30
//       }
//     }
//   }

//   return (
//     <Card>
//       <CardHeader title='Statistics' />
//       <CardContent>
//         <AppReactApexCharts type='radialBar' width='100%' height={400} options={options} series={[80, 50, 35]} />
//       </CardContent>
//     </Card>
//   )
// }

// export default ApexRadialBarChart


'use client'

// Next Imports
import { useEffect } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import { useColorScheme, useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Util Imports
import { rgbaToHex } from '@/utils/rgbaToHex'
import { getAllUser } from '@/app/api'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
const radialBarColors = {
  series1: '#fdd835',
  series2: '#32baff',
}



const ApexRadialBarChart = ({ serverMode }) => {
  // Hooks
  const theme = useTheme()
  const { mode } = useColorScheme()

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode
  const textSecondary = rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.7)`)

  const options = {
    stroke: { lineCap: 'round' },
    labels: ['Paid User', 'Free User'],
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      labels: {
        colors: textSecondary
      },
      markers: {
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      itemMargin: {
        horizontal: 9
      }
    },
    colors: [radialBarColors.series1, radialBarColors.series2],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: theme.palette.customColors.trackBg
        },
        dataLabels: {
          name: {
            fontSize: '2rem'
          },
          value: {
            fontSize: '15px',
            fontWeight: 500,
            color: textSecondary
          },
          total: {
            show: true,
            fontWeight: 500,
            label: 'Users',
            fontSize: '1.125rem',
            color: rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.9)`),
            formatter: function (w) {
              const totalValue =
                w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0) / w.globals.series.length

              if (totalValue % 1 === 0) {
                return totalValue + '%'
              } else {
                return totalValue.toFixed(2) + '%'
              }
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    }
  }

  useEffect(() => {
    async function getAll() {
      const response = await getAllUser()

      console.log(response)

    }

    getAll()

  }, [])

  return (
    <>
      <CardHeader title='Statistics' />
      <CardContent>
        <AppReactApexCharts type='radialBar' width='100%' height={400} options={options} series={[80, 50]} />
      </CardContent>
    </>
  )
}

export default ApexRadialBarChart

