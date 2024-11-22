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
import { BarChart } from '@mui/x-charts/BarChart';
// import { addLabels, balanceSheet } from './Data';

import GetBaseURL from '../utils/GetBaseURL';

export default function SalesChart({ day }) {
  const [dataset, setDataset] = useState([])
  useEffect(() => {
    // fetch(`http://localhost:1324/graph-data-day${day}`)
    fetch(`${GetBaseURL()}/graph-data-day${day}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      setDataset(data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  return (
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'time',
        },
      ]}
      series={[
          // { dataKey: 'hot_coffee', label: 'ホットコーヒー', stack: 'drink', color: '#5d4037' },
          // { dataKey: 'ice_coffee', label: 'アイスコーヒー', stack: 'drink', color: '#5d4037' },
          // { dataKey: 'lemonade', label: 'レモネード', stack: 'drink', color: '#ffee58' },
          // { dataKey: 'madeleine', label: 'メイプルマドレーヌ', stack: 'sweets', color: '#ff9800' },
          // { dataKey: 'chocolat', label: 'アマンドショコラ', stack: 'sweets', color: '#bcaaa4' },
          // { dataKey: 'journal', label: '部誌', stack: 'jornal', color: '#b0bec5' },
          // { dataKey: 'option', label: 'ハンドドリップオプション', stack: 'option', color: '#212121' }
          { dataKey: 'hot_coffee', label: 'ホットコーヒー', stack: 'drink', color: '#4caf50' },
          { dataKey: 'ice_coffee', label: 'アイスコーヒー', stack: 'drink', color: '#388e3c' },
          { dataKey: 'lemonade', label: 'レモネード', stack: 'drink', color: '#03a9f4' },
          { dataKey: 'madeleine', label: 'メイプルマドレーヌ', stack: 'sweets', color: '#ff9800' },
          { dataKey: 'chocolat', label: 'アマンドショコラ', stack: 'sweets', color: '#ffb74d' },
          { dataKey: 'journal', label: '部誌', stack: 'jornal', color: '#f44336' },
          { dataKey: 'option', label: 'ハンドドリップオプション', stack: 'option', color: '#9c27b0' }
      ]}
      width={1000}
      height={350}
    />
  )
}
