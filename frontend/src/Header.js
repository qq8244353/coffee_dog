/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Link } from 'react-router-dom';
import Flex from './components/Flex';

function Header() {
  return (
    <header
      css={css`
        color: red;
      `}
    >
      <Flex
        containerCss={css`
          justify-content: center
        `}
      >
        <Link to="/">応用数学研究部</Link>
      </Flex>
    </header>
  );
}

export default Header;
