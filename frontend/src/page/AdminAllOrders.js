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

import GetBaseURL from '../utils/GetBaseURL';

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


export default function AdminAllOrders() {
  const [modal, setModal] = useState(false)
  const [ adminOrders, setAdminOrders ] = useState(null)
  const [ adminOrdersPending, setAdminOrdersPending ] = useState(true)

  const loadData = () => {
    setAdminOrdersPending(true)
    fetch(`${GetBaseURL()}/admin-orders`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      if (data) {
        setAdminOrders(data)
        setAdminOrdersPending(false)
      }
    })
  }

  return (
    <>
      <Header />
      <Grid size={12}>
        <AdminOffer adminOrders={adminOrders} adminOrdersPending={adminOrdersPending} loadData={loadData} uniqueKeySuffix={'admin-all-orders'}/>
      </Grid>
    </>
  );
}
