/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from './Flex';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';
import AdminOrderCard from './AdminOrderCard';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import GetBaseURL from '../utils/GetBaseURL';

function AdminOffer({ adminOrders, adminOrdersPending, loadData }) {
  const [ modal, setModal ] = useState(false)
  const [ cancelingSaleId, setCancelingSaleId ] = useState(null)

  useEffect(() => {
    loadData()
  }, [])
  useEffect(() => {
    console.log(adminOrders)
  })
  return (
    <> 
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
      >
        {(()  => {
          if (adminOrdersPending) {
            return (
              <Typography sx={{ fontSize: 30 }}> Loading... </Typography>
            )
          } else if (adminOrders.length === 0) {
            return (
              <Typography sx={{ fontSize: 30 }}> 注文がありません </Typography>
            )
          } else {
            return (
              <>
              {adminOrders.map(order => {
                return (
                  <AdminOrderCard key={order.index} order={order} loadData={loadData} setCancelingSaleId={setCancelingSaleId} setModal={setModal} />
                )
              })}
              </>
            )
          }
        })()}
      </Stack>
      <Modal
        open={modal}
        onClose={() => {setModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{
              fontSize: 20
            }}
          >
            本当に削除しますか？
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Button 
              variant="contained"
              onClick = {() => {
                console.log(cancelingSaleId)
                fetch(`${GetBaseURL()}/admin-orders`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    sale_id: cancelingSaleId,
                    kind: "canceled"
                  })
                })
                .then(res => {
                  if (res.ok) {
                    return res.json()
                  } else {
                      console.log(res.text())
                  }
                })
                .then(data => {
                  setModal(false)
                  setCancelingSaleId(null)
                  loadData()
                })
                .catch(err => {
                  console.log(err)
                })
              }}
            >
              削除する
            </Button>
            <Button 
              variant="contained"
              onClick = {() => {
                setCancelingSaleId(null)
                setModal(false)
              }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default AdminOffer
