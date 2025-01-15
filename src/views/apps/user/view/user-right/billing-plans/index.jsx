// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CurrentPlan from './CurrentPlan'
import PaymentMethod from './PaymentMethod'
import BillingAddress from './BillingAddress'
// import Community from "../../../../../../app/(dashboard)/community/page"
import UserCommunity from '@/components/usercategory/UserCommunity'
import Userchat from '@/components/userchat/Userchat'
//for now already created components are used , but in future create a component or get from full version and use here by making a component in this folder and using it 

//for now current plan is used for community page

const BillingPlans = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <CurrentPlan data={data} /> */}
        {/* <Community /> */}
        <UserCommunity />
      </Grid>
      {/* <Grid item xs={12}>
        <PaymentMethod />
        

      </Grid> */}
      {/* <Userchat/> */}
      {/* <Grid item xs={12}>
        <BillingAddress />
      </Grid> */}
    </Grid>
  )
}

export default BillingPlans
