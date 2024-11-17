/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import { useState, useEffect } from 'react';

function OrderView() {
  const [ waitingOrders, setWaitingOrders ] = useState(null)
  const [ isPending, setIsPending ] = useState(true)
  useEffect(() => {
    fetch('http://127.0.0.1:1324/waiting-orders')
    .then(res => {
      return res.json()
    })
    .then(data => {
      setWaitingOrders(data)
      setIsPending(false)
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
        <Flex
          containerCss={css`
            width: 40em;
            border: 1px solid;
            flex-wrap: wrap;
            justify-content: flex-start;
          `}
        >
          { isPending && <div> Loading... </div> }
          { !isPending && <div> Loaded </div> }
        </Flex>
        <Flex
          containerCss={css`
            width: 40em;
            border: 1px solid;
            flex-wrap: wrap;
            justify-content: flex-start;
          `}
        >
          { isPending && <div> Loading... </div> }
          { !isPending && waitingOrders.map(order => (
            <div 
              className="waitingOrder"
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
      </Flex>
    </>
  );
}

export default OrderView
