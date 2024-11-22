import OrderAlign from '../components/OrderAlign';
import Grid from '@mui/material/Grid2';

import { useState, useEffect } from 'react';

function OrderView() {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <OrderAlign name={'呼び出し中'} endpoint={'calling-orders'} />
      </Grid>
      <Grid size={6}>
        <OrderAlign name={'調理中'} endpoint={'waiting-orders'} />
      </Grid>
    </Grid>
  );
}

export default OrderView
