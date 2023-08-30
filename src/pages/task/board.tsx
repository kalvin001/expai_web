import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import axios from 'axios';
import { baseURL } from "@/app"

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
    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div style={{ padding: '30px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="CPU Usage" value={systemData.cpu.usage} suffix="%" />
            <Statistic title="CPU Cores" value={systemData.cpu.cores} />
            <Statistic title="CPU Temperature" value={systemData.cpu.temperature} suffix="°C" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Memory Usage" value={systemData.memory.usage} suffix="%" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="GPU Load" value={systemData.gpu.info?.[0]?.load} suffix="%" />
            <Statistic title="GPU Temperature" value={systemData.gpu.info?.[0]?.gpuTemp} suffix="°C" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
