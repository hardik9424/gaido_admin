'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'


import { PersonAdd } from '@mui/icons-material'

// Component Imports
import RoleDialog from '@components/dialogs/role-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import Link from '@components/Link'

// Vars
const cardData = [
  // { totalUsers: 4, title: 'Administrator', avatars: ['1.png', '2.png', '3.png', '4.png'] },
  // { totalUsers: 7, title: 'Editor', avatars: ['5.png', '6.png', '7.png'] }
  // { totalUsers: 5, title: 'Users', avatars: ['4.png', '5.png', '6.png'] },
  // { totalUsers: 6, title: 'Support', avatars: ['1.png', '2.png', '3.png'] },
  // { totalUsers: 10, title: 'Restricted User', avatars: ['4.png', '5.png', '6.png'] }
]

const RoleCards = () => {
  // Vars
  const typographyProps = {
    children: ['Edit Role'],
    component: Link,
    color: 'primary',
    onClick: e => e.preventDefault()
  }

  const CardProps = {
    className: 'cursor-pointer bs-full',
    children: (
      <Grid container className='bs-full'>
        <Grid item xs={5}>
          <div className='flex items-center justify-center bs-full'>
            {/* <img alt='add-role' src='/images/loader/gaido_vector.png' height={40} width={40} />
             */}
            <IconButton
              sx={{
                background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                color: 'white',
                '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
              }}
            >
              <PersonAdd />
            </IconButton>
          </div>
        </Grid>
        <Grid item xs={7}>
          <CardContent>
            <div className='flex flex-col items-end gap-4 text-right'>
              <Button
                variant='contained'
                sx={{
                  background: 'linear-gradient(270deg, rgba(17, 129, 123, 0.7) 0%, #11817B 100%) !important',
                  color: 'white',
                  '&:hover': { background: 'linear-gradient(90deg, #388E3C, #1C3E2B)' }
                }}
                size='small'
              >
                Add Role
              </Button>
              <Typography>
                Add new role, <br />
                if it doesn&#39;t exist.
              </Typography>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        {cardData?.map((item, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <Typography className='flex-grow'>{`Total ${item.totalUsers} users`}</Typography>
                  <AvatarGroup total={item.totalUsers}>
                    {item.avatars.map((img, index) => (
                      <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                    ))}
                  </AvatarGroup>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col items-start gap-1'>
                    <Typography variant='h5'>{item.title}</Typography>
                    {/* <OpenDialogOnElementClick
                      element={Typography}
                      elementProps={typographyProps}
                      dialog={RoleDialog}
                      dialogProps={{ title: item.title }}
                    /> */}
                  </div>
                  {/* <IconButton className='p-[7px]'>
                    <i className='tabler-copy text-secondary' />
                  </IconButton> */}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} lg={4}>
          <OpenDialogOnElementClick element={Card} elementProps={CardProps} dialog={RoleDialog} />
        </Grid>
      </Grid>
    </>
  )
}

export default RoleCards
