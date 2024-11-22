import Header from '../Header'
import OrderView from '../components/OrderView';
import SalesChart from '../components/SalesChart';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function App() {
  const [value, setValue] = useState("1")
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Header />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="呼び出し番号" value="1" />
            <Tab label="Day1 売り上げグラフ" value="2" />
            <Tab label="Day2 売り上げグラフ" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <OrderView />
        </TabPanel>
        <TabPanel value="2">
          <SalesChart day={1}/>
        </TabPanel>
        <TabPanel value="3">
          <SalesChart day={2}/>
        </TabPanel>
      </TabContext>
    </>
  );
}

export default App
