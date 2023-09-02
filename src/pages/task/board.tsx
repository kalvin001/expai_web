import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import axios from 'axios';
import { baseURL } from "@/app"
import CardLineChart from '@/components/CardLineChart';

function App() { 
 
  const [systemData, setSystemData] = useState({
    cpu: {},
    memory: {},
    gpu: {}
  });

  const fetchData = () => {
    let url = `${baseURL}/monitor_sys`
    axios.get(url)  // 假设后端 API 地址为 /api/getSystemData
      .then(response => {
        setSystemData(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch system data:', error);
      });
  };

  useEffect(() => {
    // 第一次打开时就调用
    fetchData();

    // 使用 setInterval 每 5 秒获取一次数据
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div style={{ padding: '30px' }}> 
      <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <CardLineChart cardConfig={{title: 'CPU Usage',value:systemData.cpu.usage + "%",
        values:systemData.cpu.usage_history,chartHeight: 100}}   /> 
      </Col>
      <Col xs={24} sm={12} md={8}>
      <CardLineChart cardConfig={{title: 'Memory Usage',value:systemData.memory.usage + "%",
        values:systemData.memory.usage_history,chartHeight: 100}}   /> 
      </Col>
      <Col xs={24} sm={12} md={8}>
      <CardLineChart cardConfig={{title: 'GPU Load',value:systemData.gpu.info?.[0]?.gpuLoad *100 + "%",
        values:systemData.gpu.usage_history,chartHeight: 100}}   /> 
      </Col> 
    </Row>
    </div>
  );
}

export default App;
