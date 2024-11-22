/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from './Flex';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';
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
        { adminOrdersPending && <div> Loading... </div> }
        { !adminOrdersPending && adminOrders.map(order => {
          return (
            <Stack
              key={order.sale_id}
              spacing={{ xs: 1, sm: 2 }}
              direction="row"
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  p: 4,
                  minWidth: 300,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    width: 320
                  }}
                >
                  <Box>
                    <Box sx={{ color: 'text.priamary', fontSize: 34 }}>{order.sale_id}</Box>
                    <Box sx={{ color: 'text.secondary' }}>
                      {(() => {
                        const date = new Date(Date.parse(order.time))
                        return `${date.getDate()}日 ${date.getHours()}時${date.getMinutes()}分`
                      })()}
                    </Box>
                    <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                      {(() => {
                        if (!order.is_created) {
                          return '作成待ち'
                        } else if (!order.is_handed_over) {
                          return '受け取り待ち'
                        } else {
                          return '受け渡し完了'
                        }
                      })()}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      mx: 2,
                    }}
                  >
                    {order.items.map(item => {
                      return (
                        <Box 
                          key={`${order.sale_id}${item.item_name}`}
                          sx={{ typography: 'body1' }}
                        >
                          {item.item_name}: {item.cnt}個
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
                <Box
                 sx={{
                  mt: 2,
                  display: 'flex',
                  gap: 2,
                 }}
                >
                  <AdminButton endpoint="created" saleId={order.sale_id} color='success' loadData={loadData} disabled={order.is_created}>
                    <CheckCircleIcon />
                  </AdminButton>
                  <AdminButton endpoint="handed over" saleId={order.sale_id} color='info' loadData={loadData} disabled={!order.is_created || order.is_handed_over}>
                    <ChangeCircleIcon />
                  </AdminButton>
                  <AdminButton endpoint="canceled" saleId={order.sale_id} color='error' onClick = {() => {
                    setCancelingSaleId(order.sale_id)
                    setModal(true)
                  }}>
                    <DeleteIcon />
                  </AdminButton>
                </Box>
              </Box>
            </Stack>
          )
        })}
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
