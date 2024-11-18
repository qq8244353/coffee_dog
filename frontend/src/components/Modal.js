/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Flex from './Flex';

function Modal({ children }) {
  return (
    <div
      css={css`
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background-color:rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      `}
    >
      <Flex
        containerCss={css`
          background-color: white;
          width: 20em;
          height: 20em;
          border-radius: 5em;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        `}
      >
        {children}
      </Flex>
    </div>
  );
}

export default Modal
