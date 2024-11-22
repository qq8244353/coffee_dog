/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from '../Header'
import Flex from './Flex';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import GetBaseURL from '../utils/GetBaseURL';

function AdminRegister({ loadData }) {
  const [hotCoffee, setHotCoffee] = useState(0)
  const [iceCoffee, setIceCoffee] = useState(0)
  const [specialHotCoffee, setSpecialHotCoffee] = useState(0)
  const [specialIceCoffee, setSpecialIceCoffee] = useState(0)
  const [lemonade, setLemonade] = useState(0)
  const [mapleMadeleine, setMapleMadeleine] = useState(0)
  const [amandeChocolat, setAmandeChocolat] = useState(0)
  const [modal, setModal] = useState(false)
  const [saleId, setSaleId] = useState(null)
  return (
    <>
      <List>
        <AdminInput value={hotCoffee} setValue={setHotCoffee} name="ホットコーヒー" />
        <AdminInput value={iceCoffee} setValue={setIceCoffee} name="アイスコーヒー" />
        <AdminInput value={specialHotCoffee} setValue={setSpecialHotCoffee} name="ホットコーヒー + オプション" />
        <AdminInput value={specialIceCoffee} setValue={setSpecialIceCoffee} name="アイスコーヒー + オプション" />
        <AdminInput value={lemonade} setValue={setLemonade} name="レモネード" />
        <AdminInput value={mapleMadeleine} setValue={setMapleMadeleine} name="メイプルマドレーヌ" />
        <AdminInput value={amandeChocolat} setValue={setAmandeChocolat} name="アマンドショコラ" />
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Box sx={{ width: 400, typography: 'body2', fontSize: 24 }} >
            合計金額 
            {
              (hotCoffee + iceCoffee) * 250 +
              (specialHotCoffee + specialIceCoffee + lemonade) * 300 +
              (mapleMadeleine + amandeChocolat) * 220
            } 円
          </Box>
          <Button
            variant="contained"
            disabled={hotCoffee + iceCoffee + specialHotCoffee + specialIceCoffee + lemonade + mapleMadeleine + amandeChocolat == 0}
            onClick={() => {
              let items = []
              if (hotCoffee > 0) {
                items.push({item_id: 10, cnt: hotCoffee })
              }
              if (iceCoffee > 0) {
                items.push({item_id: 11, cnt: iceCoffee })
              }
              if (specialHotCoffee > 0) {
                items.push({item_id: 12, cnt: specialHotCoffee })
              }
              if (specialIceCoffee > 0) {
                items.push({item_id: 13, cnt: specialIceCoffee })
              }
              if (lemonade > 0) {
                items.push({item_id: 20, cnt: lemonade })
              }
              if (mapleMadeleine > 0) {
                items.push({item_id: 30, cnt: mapleMadeleine })
              }
              if (amandeChocolat > 0) {
                items.push({item_id: 31, cnt: amandeChocolat })
              }
              if (items.length > 0) {
                fetch(`http://localhost:1324/admin-orders`, {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    items: items,
                    register_person_id: 0,
                  })
                })
                .then(res => {
                  if (res.ok) {
                    return res.json()
                  } else {
                    console.log(res.text())
                  }
                })
                .then(saleId => {
                  setModal(true)
                  setSaleId(saleId.message)
                  loadData()
                })
                .catch(err => {
                  console.log(err)
                })
              }
            }}
          >
            登録
          </Button>
        </Box>
      </List>
      <Modal
        open={modal}
        onClose={() => {setModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box>
            <Typography
              sx={{
                display: 'inline',
                fontSize: 20
              }}
            >
              受け取り番号:
            </Typography>
            <Typography
              sx={{
                display: 'inline',
                fontSize: 40
              }}
            >
              {saleId}
            </Typography>
          </Box>
          {hotCoffee > 0 && <Typography>ホットコーヒー{hotCoffee}個</Typography>}
          {iceCoffee > 0 && <Typography>アイスコーヒー{iceCoffee}個</Typography>}
          {specialHotCoffee > 0 && <Typography>ホットコーヒー + オプション{specialHotCoffee}個</Typography>}
          {specialIceCoffee > 0 && <Typography>アイスコーヒー + オプション{specialIceCoffee}個</Typography>}
          {lemonade > 0 && <Typography>レモネード{lemonade}個</Typography>}
          {mapleMadeleine > 0 && <Typography>メイプルマドレーヌ{mapleMadeleine}個</Typography>}
          {amandeChocolat > 0 && <Typography>アマンドショコラ{amandeChocolat}個</Typography>}
          <Button 
            sx={{
            }}
            variant="contained"
            onClick={() => {
              setHotCoffee(0)
              setIceCoffee(0)
              setSpecialHotCoffee(0)
              setSpecialIceCoffee(0)
              setLemonade(0)
              setMapleMadeleine(0)
              setAmandeChocolat(0)
              setModal(false)
              setSaleId(null)
            }}
          >
            閉じる
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default AdminRegister
