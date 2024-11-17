/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

function AdminButton(props) {
  const { name, endpoint, saleId } = props
  return (
    <button onClick={() => {
      fetch('http://127.0.0.1:1324/admin-orders', {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sale_id: saleId,
          kind: endpoint
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
    }}>
      {name}
    </button>
  )
}
export default AdminButton
