/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Flex from './Flex';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import GetBaseURL from '../utils/GetBaseURL';

function OrderAlign({name, endpoint}) {
  const [ orders, setOrders ] = useState([])
  const [ ordersPending, setOrdersPending ] = useState(true)
  useEffect(() => {
    fetch(`${GetBaseURL()}/${endpoint}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      if (data) {
        setOrders(data)
        setOrdersPending(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  return (
    <Box
      cx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle" component="h2">{name}</Typography>
      <Box
        sx={{
          minHeight: 400,
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          display: 'flex',
          gap: 1,
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {(()  => {
          if (ordersPending) {
            return (
              <Typography sx={{ fontSize: 30 }}> Loading... </Typography>
            )
          } else if (orders.length === 0) {
            return (
              <Typography sx={{ fontSize: 30 }}> 注文がありません </Typography>
            )
          } else {
            return (
              orders.map(order => (
                <Box
                  key={order.sale_id}
                  cx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    bgcolor: 'background.paper',
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      color: 'text.secondary',
                      display: 'flex',
                      flexDirection: 'column',
                      width: 200,
                      height: 100,
                      boxShadow: 4,
                      p: 4,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ color: 'text.priamary', fontSize: 34 }}>{order.sale_id}</Box>
                    {order.items.map(item => {
                      return (
                        <Box
                          key={item.item_name}
                          sx={{ color: 'text.secondary' }}
                        >
                          {item.item_name}: {item.cnt}個
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              ))
            )
        }})()}
      </Box>
    </Box>
  );
}

export default OrderAlign
