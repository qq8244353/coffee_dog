/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Flex from './Flex'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function AdminInput(props) {
  const { value, setValue, name } = props
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <Box sx={{ width: 400, typography: 'body2', fontSize: 24 }} >{name}</Box>
      <Box sx={{ mx: 6, typography: 'body1', fontSize: 32 }} >{value}</Box>
      <Button
        sx={{
          width: 50,
          height: 50,
          p: 0,
        }}
        color="primary"
        variant="contained"
        onClick={() => { setValue(value + 1)}}
      >
        <AddIcon fontSize="small" />
      </Button>
      <Button
        sx={{
          width: 50,
          height: 50,
          p: 0,
        }}
        color='primary'
        disabled={value == 0}
        variant="contained"
        onClick={() => { setValue(value - 1)}}
      >
        <RemoveIcon fontSize="small" />
      </Button>
    </Box>
  )
}
export default AdminInput
