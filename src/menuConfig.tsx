import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined,TransactionOutlined} from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const modelMenu: MenuDataItem[] = [
  {
    name: '因子',
    path: '/stg/factor',
    icon: <DashboardOutlined />,
  }, 
];



const dataMenu: MenuDataItem[] = [
  {
    name: '金融',
    icon: <TransactionOutlined />,
    children: [
      {
        name: '行情',
        path: '/data/Snapshot',
      }, 
      {
        name: '资金',
        path: '/data/FtStockBasic',
      } 
    ],
    
  }, 
  {
    name: '图像',
    path: '/data/Cifar10',
    icon: <DashboardOutlined />,
  }, 
  {
    name: '文本',
    path: '/data/nlp',
    icon: <DashboardOutlined />,
    children: [
      {
        name: '新闻',
        path: '/data/TsNewsCCTV',
      }
    ],
  }, 
  {
    name: '管理',
    path: '/data/mgr',
    icon: <DashboardOutlined />,
  }, 
];

const demoMenu: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    name: '表单',
    path: '/form',
    icon: <FormOutlined />,
  },
  {
    name: '列表',
    path: '/list',
    icon: <TableOutlined />,
  },
  {
    name: '结果&异常',
    icon: <WarningOutlined />,
    children: [
      {
        name: '成功',
        path: '/success',
      },
      {
        name: '404',
        path: '/404',
      },
    ],
  },
];

const taskMenu: MenuDataItem[] =  [
  {
    name: '看板',
    path: '/task/board',
    icon: <DashboardOutlined />,
  },
 
];


export { modelMenu, dataMenu, demoMenu, taskMenu };