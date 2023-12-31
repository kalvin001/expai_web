import React, { useEffect, useState,useRef } from 'react'; 
import axios from 'axios';  
import { useLocation,Link } from 'react-router-dom';  
import { PageContainer } from '@ant-design/pro-components';
import KNav from '@/components/KCom/knav'; 
import KTable from '@/components/KCom/ktable';
import { Space, Tag } from 'antd';
import { baseURL } from "@/app" 
import KCart from '@/components/KCom/kcart';


const buildQueryParams = (pageName,curTab,moduleConfig, currentPage, qkey, sort, selectedFilters) => { 
  //console.log('curTab',curTab);
  const { dtype = null, filter = null, tabName = null, page_size = 10, time = null } = moduleConfig;
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
  console.log('queryParams',queryParams);

  return `${baseURL}/q?${queryParams}`;
};

const KData: React.FC = () => {  

  const location = useLocation();
  const pageName = location.pathname.slice(1); 
  console.log('location pageName',pageName);
  const [data, setData] = useState([]);
  const [navs, setNavs] = useState([]);
  const [tabKey, setTabKey] = useState('');
  const isFirstRun = useRef(true);
  const [sort, setSort] = useState({ field: '', order: '' }); // 排序状态
  const [currentPage, setCurrentPage] = useState(1);
  const [page,setPage] = useState({});
  const [tabs,setTabs] = useState([]);
  const [curTab,setCurTab] = useState({});
  const [qkey, setQkey] = useState(''); // 新的状态变量
  const [selectedFilters, setSelectedFilters] = useState({}); // 存储每个 Radio.Group 的选中值
  const [moduleConfig, setModuleConfig] = useState({}); // 存储每个 Radio.Group 的选中值

  
  const handleTabChange = (key: string) => {
    setTabKey(key);
    const foundTab = tabs.find(tab => tab.key === key);
    if (foundTab) {
      setCurTab(foundTab);
    } 
  }
  const handleNavChange = (selected: { [level: string]: string }) => {
    //console.log('selected',selected);
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
    setData([]); // 清空数据
    setNavs([]); // 清空导航
    setTabKey(''); // 设置默认 Tab Key
    setSort({ field: '', order: '' }); // 重置排序状态
    setCurrentPage(1); // 重置当前页
    setQkey(''); // 重置 qkey
    setSelectedFilters({}); // 重置筛选项
    setModuleConfig({}); // 重置模块配置
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPage(data);
        setTabs(data.tabs); 
        setCurTab(data.tabs[0]);  
        
        const module_config = data.tabs?.[0]?.modules?.[0] 
        ? data.tabs[0].modules[0]
        : {dtype: "table", tabName: data.tabs?.[0]?.key ?? 'defaultKey', page_size: 20};
      
        setModuleConfig(module_config);
      });
  }, [pageName]);
  

  useEffect(() => {
    console.log('pageName',pageName);
    if (!curTab || Object.keys(curTab).length === 0) return;
    const url = buildQueryParams(pageName,curTab,moduleConfig, currentPage, qkey, sort, selectedFilters);

    axios.get(url)
      .then(response => {     //.then((response) => response.json())
        let data = response.data;
        //console.log('data',data);

        setData(data);  
        if (isFirstRun.current) {
          setNavs(data.navs);
          console.log('isFirstRun.current',data);
          isFirstRun.current = false;
        }
       })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, [pageName,selectedFilters,tabKey,curTab]);
 
  
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
            {page?.data?.data_size && <span>数据大小: {page.data.data_size}</span>}
            <Tag color="blue" style={{ marginLeft: '10px',fontWeight:'normal' }}>标</Tag>
          </div>
        }
        // title={
        //   <div>
        //  </div>
        // }
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
        onTabChange={handleTabChange}
        />  
    <div style={{margin:'10px 10px 10px 10px'}}>
    {navs && navs.length > 0 && <KNav data={navs} onChange={handleNavChange} navType={data.nav_type} ></KNav>}
    {data && data.data && (
      data.vtype === 'card' ? ( <>
         <KCart data={data} config={moduleConfig} /></>
      ) : (<>
        <KTable  data={data} onTableChange={handleTableChange} /></>
      )
    )}
    </div>       
    </>
 
     )};

export default KData;