/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import OrderAlign from './components/OrderAlign';
import { useState, useEffect } from 'react';

function OrderView() {
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
