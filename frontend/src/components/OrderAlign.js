/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Flex from './Flex';
import { useState, useEffect } from 'react';

function OrderAlign({endpoint}) {
  const [ orders, setOrders ] = useState(null)
  const [ ordersPending, setOrdersPending ] = useState(true)
  useEffect(() => {
    fetch(`http://127.0.0.1:1323/${endpoint}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      setOrders(data)
      setOrdersPending(false)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  return (
    <Flex
      containerCss={css`
        width: 40em;
        border: 1px solid;
        flex-wrap: wrap;
        justify-content: flex-start;
      `}
    >
      { ordersPending && <div> Loading... </div> }
      { !ordersPending && orders.map(order => (
        <div 
          key={order.sale_id}
          css={css`
            width: 5em;
            height: 5em;
          `}
        >
          <p>{order.sale_id}</p>
        </div>
      ))}
    </Flex>
  );
}

export default OrderAlign
