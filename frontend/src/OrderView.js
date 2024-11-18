/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import OrderAlign from './components/OrderAlign';
import { useState, useEffect } from 'react';

function OrderView() {
  const [ waitingOrders, setWaitingOrders ] = useState(null)
  const [ waitingOrdersPending, setWaitingOrdersPending ] = useState(true)
  const [ callingOrders, setCallingOrders ] = useState(null)
  const [ callingOrdersPending, setCallingOrdersPending ] = useState(true)
  useEffect(() => {
    fetch('http://127.0.0.1:1323/waiting-orders')
    .then(res => {
      return res.json()
    })
    .then(data => {
      setWaitingOrders(data)
      setWaitingOrdersPending(false)
    })
    fetch('http://127.0.0.1:1323/calling-orders')
    .then(res => {
      return res.json()
    })
    .then(data => {
      setCallingOrders(data)
      setCallingOrdersPending(false)
    })
  }, [])
  useEffect(() => {
    console.log(waitingOrders)
  })
  return (
    <>
      <Header />
      <Flex
        containerCss={css`
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: 0;
        `}
      >
        <p>お呼び出し</p>
        <OrderAlign endpoint={'calling-orders'} />
        <p>作成中</p>
        <OrderAlign endpoint={'waiting-orders'} />
      </Flex>
    </>
  );
}

export default OrderView
