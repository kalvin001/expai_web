import React, { useEffect,useState} from 'react';
import axios from 'axios';
import { baseURL } from "@/app"
import HChartBar from '@/components/Hcharts/bar';
import { Card, Breadcrumb, Tabs } from 'antd';
import { useParams,Link,useLocation  } from 'react-router-dom'; 
const MyStockChart = () => {
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // 从查询字符串中获取 name 参数 
  const [data, setData] = useState([]); // 图表数据
 
  useEffect(() => {  
    const filter = { "id":parseInt(id, 10)}
    let url = `${baseURL}/data?name=BarDay`
              + `&filter=${JSON.stringify(filter)}&size=10000`
    
    axios.get(url).then((response) => { 
        const data = response.data.data;
        console.log("data--",data)
        setData(data); 
    })
  }, [id])

  return (
    <>  
    <Breadcrumb style={{ marginBottom: 0 }}>
      <Breadcrumb.Item><Link to="/">数据</Link></Breadcrumb.Item>
      <Breadcrumb.Item>
          <Link to="/model/factor">{id}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{id}</Breadcrumb.Item>
    </Breadcrumb>
    <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Return" key="1"> 
          {data.length === 0 ? (
            <div>Loading...</div>  // 加载指示器
          ) : (
            <HChartBar id={id} data={data}/>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Stock" key="2">
            111
        </Tabs.TabPane> 
        {/* 更多选项卡 */}
      </Tabs>
   </>

  );
};

export default MyStockChart;
