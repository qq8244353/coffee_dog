/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

function Flex(props) {
  const { children, containerCss } = props
  return (
    <div
      css={[
        css`
          width: 100%;
          height: 100%;
          display: flex;
          margin: 0 auto;
        `,
        containerCss
      ]}
    >
      {children}
    </div>
  )
}
export default Flex
