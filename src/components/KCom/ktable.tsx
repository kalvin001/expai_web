import React, { useState, useEffect } from 'react';
import { Alert, Button, Card,Image, Col, Divider, Input, Pagination, Radio, Row, Select, Space, Table,Tag } from 'antd';

import ProTable from '@ant-design/pro-table';
import { v4 as uuidv4 } from 'uuid';

const KTable = ({ data, onTableChange  }) => {  
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [sort, setSort] = useState({ field: '', order: '' }); // 排序状态

  useEffect(() => {
    // 在数据到达时动态生成唯一ID
    if (data && data.data) {
      // Debug: 打印原始数据
      //console.log("Original data: ", data.data);
      
      data.data.forEach((item, index) => {
        item.generatedId = uuidv4(); // 或其他生成唯一ID的方法
      });

      // Debug: 打印带有生成的ID的数据
      //console.log("Data with generated IDs: ", data.data);
    }
    //console.log('item.generatedId--',data);
    if (data && data.columns) {
      generateColumns(data.columns);
    }
  }, [data]);

  const generateColumns = (columns) => {
    const generatedColumns = columns.map((col, index) => ({
      title: col.title || '',
      dataIndex: col.dataIndex || '',
      key: col.key || '',
      //width: index ===2 ? '120px' : undefined,  // 设置第一列的宽度
      //fixed: index ===0 ? 'left' : undefined,
      //ellipsis: index ===2 ? true: false,  // 设置第一列的宽度
      sorter: true,
      sortOrder: sort.field === col.dataIndex ? sort.order : false,
      render: (val, record) => {
        // if (index === 0) {
        //   return <div style={{ paddingLeft: '10px' }}>{val}</div>;
        // }
        if (col.key === 'img' || col.type === 'base64') {
          return <Image src={`data:image/png;base64,${val}`} />;
        }
        if (col.dtype === 'pect_chg') {
          const style = val > 0 ? { color: 'red' } : val < 0 ? { color: 'green' } : {};
          return <div style={style}>{typeof val === 'number' ? `${val.toFixed(2)}%` : val}</div>;
        }
        if (col.dtype === 'pect') {
          return <div>{typeof val === 'number' ? `${val.toFixed(2)}%` : val}</div>;
        }
        if (col.dtype === 'price_b' || col.dtype === 'float_b' || col.dtype === 'int_b') {
          let displayVal = val;
          if (typeof val === 'number') {
            if (val >= 100000000) {
              displayVal = (val / 100000000).toFixed(1) + '亿';
            } else if (val >= 10000) {
              displayVal = (val / 10000).toFixed(1) + '万';
            }
          }
          return <div>{displayVal}</div>;
        }
        // 判断字段是否为 list 类型
        if (Array.isArray(val)) {
          return (
            <div>
              {val.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </div>
          );
        }
        const id = record.id;
        if (col.link) {
          return <a    href={`/data/bar?id=${id}`} title={val} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</a>
        } else {
          return <div  title={val} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
        }
      },
    }));
    setColumns(generatedColumns);
  };

  const paginationProps = {
    current: currentPage,
    pageSize: 20,
    total: data.total_cnt,
    showTotal: (total) => `共 ${data.total_cnt} 条`,
    onChange: (page) => setCurrentPage(page),
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination && 'current' in pagination) {
      setCurrentPage(pagination.current);
    } 
    onTableChange(pagination, filters, sorter);
 
  };

  const searchBar = () => (
    <div style={{ marginLeft: 'auto' }}>
      {/* 你的搜索条实现 */}
    </div>
  );

  const InfoBar = () => (
    <span key={"infobar"} style={{ fontSize: 'small', color: '#888' }}>
      {/* 你的InfoBar实现 */}
    </span>
  );

  // data.data.forEach((item, index) => {
  //   item.generatedId = generateUniqueId(item, index);  // generateUniqueId是你自己定义的生成唯一ID的函数
  // });

  return (
    <>
    <div>
      <ProTable
        columns={columns}
        dataSource={data.data}
        //密度
        size="large"
        rowKey={record => record.generatedId} 
        //rowKey={record => record.max_power_short} // 使用动态生成的唯一ID
        pagination={paginationProps}
        search={false} // 禁用搜索框 
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [searchBar()]}
        headerTitle={[<span key="title">明细</span>, <InfoBar key="infoBar" />]}
        onChange={handleTableChange}
        options={{
          setting: {
            listsHeight: 400,
          },
          reload: false,
        }}
      />
    </div>
      {/* <Pagination {...paginationProps} style={{ margin: "10px 0 0 0", float: 'right' }} /> */}
    </>
  );
};

export default KTable;
