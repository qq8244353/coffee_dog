/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from '../components/Flex';
import AdminRegister from '../AdminRegister';
import AdminOffer from '../AdminOffer';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';

function Admin() {
  return (
    <>
      <Header />
      <Grid container spacing={2}>
        <Grid size={6}>
          <AdminRegister />
        </Grid>
        <Grid size={6}>
          <AdminOffer />
        </Grid>
      </Grid>
    </>
  );
}

export default Admin
