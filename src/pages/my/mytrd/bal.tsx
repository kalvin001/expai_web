import React, { useEffect, useState,useRef } from 'react'; 
import axios from 'axios';  
import { useLocation,Link } from 'react-router-dom';  
import { PageContainer } from '@ant-design/pro-components';
import KNav from '@/components/KCom/knav_base';
import KNav1 from '@/components/KCom/knav_tree';
import KTable from '@/components/KCom/ktable';
import { Space } from 'antd';
import { baseURL } from "@/app"


const buildQueryParams = (pageName,curTab, currentPage, qkey, sort, selectedFilters) => { 
  const module_config = (curTab.modules && curTab.modules[0]) ? curTab.modules[0] : {dtype: "table", tabName: curTab.key, page_size: 20};
  const { dtype = null, filter = null, tabName = null, page_size = 10, time = null } = module_config;
  const queryParams = [
    pageName && `name=${pageName}`,
    tabName && `tab=${tabName}`,
    time && `time=${time}`,
    `page=${currentPage}`,
    `size=${page_size}`,
    dtype && `type=${dtype}`,
    filter && `pre_filter=${JSON.stringify(filter)}`,
    `filter=${JSON.stringify(selectedFilters)}`,
    qkey && `qkey=${qkey}`,
    `sort_field=${sort.field}`,
    `sort_order=${sort.order}`,
  ].filter(Boolean).join('&'); // 过滤掉undefined和空字符串

  return `${baseURL}/q?${queryParams}`;
};

const MyTrd: React.FC = () => {  

  const location = useLocation();
  const pageName = location.pathname.slice(1); 
  const [data, setData] = useState([]);
  const [navs, setNavs] = useState([]);
  const [tabKey, setTabKey] = useState('account_info');
  const isFirstRun = useRef(true);
  const [sort, setSort] = useState({ field: '', order: '' }); // 排序状态
  const [currentPage, setCurrentPage] = useState(1);
  const [page,setPage] = useState({});
  const [tabs,setTabs] = useState([]);
  const [curTab,setCurTab] = useState({});
  const [qkey, setQkey] = useState(''); // 新的状态变量
  const [selectedFilters, setSelectedFilters] = useState({}); // 存储每个 Radio.Group 的选中值

  
  const handleTabChange = (key: string) => {
    setTabKey(key);
    const foundTab = tabs.find(tab => tab.key === key);
    //console.log('foundTab',foundTab);
    if (foundTab) {
      setCurTab(foundTab);
    } 
  }
  const handleNavChange = (selected: { [level: string]: string }) => {
    setSelectedFilters(selected);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    setSort({ field, order });
    if (pagination && 'current' in pagination) {
      setCurrentPage(pagination.current);
    }
  };
    
  
  useEffect(() => {
    // 假设从后端获取数据并设置 menuItems 
    const url = `${baseURL}/page?name=${pageName}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPage(data);
        setTabs(data.tabs); 
        setCurTab(data.tabs[0]);  
      });
  }, [pageName]);
  

  useEffect(() => {
    // config= curTab.modules[0] 
    const url = buildQueryParams(pageName,curTab, currentPage, qkey, sort, selectedFilters);
    console.log('url',url);

    //axios.get(`http://localhost:9001/q1?name=${pageName}&filter=${JSON.stringify(selectedFilters)}&tab=${tabKey}`)
    axios.get(url)
      .then(response => {     //.then((response) => response.json())
        let data = response.data;
        setData(data);  
        if (isFirstRun.current) {
          setNavs(data.navs);
          isFirstRun.current = false;
        }
       })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, [pageName,selectedFilters,tabKey]);
 
  
  useEffect(() => { 
    isFirstRun.current = true;
    console.log('pageName',pageName);
  }, [pageName,tabKey]);


  return (
    <>
    <PageContainer
        tabList={tabs}
        content={
          <div>
            { "数据大小"}
            {/* <Tag color="blue" style={{ marginLeft: '10px',fontWeight:'normal' }}>图像分类</Tag> */}
          </div>
        }
        // title={
        //   <div>
        //  </div>
        // }
        extra={
          <div style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
            <Space>
            数据更新
            </Space>
          </div>
        }
        onTabChange={handleTabChange}
        />  
    <div style={{margin:'10px 10px 10px 10px'}}>
    {navs && navs.length > 0 && <KNav1 key={"knav1"} data={navs} onChange={handleNavChange} ></KNav1>}
    {data && data.data  && <KTable key={"table"} data={data} onTableChange={handleTableChange} ></KTable>}
    </div>       
    </>
 
     )};

export default MyTrd;