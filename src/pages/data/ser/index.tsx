import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-layout';
import { Tabs, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

const MyLayout = () => {
  const [activeKey, setActiveKey] = useState('tab1');

  const menus = {
    tab1: [
      { key: 'subitem1', name: '子选项 1', path: '/subitem1' },
      { key: 'subitem2', name: '子选项 2', path: '/subitem2' },
      // 其他子选项
    ],
    tab2: [
      { key: 'subitem3', name: '子选项 3', path: '/subitem3' },
      { key: 'subitem4', name: '子选项 4', path: '/subitem4' },
      // 其他子选项
    ],
    // 其他选项卡
  };

  return (
    <ProLayout
      menuHeaderRender={() => (
        <Tabs activeKey={activeKey} onChange={key => setActiveKey(key)}>
          <TabPane tab="选项卡 1" key="tab1"></TabPane>
          <TabPane tab="选项卡 2" key="tab2"></TabPane>
          {/* 其他选项卡 */}
        </Tabs>
      )}
      menuDataRender={() => menus[activeKey]}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      // 其他属性
    >
      {/* 页面内容 */}
    </ProLayout>
  );
};

export default MyLayout;
