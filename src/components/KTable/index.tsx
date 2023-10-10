// CustomTable.js
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Divider, Input, Pagination, Radio, Row, Select, Space, Table,Tag } from 'antd';
import axios from 'axios';
import { Image } from 'antd';  
import { baseURL } from "@/app"
import ProTable from '@ant-design/pro-table';

const { Option } = Select;

const buildQueryParams = (config, currentPage, qkey, sort, selectedFilters) => {
  const { dtype, filter, name, page_size,time } = config;
  const queryParams = [
    name && `name=${name}`,
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



const KTable = ({ config }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [qkey, setQkey] = useState(''); // 新的状态变量
  const [sort, setSort] = useState({ field: '', order: '' }); // 排序状态
  const [selectedFilters, setSelectedFilters] = useState({}); // 存储每个 Radio.Group 的选中值
  const [filterOptions, setFilterOptions] = useState([]); // 存储筛选选项的数据
  const [isInitialized, setIsInitialized] = useState(false); // 新的状态变量
 
  console.log("config--",config)

  const paginationProps = {
    current: currentPage,
    pageSize:config.page_size,
    total: total,  // 你需要从哪里获取这个值
    showTotal: (total) => `共 ${total} 条`,
    onChange: (page) => setCurrentPage(page),
  };

  const handleSearch = (value) => {
    setQkey(value) 
  };
  const handleTableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    setSort({ field, order });
    //console.log(pagination,pagination.current,field, order)
    //加入判断pagination是否存在
    if (pagination && 'current' in pagination) {
      setCurrentPage(pagination.current);
    }

  };
 
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };
 
  const setColumnsFromResponse = (columns) => { 
    const generatedColumns = columns.map((col, index) => ({
      title: col.title || '',
      dataIndex: col.dataIndex || '',
      key: col.key || '',
      width: index ===2 ? '120px' : undefined,  // 设置第一列的宽度
      fixed: index ===2 ? 'left' : undefined,
      //ellipsis: index ===2 ? true: false,  // 设置第一列的宽度
      sorter: true,
      sortOrder: sort.field === col.dataIndex ? sort.order : false,
      render: (val, record) => {
        // if (index === 0) {
        //   return <div style={{ paddingLeft: '10px' }}>{val}</div>;
        // }
        if (col.key === 'img' || col.type === 'base64') {
          return <Image src={`data:image/png;base64,${val}`} />;
        }
        if (col.dtype === 'pect_chg') {
          const style = val > 0 ? { color: 'red' } : val < 0 ? { color: 'green' } : {};
          return <div style={style}>{`${(val).toFixed(2)}%`}</div>;
        }
        if (col.dtype === 'pect') {
           return <div>{`${(val).toFixed(2)}%`}</div>;
        }
        if (col.dtype === 'price_b' || col.dtype === 'float_b'  || col.dtype === 'int_b') {
          let displayVal = val;
          if (val >= 100000000) {
            displayVal = (val / 100000000).toFixed(1) + '亿';
          } else if (val >= 10000) {
            displayVal = (val / 10000).toFixed(1) + '万';
          }
          return <div>{displayVal}</div>;
        } 
        // 判断字段是否为 list 类型
        if (Array.isArray(val)) {
          return (
            <div>
              {val.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </div>
          );
        }
        const id = record.id;
        if (col.link) {
          return <a    href={`/data/bar?id=${id}`} title={val} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</a>
        } else {
          return <div  title={val} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
        }
      },
    }));
    setColumns(generatedColumns);
  }
  

  useEffect(() => {
    // 重置所有相关状态到初始值
    const resetStatesToDefault = () => {
      setCurrentPage(1);
      setQkey('');
      setSort({ field: '', order: '' });
      setSelectedFilters({});
      setIsInitialized(false);
    };
  
    // 从API获取并设置过滤选项的逻辑
    const initializeDataAndOptions = () => {
      const url = buildQueryParams(config, 1, '', { field: '', order: '' }, {});
      axios.get(url)
        .then((response) => {
          setFilterOptions(response.data.navs); 
          setIsInitialized(true);  // 仅在成功获取数据后将此设置为true
        })
        .catch((error) => {
          console.error('An error occurred while fetching initial data:', error);
        });
    };
  
    // 首先重置所有状态
    resetStatesToDefault();
    
    // 然后进行初始化
    initializeDataAndOptions();
  
  }, [config]);  // 此useEffect仅在config变更时运行

  // 监听 currentPage、sort、qkey 和 selectedFilters 变化的逻辑
  useEffect(() => {
    if (isInitialized) {
      const url = buildQueryParams(config, currentPage, qkey, sort, selectedFilters);
      axios.get(url).then((response) => {
        let ret_data = response.data;
        if (typeof response.data === 'string') {
          ret_data = JSON.parse(response.data);
        }
        setData(ret_data.data);
        console.log(ret_data.data)
        setTotal(ret_data.total_cnt);
        setColumnsFromResponse(ret_data.columns);
      }).catch((error) => {
        console.error('An error occurred while fetching data:', error);
      });
    }
  }, [isInitialized, currentPage, sort, qkey, selectedFilters]); // 添加了isInitialized为依赖项


  const navs_bar = () => {
    return (
      <Row justify="space-between" align="middle" style={{ background: "#fff", marginBottom: 0 }}>
        <Col flex="auto">
          {filterOptions.map((navItem) => {
            const { name, values, selected } = navItem;
            const defaultSelected = selected || (values.length > 0 ? values[0].key : null);
  
            if (values.length > 12) {
              return (
                <Select
                  key={name}
                  defaultValue={defaultSelected}
                  style={{ width: 120, margin: '10px 20px 10px 20px' }}
                  onChange={(value) => handleFilterChange(name, value)}
                >
                  {values.map((option) => (
                    <Option key={option.key} value={option.key}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return (
                <Radio.Group
                  key={name}
                  style={{ margin: '10px 20px 10px 20px'  }}
                  defaultValue={defaultSelected}
                  onChange={(e) => handleFilterChange(name, e.target.value)}
                >
                  {values.map((option) => (
                    <Radio.Button key={option.key} value={option.key}>
                      {option.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              );
            }
          })}
        </Col>
      </Row>
    );
  };

  const search_bar = () => {
    return ( 
    <Col style={{ marginLeft: 'auto' }}>
    <Input.Search
      placeholder="search"
      onSearch={handleSearch}
      style={{ width: 200 }}
    />
  </Col>
    );
  }

  const AdvancedNav = () => {
    return (
      <div style={{margin:'10px 2px 10px 2px',background:"#fff"}}>
          
      </div>
    );
  };
  
  const InfoBar = ({ totalRecords, lastUpdated }) => {
    return (
      <span style={{ fontSize: 'small', color: '#888', fontWeight:"normal", marginLeft: '10px' }}>
      {lastUpdated}更新 大小:11M  来源:AkShare
    </span>
    );
  };
  

  return ( 
  <> 
  {isInitialized ? ( 
  <>

    <div style={{
        margin: '0px 0px 10px 0px',
        background: '#fff', 
        padding: '15px 20px 10px 20px',
        // Adding a simple shadow for depth
      }}>
          {navs_bar()}
          {/* <Divider /> 
          { search_bar()} */}
    </div>
    {/* <Alert message="Info Text" type="info" style={{margin:"10px 2px 10px 2px"}} /> */}

    { 
        config.dtype === 'img' ? (
          <>
          {/* <div style={{display: 'flex',background:"#fff", padding: '15px 20px 10px 20px',}}>
          {navs_bar()}
          </div> */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          
          {data.map((item, index) => (
            <Card key={index} 
            style={{ 
              margin: '-1px -1px 0px -1px',
              textAlign: 'center',
              width: `calc(100% / ${Math.ceil(config.page_size / 10)} + 2px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxHeight: '300px',  // 设置最大高度
                  overflow: 'hidden'
                }}>
              <Image src={`data:image/png;base64,${item.img}`} style={{maxHeight: '100%'}} />
            </div>
            <p style={{
                margin: '10px 0 0 0',
                padding: '5px',
                borderRadius: '5px',
                color: '#333',
                fontSize: '14px',
              }}>
            {item.label}
          </p>
            </Card>
          ))}
        </div> 
          </>
        ):config.dtype === 'audio' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {data.map((item, index) => (
              <Card key={index}>
                <audio controls>
                  <source src={`data:audio/mp3;base64,${item.audio}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                {/* <p>{item.label}</p> */}
              </Card>
            ))}
          </div>
        ): config.dtype === 'video' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {data.map((item, index) => (
              <Card key={index}>
                {/* <video controls width="300">
                  <source src={`data:video/mp4;base64,${item.video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
                <video width="320" height="240" controls>
                  <source src={`http://127.0.0.1:9001/video?name=${item.video_path}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* <p>{item.label}</p> */}
              </Card>
            ))}
          </div>
        ) : (
          //  {kTable}
          <div>
          <ProTable
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            scroll={{ x: 'max-content' }}
            pagination={false}
            search={false} // 禁用搜索框
            //options={false} // 禁用更多操作
            //toolBarRender={() => [navs()]}  // 在这里加入 navs
            toolBarRender={() => [ 
              search_bar()
              

            ]}
            headerTitle={
             ["明细",
              <InfoBar totalRecords={data.length} lastUpdated="2023-09-29" />
            ]
             
            }
            options={{
              setting: {
                listsHeight: 400,
              },
              reload: false,
            }}
            //toolBarRender={false} // 禁用工具栏 
            onChange={handleTableChange}
          />
          {/* <Pagination {...paginationProps} style={{ margin: '10px 0 0 0', float: 'right' }} />
        
          <Table 
          onChange={handleTableChange}  // 确保这一行存在
          columns={columns} 
          dataSource={data} 
          rowKey={record => record.id}
          scroll={{ x: 'max-content' }} 
          pagination={false}
          /> */}
        </div> 
         )}
      <Pagination {...paginationProps} style={{margin:"10px 0 0 0 ", float: 'right' }} />
      
    </>):  (
      <div>
        {/* 数据加载中... */}
      </div>
    )} </>

    
  );
};

export default KTable;