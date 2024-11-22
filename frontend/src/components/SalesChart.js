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

export default function SalesChart() {
  const [dataset, setDataset] = useState([])
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
          { dataKey: 'hotCoffee', label: 'ホットコーヒー', stack: 'drink', color: '#5d4037' },
          { dataKey: 'iceCoffee', label: 'アイスコーヒー', stack: 'drink', color: '#5d4037' },
          { dataKey: 'lemonade', label: 'レモネード', stack: 'drink', color: '#ffee58' },
          { dataKey: 'madeleine', label: 'メイプルマドレーヌ', stack: 'sweets', color: '#ff9800' },
          { dataKey: 'chocolat', label: 'アマンドショコラ', stack: 'sweets', color: '#bcaaa4' },
          { dataKey: 'journal', label: '部誌', stack: 'jornal', color: '#b0bec5' },
          { dataKey: 'option', label: 'ハンドドリップオプション', stack: 'option', color: '#212121' }
      ]}
      width={1000}
      height={350}
    />
  )
}
