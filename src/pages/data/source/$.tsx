import React, { useEffect, useState,useRef } from 'react';
import { Space, Table,Tabs,Breadcrumb, Tag,Radio,Input } from 'antd';
import axios from 'axios'; 
import { baseURL } from "@/app"
import { useLocation,Link } from 'react-router-dom';
import { log } from 'console';
import {  ProCard,PageContainer } from '@ant-design/pro-components';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import { Button, Dropdown } from 'antd' 

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 1', '1'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const DataMgr: React.FC = () => { 
  const [activeTab, setActiveTab] = useState('1');
  const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div style={{ background: '#F5F7FA', display: 'flex', height: '100vh' }}>
    <PageContainer
      fixedHeader
      tabList={[
        {
          tab: '标准化',
          key: '1',
        },
        {
          tab: '原数据',
          key: '2',
        },
      ]}
      onTabChange={handleTabChange}
      style={{ flex: 1 }}
    >
      {activeTab === '1' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
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
      )}
      {activeTab === '2' && (
        <iframe 
            src="https://tushare.pro/document/2?doc_id=25" 
            style={{
            width: '100%', 
            height: '100%', 
            border: 'none', 
            margin: 0, 
            padding: 0,
            overflow: 'hidden'
            }}
        >
        </iframe>
        )}
    </PageContainer>

    <div style={{ width: 200 }}>
      <Menu
        mode="inline"
        style={{ width: 200 }}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
      />
    </div>
  </div>
    )};

export default DataMgr;