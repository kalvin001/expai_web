import React, { useEffect, useState,useRef } from 'react';
import { Space, Table,Tabs,Breadcrumb, Tag,Radio,Input } from 'antd';
import axios from 'axios'; 
import { baseURL } from "@/app"
import { useLocation,Link } from 'react-router-dom';
import { log } from 'console';
import {  ProCard,PageContainer, ProTable } from '@ant-design/pro-components';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import { Button, Dropdown } from 'antd' 

type MenuItem = Required<MenuProps>['items'][number];
 

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const DataMgr: React.FC = () => { 
  const [activeTab, setActiveTab] = useState('1');
  const [openKeys, setOpenKeys] = useState([]);
  const [lastOpenKey, setLastOpenKey] = useState<string | number | undefined>("");
  const [title, setTitle] = useState('数据源管理'); 
  const [data, setData] = useState({});
  const [columns, setColumns] = useState([]); 
  const [childColumns, setChildColumns] = useState([]);


  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const location = useLocation();
  const pathParts = location.pathname.split('/'); 
  const pageName = pathParts[pathParts.length - 1];
  const [menuKey,setMenuKey] = useState('');
  const [lastSelectedKey, setLastSelectedKey] = useState<string | null>("0eadc3757d249ba0eb1f029b3bcd530b");


    // 当菜单项被选中时触发
    const handleSelect = (info: any) => {
      const { key } = info;
      setLastSelectedKey(key);
    };

  useEffect(() => {
    axios.get(`http://localhost:9001/source?name=${pageName}`)
      .then(response => {
        // 根据你的API返回的数据结构，转换数据到适合的MenuItem类型
        //const fetchedItems: MenuItem[] = setMenuItems
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, [pageName]);


  useEffect(() => {
    axios.get(`http://localhost:9001/source?name=${pageName}&id=${lastSelectedKey}`)
      .then(response => {
        const sanitizedData = response.data.replace(/NaN/g, "null");
        const data_ = JSON.parse(sanitizedData);
         if (data_ && Array.isArray(data_) && data_.length > 0) {
          console.log("data_",data_[0]); 

          const firstItem = data_[0].data[0];
          const columns = Object.keys(firstItem).map(key => ({
            title: key,
            dataIndex: key,
            key: key,
          })); 

          const childColumns = Object.keys(data_[0].children[0]).map(key => ({
            title: key,
            dataIndex: key,
            key: key,
          }));

          console.log("childColumns",childColumns); 
          setData(data_[0]);
          setColumns(columns);
          setChildColumns(childColumns);

        } 
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, [pageName,lastSelectedKey]);
  
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {

      //setOpenKeys(keys);
      console.log("onOpenChange--",keys,latestOpenKey)
      setLastOpenKey(latestOpenKey);
      setOpenKeys(keys)

    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div style={{ background: '#F5F7FA', display: 'flex', height: '100vh' }}>
    {data && data.name && (

    <PageContainer
      fixedHeader
      title={data.name}
      content={data.description}
      tabList={[
        {
          tab: '明细',
          key: '1',
        },
        {
          tab: '参数',
          key: '2',
        },
      ]}
      onTabChange={handleTabChange}
      style={{ flex: 1 }}
    >
      {activeTab === '1' && (
            <ProTable
            columns={columns}
            dataSource={data.data}
            rowKey={record => record.id}
            scroll={{ x: 'max-content' }}
            pagination={false}
            search={false} // 禁用搜索框 
            options={{
              setting: {
                listsHeight: 400,
              },
              reload: false,
            }} 
          />
      )}
      {activeTab === '2' && (
       <ProTable
            columns={childColumns}
            dataSource={data.children}
            rowKey={record => record.id}
            scroll={{ x: 'max-content' }}
            pagination={false}
            search={false} // 禁用搜索框 
            options={{
              setting: {
                listsHeight: 400,
              },
              reload: false,
            }} 
          />
        )}
    </PageContainer>
    )}
    <div style={{ width: 300 }}>
      <Menu
        mode="inline"
        style={{ width: 300 }}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onSelect={handleSelect} // 监听选中事件
        // selectedKeys={[menuKey]} // 选中项的key

        items={menuItems}  // 用状态变量代替静态数据
      />
    </div>
  </div>
    )};

export default DataMgr;