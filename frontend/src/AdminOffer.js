/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import AdminButton from './components/AdminButton';
import AdminInput from './components/AdminInput';
import { useState, useEffect } from 'react';

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
          key={order.index}
          containerCss={css`
            width: 40em;
            height: 5em;
          `}
        >
          <span>{order.sale_id}</span>
          <span>{(() => {
            const date = new Date(Date.parse(order.time))
            return `${date.getDate()}日 ${date.getHours()}時${date.getMinutes()}時`
          })()}</span>
          <ul>
            {order.items.map(item => {
              return (
                <li>
                  <span>{item.item_name}: {item.cnt}個</span>
                </li>
              )
            })}
          </ul>
          {(() => {
            if (!order.is_created) {
              return <p>作成待ち</p>
            } else if (!order.is_handed_over) {
              return <p>受け取り待ち</p>
            } else {
              return <p>受け渡し完了</p>
            }
          })()}
          <AdminButton name="完成" endpoint="created" saleId={order.sale_id}/>
          <AdminButton name="受け渡し完了" endpoint="handed over" saleId={order.sale_id}/>
          <AdminButton name="削除" endpoint="canceled" saleId={order.sale_id}/>
        </Flex>
      ))}
    </Flex>
  );
}

export default AdminOffer
