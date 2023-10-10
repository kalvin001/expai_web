import React, { useEffect, useState,useRef } from 'react'; 
import axios from 'axios';  
import { useLocation,Link } from 'react-router-dom';  
import { PageContainer } from '@ant-design/pro-components';
import KNav from '@/components/KCom/knav';
import KNav1 from '@/components/KCom/knav1';
import KTable from '@/components/KCom/ktable';
 

const navOptionsData = [{"name": "data_type", "values": [{"key": "all", "label": "\u5168\u90e8", "rank": 0}, {"key": "img", "label": "\u56fe\u50cf", "rank": 1}, {"key": "text", "label": "\u6587\u672c", "rank": 2}, {"key": "audio", "label": "\u97f3\u9891", "rank": 3}, {"key": "video", "label": "\u89c6\u9891", "rank": 4}, {"key": "ser", "label": "\u65f6\u5e8f", "rank": 6}, {"key": "mmodal", "label": "\u591a\u6a21\u6001", "rank": 7}], "selected": "all", "label": "data_type"}, {"name": "domain", "values": [{"key": "all", "label": "\u5168\u90e8", "rank": 0}, {"key": "FIN", "label": "\u91d1\u878d", "rank": 1}, {"key": "COMMON", "label": "\u901a\u7528", "rank": 3}], "selected": "all", "label": "domain"}];


const MyTrd: React.FC = () => {  

 
  const location = useLocation();
  const pathParts = location.pathname.split('/'); 
  const pageName = pathParts[pathParts.length - 1]; 
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({}); 
  const handleNavChange = (selected: { [level: string]: string }) => {
    console.log('Selected:', selected);
    setFilter(selected);
  };

  // const regionData = [
  //   {
  //     name: 'Zhejiang',
  //     label: '浙江',
  //     selected: true,
  //     children: [
  //       { name: 'Hangzhou', label: '杭州', selected: true },
  //       { name: 'Ningbo', label: '宁波' },
  //       { name: 'Nanjing', label: '南京' },
  //     ],
  //   },
  //   {
  //     name: 'Jiangsu',
  //     label: '江苏',
  //     children: [
  //       { name: 'Suzhou', label: '苏州',
  //       children: [
  //         { name: 'Wuzhong', label: '吴中区' },
  //         { name: 'Xiangcheng', label: '相城区', selected: true },
  //       ],
  //       },
  //       { name: 'Nanjing', label: '南京' },
  //       { name: 'AAAA', label: 'AAAA' },
  //     ],
  //   },
  // ];
  
  useEffect(() => {
    axios.get(`http://localhost:9001/mytrd?name=${pageName}&filter=${JSON.stringify(filter)}`) //
      .then(response => { 
        setData(response.data);
        //console.log(response.data.data);
       })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, [pageName]);
 
  
  return (
    <div style={{ background: '#F5F7FA', display: 'flex', height: '100vh' }}>
 
    <PageContainer
        fixedHeader 
        tabList={[
            {
            tab: '账户',
            key: '1',
            },
            {
            tab: '成交',
            key: '2',
            },{
            tab: '订单',
            key: '3',
            },
        ]}
        // onTabChange={handleTabChange}
        style={{ flex: 1 }}
        >
        
    {/* <KNav navOptions={navOptionsData}  handleNavChange={handleNavChange}></KNav> */}
    {data && data.navs && data.navs.length > 0 && <KNav1 data={data.navs} onChange={handleNavChange} ></KNav1>}

    {data && data.data  && <KTable data={data} ></KTable>}
    </PageContainer> 

</div> 
     )};

export default MyTrd;