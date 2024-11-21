/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import AdminButton from './components/AdminButton';
import AdminInput from './components/AdminInput';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminOffer() {
  const [ adminOrders, setAdminOrders ] = useState(null)
  const [ adminOrdersPending, setAdminOrdersPending ] = useState(true)
  useEffect(() => {
    fetch('http://127.0.0.1:1324/admin-orders')
    .then(res => {
      return res.json()
    })
    .then(data => {
      setAdminOrders(data)
      setAdminOrdersPending(false)
    })
  }, [])
  useEffect(() => {
    console.log(adminOrders)
  })
  return (
    <Stack
      spacing={{ xs: 1, sm: 2 }}
      useFlexGap
      sx={{ flexWrap: 'wrap' }}
    >
      { adminOrdersPending && <div> Loading... </div> }
      { !adminOrdersPending && adminOrders.map(order => {
        let color = 'red'
        if (!order.is_created) {
          color = '#B7FFFF'
        } else if (!order.is_handed_over) {
          color = '#B7FFDB'
        } else {
          color = '#DBFFB7'
        }
        return (
          <Stack
            key={order.index}
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
                      <Box sx={{ typography: 'body1' }}>{item.item_name}: {item.cnt}個</Box>
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
                <AdminButton endpoint="created" saleId={order.sale_id} color='success' disabled={order.is_created}>
                  <CheckCircleIcon />
                </AdminButton>
                <AdminButton endpoint="handed over" saleId={order.sale_id} color='info' disabled={!order.is_created || order.is_handed_over}>
                  <ChangeCircleIcon />
                </AdminButton>
                <AdminButton endpoint="canceled" saleId={order.sale_id} color='error'>
                  <DeleteIcon />
                </AdminButton>
              </Box>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  );
}

export default AdminOffer
