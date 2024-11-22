/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import GetBaseURL from '../utils/GetBaseURL';

function AdminButton(props) {
  const { children, endpoint, saleId, color, disabled, loadData, onClick = () => {
      fetch(`${GetBaseURL()}/admin-orders`, {
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
        loadData()
      })
      .catch(err => {
        console.log(err)
      })
    }
  } = props

  return (
    <Button 
      sx={{
        width: 70,
        height:70,
      }}
      color={color}
      disabled={disabled}
      variant="contained"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
export default AdminButton
