/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from '../components/Flex';
import AdminRegister from '../components/AdminRegister';
import AdminOffer from '../components/AdminOffer';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function Admin() {
  const [modal, setModal] = useState(false)
  const [ adminOrders, setAdminOrders ] = useState(null)
  const [ adminOrdersPending, setAdminOrdersPending ] = useState(true)

  const loadData = () => {
    console.log("loaded")
    setAdminOrdersPending(true)
    fetch('http://127.0.0.1:1323/admin-orders')
    .then(res => {
      return res.json()
    })
    .then(data => {
      setAdminOrders(data)
      setAdminOrdersPending(false)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <Header />
      <Grid container spacing={2}>
        <Grid size={6}>
          <AdminRegister loadData={loadData} setModal={setModal} />
        </Grid>
        <Grid size={6}>
          <AdminOffer adminOrders={adminOrders} adminOrdersPending={adminOrdersPending} loadData={loadData} />
        </Grid>
      </Grid>
    </>
  );
}

export default Admin
