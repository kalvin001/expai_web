import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import axios from 'axios';
 
//const url = 'http://127.0.0.1:9001/factor';
const App: React.FC = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // 获取数据的 API 地址
    const url = 'http://127.0.0.1:9001/stg/factor';

    axios.get(url).then((response) => {
      setData(response.data.data);
      // 根据元数据构建列定义
      const generatedColumns = response.data.columns.map((col, index) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key,
        fixed: index === 0 ? 'left' : undefined,
        // 如果元数据中的 link 为 true，则使用链接渲染文本
        render: col.link ? (text) => <a href={`/model/factor/detail?name=${text}`}>{text}</a> : undefined,
      }));
      setColumns(generatedColumns); 
    }).catch((error) => {
      console.error('An error occurred while fetching data:', error);
    });
  }, []);

  return <Table columns={columns} dataSource={data} scroll={{ x: 'max-content' }} />;
};

export default App;