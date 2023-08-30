import React, { useEffect, useState } from 'react';
import { Card, Breadcrumb, Tabs } from 'antd';
import axios from 'axios';
import { useParams,Link,useLocation  } from 'react-router-dom'; // 如果使用 React Router
import Curve from '@/components/Echarts';
import { log } from 'console';

const FactorDetail = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name'); // 从查询字符串中获取 name 参数


  useEffect(() => {
    const url = `http://127.0.0.1:9001/stg/factor/detail?name=${name}`;

    axios.get(url).then((response) => {
      //console.log(response.data)
      setData(response.data);
    }).catch((error) => {
      console.error('An error occurred while fetching data:', error);
    });
  }, [name]);

  return (<>
    <Breadcrumb style={{ marginBottom: 0 }}>
    <Breadcrumb.Item><Link to="/">策略</Link></Breadcrumb.Item>
    <Breadcrumb.Item>
        <Link to="/stg/factor">因子</Link>
    </Breadcrumb.Item>
    <Breadcrumb.Item>{name}</Breadcrumb.Item>
  </Breadcrumb>
    <div style={{ padding: 10 }}>


      {/* 整体因子信息展示模块 
      <Card title="Factor Information" style={{ marginBottom: 24 }}>
      </Card>*/}

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Return" key="1">
        <Card title="Return" style={{ marginBottom: 24 }}>
            <Curve data={data}  yKeys={['return', 'rank_return', 'base_return']} />
        </Card>
        <Card title="Quantile Return" style={{ marginBottom: 24 }}>
            <Curve data={data} yKeys={['q_20', 'q_40', 'q_60', 'q_80', 'q_100']}  />
        </Card>
        <Card title="Top/Bottom Return" style={{ marginBottom: 24 }}>
            <Curve data={data} yKeys={['return','top_1','top_10','bottom_1','bottom_10']} />
        </Card>
        <Card title="Corr">
            <Curve data={data} yKeys={['IC', 'RankIC']} />
        </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Stock" key="2">
            111
        </Tabs.TabPane> 
        {/* 更多选项卡 */}
      </Tabs>
    </div>
    </>
  );
};

export default FactorDetail;
