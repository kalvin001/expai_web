import { Outlet, Link, useLocation } from 'ice'; 
import { Menu } from 'antd';
import { modelMenu, dataMenu, demoMenu, taskMenu  } from '@/menuConfig';
import AvatarDropdown from '@/components/AvatarDropdown';
import store from '@/store';
import logo from '@/assets/logo.png';
import styles from './layout.module.css';
import Footer from '@/components/Footer';
import { GoldOutlined, CodeSandboxOutlined,ApartmentOutlined,BuildOutlined,QrcodeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { ProLayout } from '@ant-design/pro-components';
const menuItemsConfig = [
  { label: '数据', key: 'data', icon: <CodeSandboxOutlined />, path: 'data\\Snapshot' },
  { label: '模型', key: 'model', icon: <QrcodeOutlined />, path: 'model/factor' },
  { label: '任务', key: 'task', icon: <ApartmentOutlined />, path: 'task/board' },
  { label: '模拟', key: 'replay', icon: <QrcodeOutlined />, path: 'replay/factor' },

  { label: '例子', key: 'example', icon: <GoldOutlined />, path: '' },
]; 
export default function Layout() {
  const location = useLocation();
  const [userState] = store.useModel('user'); 
  const [selectedMenu, setSelectedMenu] = useState(menuItemsConfig[0].key); // 设置初始值

  useEffect(() => {
    if (location.pathname.includes('/data')) setSelectedMenu('data');
    else if (location.pathname.includes('/model')) setSelectedMenu('model');
    else if (location.pathname.includes('/task')) setSelectedMenu('task');
    else if (location.pathname.includes('/example')) setSelectedMenu('example');
    else setSelectedMenu('data');
  }, [location.pathname]);

  useEffect(() => {
    // 在这里，你可以触发侧边菜单重新渲染或者其他你需要的操作
    getAsideMenu(); 
  }, [selectedMenu]); // 当selectedMenu变化时触发


  const handleMenuClick = (key) => {
    setSelectedMenu(key); // 设置新的selectedMenu
  };

  const getAsideMenu = () => {
    switch (selectedMenu) {
      case 'data':
        return dataMenu
      case 'model':
        return modelMenu
      case 'task':
        return taskMenu
      case 'demo':
        return demoMenu
      default:
        return dataMenu
    }
  };

  if (['/login'].includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <ProLayout
      menu={{ defaultOpenAll: true }}
      className={styles.layout}
      logo={<img src={logo} alt="logo" />}
      title="EXP AI"
      location={{
        pathname: location.pathname,
      }}
      // route={{ path: '/users', name: 'Users', component: './Users' }}
      layout="mix"
      headerContentRender={() => (<>
        <Menu mode="horizontal" className="rightAlignedMenu" selectedKeys={[selectedMenu]}>
          {menuItemsConfig.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} 
              onClick={() => handleMenuClick(item.key)}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
        </>
      )}
      avatarProps={{ 
        render: (props, dom) => {
          return (
            <AvatarDropdown avatar={userState.currentUser.avatar} name={userState.currentUser.name} />

          );
        },
      }} 
      menuDataRender={() => getAsideMenu()}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      footerRender={() => <Footer />}
    >
      <Outlet />
    </ProLayout>
  );
}
