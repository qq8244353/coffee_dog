/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import { useState, useEffect } from 'react';

function Admin() {
  const [ adminOrders, setAdminOrders ] = useState(null)
  const [ adminOrdersPending, setAdminOrdersPending ] = useState(true)
  useEffect(() => {
    fetch('http://127.0.0.1:1323/admin-orders')
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
    <>
      <Header />
      <Flex
        containerCss={css`
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: 0;
        `}
      >
        <div>"左側"</div>
        <Flex
          containerCss={css`
            width: 40em;
            border: 1px solid;
            flex-direction: column;
            /* flex-wrap: wrap; */
            /* justify-content: flex-start; */
          `}
        >
          { adminOrdersPending && <div> Loading... </div> }
          { !adminOrdersPending && adminOrders.map(order => (
            <Flex 
              className="adminOrder"
              key={order.sale_id}
              containerCss={css`
                width: 20em;
                height: 5em;
              `}
            >
              <p>{order.sale_id}</p>
              {(() => {
                if (!order.is_created) {
                  return <p>作成待ち</p>
                } else if (!order.is_handed_over) {
                  return <p>受け取り待ち</p>
                } else {
                  return <p>受け渡し完了</p>
                }
              })()}
              <button onClick={() => {
                fetch('http://127.0.0.1:1324/admin-orders', {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    sale_id: order.sale_id,
                    kind: 'created'
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
                    console.log(data)
                })
                .catch(err => {
                  console.log(err)
                })
              }}>完成</button>
              <button>受け渡し完了</button>
              <button>削除</button>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default Admin
