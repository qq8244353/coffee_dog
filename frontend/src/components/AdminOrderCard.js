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

export default function AdminOrderCard({order, loadData, setCancelingSaleId, setModal}) {
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
  );
}
