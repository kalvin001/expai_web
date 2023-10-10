import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import ProTable from '@ant-design/pro-table';

const KTable = ({ data }) => {  
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data && data.columns) {
      const generatedColumns = generateColumns(data.columns);
      setColumns(generatedColumns);
    }
  }, [data]);

  const generateColumns = (columns) => {
    // 你对columns的处理逻辑
    // ...
    return columns; // 返回处理后的columns
  };

  const paginationProps = {
    current: currentPage,
    pageSize: 20,
    total: data.total_cnt,
    showTotal: (total) => `共 ${data.total_cnt} 条`,
    onChange: (page) => setCurrentPage(page),
  };

  const handleTableChange = (pagination) => {
    if (pagination && 'current' in pagination) {
      setCurrentPage(pagination.current);
    }
  };

  const searchBar = () => (
    <div style={{ marginLeft: 'auto' }}>
      {/* 你的搜索条实现 */}
    </div>
  );

  const InfoBar = () => (
    <span style={{ fontSize: 'small', color: '#888' }}>
      {/* 你的InfoBar实现 */}
    </span>
  );

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data.data}
        rowKey={record => record.id}
        pagination={false}
        search={false} // 禁用搜索框

        toolBarRender={() => [searchBar()]}
        headerTitle={["明细", <InfoBar />]}
        onChange={handleTableChange}
      />
      <Pagination {...paginationProps} style={{ margin: "10px 0 0 0", float: 'right' }} />
    </>
  );
};

export default KTable;
