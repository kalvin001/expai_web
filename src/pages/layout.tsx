import { Outlet, Link, useLocation} from 'ice'; 
import { Menu } from 'antd';
import { modelMenu, dataMenu, demoMenu, mgrMenu  } from '@/menuConfig';
import AvatarDropdown from '@/components/AvatarDropdown';
import store from '@/store';
import logo from '@/assets/logo.png';
import styles from './layout.module.css';
import Footer from '@/components/Footer';
import { GoldOutlined, CodeSandboxOutlined,RiseOutlined,PictureOutlined, AccountBookOutlined,AimOutlined,ClockCircleOutlined,DollarCircleOutlined,
  BookOutlined,StockOutlined,RadarChartOutlined,CustomerServiceOutlined,HomeOutlined,VideoCameraOutlined,FundProjectionScreenOutlined,
  ApartmentOutlined,TrademarkCircleOutlined,CloudDownloadOutlined,SettingOutlined,ExpandOutlined,SketchOutlined,DesktopOutlined,FontColorsOutlined,SendOutlined,BuildOutlined,GlobalOutlined,QrcodeOutlined,TransactionOutlined,ControlOutlined,DatabaseOutlined,UserOutlined,WalletOutlined    } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import axios from 'axios'; 
import { baseURL } from "@/app" 
import { Breadcrumb } from 'antd'; 

const iconMapping = {
  fdata: <AccountBookOutlined />,
  fmodel: <AimOutlined />,
  cdata: <CodeSandboxOutlined />,
  cmodel: <BuildOutlined />,
  mgr: <ControlOutlined />,
  replay:<ClockCircleOutlined />,
  quote: <RiseOutlined />,
  cap: <TransactionOutlined />,
  macro: <GlobalOutlined />,
  info: <SendOutlined />,
  img: <PictureOutlined />,
  text:<BookOutlined />,
  ser:<StockOutlined />,
  audio:<CustomerServiceOutlined />,
  video:<VideoCameraOutlined />,
  mmodal:<RadarChartOutlined />,
  dworld:<DatabaseOutlined />,
  my:<UserOutlined />,
  myasset:<WalletOutlined />,
  rec:<TrademarkCircleOutlined />,
  symbol:<FontColorsOutlined />,
  hardware:<DesktopOutlined />,
  mystg:<SketchOutlined />,
  meta:<ExpandOutlined />,
  source:<CloudDownloadOutlined />,
  mytrd:<FundProjectionScreenOutlined />,
};
export default function Layout() {
  const location = useLocation();
  const [userState] = store.useModel('user'); 
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null); // 设置初始值 #menuItemsConfig[0].key
  
  useEffect(() => {
    // 假设从后端获取数据并设置 menuItems
    const url = `${baseURL}/pages`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
        
        // 创建 menuItemsConfig
        const tempMenuItemsConfig = data.map((item) => ({
          label: item.name,
          key: item.key,
          icon: iconMapping[item.key] || null,
          path: item.path,
          children: item.children || []
        }));
  
        // 找到第一个叶子节点
        for (const item of tempMenuItemsConfig) {
          if (!item.children || item.children.length === 0) {
            setSelectedMenu(item.key); // 设置 selectedMenu
            break;
          }
        }
      });
  }, []);

  const menuItemsConfig = menuItems.map((item) => ({
    label: item.name,
    key: item.key,
    icon: iconMapping[item.key] || null,
    path: item.path,
    children: item.children || []  // 假设后端返回数据中包含 "children"
  }));
 

  useEffect(() => {
    // 遍历所有菜单项
    menuItemsConfig.forEach(item => { 
        console.log(item.key,location.pathname,location.pathname.includes(item.key));
        if (location.pathname.includes(item.key)) {
            setSelectedMenu(item.key);
            return;
        }
    }); 
}, [location.pathname, menuItemsConfig]);

  const handleMenuClick = (key) => {
    setSelectedMenu(key); // 设置新的selectedMenu
  };
 
  const getAsideMenu = () => {
    const foundItem = menuItemsConfig.find(item => item.key === selectedMenu);
  
    if (foundItem && Array.isArray(foundItem.children)) {
      return foundItem.children.map(child => ({
        ...child,
        icon: iconMapping[child.key],
        path: child.path // 假设这里已经是完整的路径
      }));
    }
    return [];
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
        <Menu mode="horizontal" className="rightAlignedMenu" selectedKeys={[selectedMenu]}
          items={menuItemsConfig.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>,
            onClick: () => handleMenuClick(item.key)
          }))}
        /> 
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
