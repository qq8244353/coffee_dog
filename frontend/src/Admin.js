/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import AdminRegister from './AdminRegister';
import AdminOffer from './AdminOffer';
import { useState, useEffect } from 'react';

function Admin() {
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
        <AdminRegister />
        <AdminOffer />
      </Flex>
    </>
  );
}

export default Admin
