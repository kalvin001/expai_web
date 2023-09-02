import React, { useEffect, useState,useRef } from 'react';
import { Space, Table,Tabs,Breadcrumb, Tag,Radio,Input } from 'antd';
import axios from 'axios'; 
import { baseURL } from "@/app"
import { useLocation,Link } from 'react-router-dom';
import { log } from 'console';
import {  ProCard,PageContainer } from '@ant-design/pro-components';

import { Button, Dropdown } from 'antd' 


const DataMgr: React.FC = () => { 
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div
    style={{
      background: '#F5F7FA',
    }}
  >
    <PageContainer
      fixedHeader
      header={{
        // title: '页面标题',
        // breadcrumb: {
        //   items: [
        //     {
        //       path: '',
        //       title: '一级页面',
        //     },
        //     {
        //       path: '',
        //       title: '二级页面',
        //     },
        //     {
        //       path: '',
        //       title: '当前页面',
        //     },
        //   ],
        // },
      }}
      // extra={[
      //   <Button key="3">操作</Button>,
      //   <Button key="2">操作</Button>,
      //   <Button key="1" type="primary">
      //     主操作
      //   </Button>,
      // ]}
      tabList={[
        {
          tab: '已选择',
          key: '1',
        },
        {
          tab: '可点击',
          key: '2',
        }
      ]}
      onTabChange={handleTabChange}

    >
      {activeTab === '1' &&       <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard style={{ height: 200 }} />
        <ProCard gutter={16} ghost>
          <ProCard colSpan={16} style={{ height: 200 }} />
          <ProCard colSpan={8} style={{ height: 200 }} />
        </ProCard>
        <ProCard gutter={16} ghost>
          <ProCard colSpan={8} style={{ height: 200 }} />
          <ProCard colSpan={16} style={{ height: 200 }} />
        </ProCard>
      </ProCard>
      
      }
      {activeTab === '2' && <div>这里是可点击的内容</div>}


    </PageContainer>
  </div>
    )};

export default DataMgr;