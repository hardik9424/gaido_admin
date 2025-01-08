// // Third-party Imports
// import 'react-perfect-scrollbar/dist/css/styles.css'

// // Style Imports
// import '@/app/globals.css'

// // Generated Icon CSS Imports
// import '@assets/iconify-icons/generated-icons.css'

// export const metadata = {
//   title: 'Vuexy - MUI Next.js Admin Dashboard Template',
//   description:
//     'Vuexy - MUI Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
// }

// const RootLayout = ({ children }) => {
//   // Vars
//   const direction = 'ltr'

//   return (
//     <html id='__next' lang='en' dir={direction}>
//       <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
//     </html>
//   )
// }

// export default RootLayout

// src/app/layout.jsx

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import Providers from './Provider'

// Providers Import
export const metadata = {
  title: {
    template: '%s Gaido',
    default: 'Welcome Gaido'
  },
  description: 'Admin Panel to Manage Users'
}

const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <head>
        <title>{metadata.title.default}</title>
        <meta name='description' content={metadata.description} />
        <link rel='icon' type='image/png' href='images/loader/gaido_vector.png' sizes='32x32' />
        <link rel='apple-touch-icon' sizes='180x180' href='images/loader/gaido_vector.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='images/loader/gaido_vector.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='images/loader/gaido_vector.png' />
        <link rel='manifest' href='images/loader/gaido_vector.png' />
        <link rel='mask-icon' href='images/loader/gaido_vector.png' color='#5bbad5' />
        <meta name='msapplication-TileColor' href='images/loader/gaido_vector.png' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </head>

      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
