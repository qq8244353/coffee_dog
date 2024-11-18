/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'
import Flex from './components/Flex';
import AdminButton from './components/AdminButton';
import AdminInput from './components/AdminInput';
import { useState, useEffect } from 'react';

function AdminRegister() {
  const [hotCoffee, setHotCoffee] = useState(0)
  const [iceCoffee, setIceCoffee] = useState(0)
  const [specialHotCoffee, setSpecialHotCoffee] = useState(0)
  const [specialIceCoffee, setSpecialIceCoffee] = useState(0)
  const [lemonade, setLemonade] = useState(0)
  const [mapleMadeleine, setMapleMadeleine] = useState(0)
  const [amandeChocolat, setAmandeChocolat] = useState(0)
  return (
    <Flex
      containerCss={css`
        flex-direction: column;
      `}
    >
      <AdminInput value={hotCoffee} setValue={setHotCoffee} name="ホットコーヒー" />
      <AdminInput value={iceCoffee} setValue={setIceCoffee} name="アイスコーヒー" />
      <AdminInput value={specialHotCoffee} setValue={setSpecialHotCoffee} name="ホットコーヒー + オプション" />
      <AdminInput value={specialIceCoffee} setValue={setSpecialIceCoffee} name="アイスコーヒー + オプション" />
      <AdminInput value={lemonade} setValue={setLemonade} name="レモネード" />
      <AdminInput value={mapleMadeleine} setValue={setMapleMadeleine} name="メイプルマドレーヌ" />
      <AdminInput value={amandeChocolat} setValue={setAmandeChocolat} name="アマンドショコラ" />
      <span>
        合計金額 
        {
          (hotCoffee + iceCoffee) * 250 +
          (specialHotCoffee + specialIceCoffee + lemonade) * 300 +
          (mapleMadeleine + amandeChocolat) * 220
        } 円
      </span>
      <button onClick={() => {
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
        fetch('http://127.0.0.1:1324/admin-orders', {
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
        .then(data => {
            console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
      }}>登録</button>
    </Flex>
  );
}

export default AdminRegister
