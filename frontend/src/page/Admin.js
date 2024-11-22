/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from '../components/Flex';
import AdminRegister from '../AdminRegister';
import AdminOffer from '../AdminOffer';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Admin() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <Header />
      <Grid container spacing={2}>
        <Grid size={6}>
          <AdminRegister setModal={setModal} />
        </Grid>
        <Grid size={6}>
          <AdminOffer />
        </Grid>
      </Grid>
      <Modal
        open={modal}
        onClose={() => {setModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          cx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default Admin
