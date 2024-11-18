/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Flex from './Flex'

function AdminInput(props) {
  const { value, setValue, name } = props
  return (
    <Flex>
      <span>{name}</span>
      <span>{value}</span>
      <button onClick={() => { setValue(value + 1)}}>+1</button>
      <button onClick={() => { setValue(Math.max(value - 1, 0))}}>+1</button>
    </Flex>
  )
}
export default AdminInput
