// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { Box } from '@mui/material'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const HorizontalWithSubtitle = props => {
  // Props
  const { title, value, avatarIcon, avatarColor, change, changeNumber, subTitle } = props

  return (
    <Card>
      {/* <CardContent> */}
      <Box display="flex" justifyContent="space-between" gap={1} padding={2} >
        <Box display="flex" flexDirection="column" gap={1} flexGrow={1} >
          <Box display="flex" justifyContent="space-between">
            <Typography variant='' style={{ fontSize: '16px' }} color="text.primary">{title}</Typography>
            <CustomAvatar color={avatarColor} skin="light" variant="rounded" size={42}>
              <i className={classnames(avatarIcon, 'text-[26px]')} />
            </CustomAvatar>
          </Box>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="h5">{value}</Typography>
            <Typography color={change === 'negative' ? 'error.main' : 'success.main'}>
              {/* {`(${change === 'negative' ? '-' : '+'}${changeNumber})`} */}
            </Typography>
          </Box>
          <Typography variant="body2" style={{ fontSize: '13px' }}>{subTitle}</Typography>
        </Box>

      </Box>
      {/* </CardContent> */}
    </Card>
  )
}

export default HorizontalWithSubtitle
