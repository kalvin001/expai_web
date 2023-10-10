import React from 'react';
import { Table, Row, Col } from 'antd';
import './ranking_page.css'

const columns = [
  {
    title: '名次',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  // ...其他列
];

const data = [
  {
    rank: 1,
    name: 'Alice',
    // ...其他数据
  },
  // ...其他行
];

const RankingPage = () => {
  return (
    <div className="ranking-page">
      <h1>排行榜</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <div className="ranking-container">
            <h2>个人排行榜</h2>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
        </Col>
        <Col span={6}>
          <div className="ranking-container">
            <h2>团队排行榜</h2>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
        </Col>
      </Row>
      {/* 可以继续添加更多榜单 */}
    </div>
  );
};

export default RankingPage;
