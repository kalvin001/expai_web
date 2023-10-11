import React, { useEffect, useState,useRef,useMemo  } from 'react';
import { Space, Table,Tabs,Breadcrumb, Tag,Radio,Input, Button, Row, Col, Card } from 'antd';
import axios from 'axios'; 
import { baseURL } from "@/app"
import { useLocation,Link } from 'react-router-dom';
import { log } from 'console';
import { Image } from 'antd';  
import {ProTable,PageContainer, ProCard} from '@ant-design/pro-components';
import KFlow from '@/components/Kcharts/flow';
import KTable from '@/components/KTable';
import RankingPage from '@/components/KCom/ranking_page';

const { Meta } = Card;
const KData1: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/'); 
  const pathName = location.pathname[location.pathname.length - 1]
  const [page,setPage] = useState({});
  const [tabs,setTabs] = useState([]);
  const [curTab,setCurTab] = useState({});
  const [activeTab, setActiveTab] = useState('tab1'); 

 
  
  const [data, setData] = useState([]); 
  const [dataType, setDataType] = useState(''); // 图表数据 


  useEffect(() => {
    // 假设从后端获取数据并设置 menuItems 
    const url = `${baseURL}/page?name=${location.pathname.slice(1)}`


    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPage(data);
        setTabs(data.tabs); 
        setCurTab(data.tabs[0]);  
      });
  }, [location.pathname]);
   

  const handleTabChange = (key) => {
    setActiveTab(key);
    const foundTab = tabs.find(tab => tab.key === key);
    if (foundTab) {
      setCurTab(foundTab);
    } 
  }; 
 
  return (
    <> 
  <PageContainer  
      tabList={tabs}
      onTabChange={handleTabChange}
      title={
        <div>
          {page && page.name}
          {/* <Tag color="blue" style={{ marginLeft: '10px',fontWeight:'normal'}}>图像分类</Tag> */}
        </div>
      }
      content={
        <div>
          {page?.data?.data_size && <span>数据大小: {page.data.data_size}</span>}
          {/* <Tag color="blue" style={{ marginLeft: '10px',fontWeight:'normal' }}>图像分类</Tag> */}
        </div>
      }
      extra={
        <div style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
          <Space>
            {page?.data?.last_update && (
              <span style={{ fontSize: '14px', color: '#888888' }}>
                数据更新: {page.data.last_update}
              </span>
            )}
          </Space>
        </div>
      }
    />
   <div style={{margin:'10px 10px 10px 10px'}}>
   {activeTab === 'tab1' && curTab && curTab.modules && curTab.modules[0] &&
     <> 
          <KTable      
            config={curTab.modules[0]}
            key={"ktable"}
          />   
     </>
    }
    {activeTab === 'tab2'  && 
      <>
      <RankingPage />
      <KFlow />
      </>
    }
     </div>
    </>
    )};

export default KData1;