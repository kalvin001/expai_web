// import React, { useEffect, useState,useRef } from 'react';
// import { Space, Table,Tabs,Breadcrumb, Tag,Radio,Input, Button } from 'antd';
// import axios from 'axios'; 
// import { baseURL } from "@/app"
// import { useLocation,Link } from 'react-router-dom';
// import { log } from 'console';
// import { Image } from 'antd';  
// import {ProTable,PageContainer, ProCard} from '@ant-design/pro-components';

// const KData: React.FC = () => {
//   const location = useLocation();
//   const pathParts = location.pathname.split('/'); 
//   const dataName = pathParts[pathParts.length - 1];
//   //const [dataName, setDataName] = useState(pathParts[pathParts.length - 1]);
//   // 使用一个状态对象来保存各个dataName的状态
//     // 从状态对象中获取当前dataName的状态，或使用默认值
//     const defaultState = {
//       currentPage: 1,
//       selectedFilters: {},
//       qkey: '',
//       sort: { field: '', order: '' },
//       isFiltersInitialized: false,
//       filterOptions: {},
//     };
  
//   const [dataStates, setDataStates] = useState({ [dataName]: defaultState });
//   const [currentDataState, setCurrentDataState] = useState(defaultState); // 当前dataName的状态
//   const prevDataNameRef = useRef(dataName); // 保存上一次的dataName



//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [total, setTotal] = useState(0); // 总记录数
//   const [currentPage, setCurrentPage] = useState(defaultState.currentPage); // 当前页码
//   const [selectedFilters, setSelectedFilters] = useState(defaultState.selectedFilters); // 存储每个 Radio.Group 的选中值
//   const [filterOptions, setFilterOptions] = useState(defaultState.filterOptions); // 存储筛选选项的数据
//   const [isFiltersInitialized, setIsFiltersInitialized] = useState(defaultState.isFiltersInitialized); // 新的状态变量
//   const [qkey, setQkey] = useState(defaultState.qkey); // 新的状态变量
//   const [sort, setSort] = useState(defaultState.sort); // 排序状态

//   const [activeTab, setActiveTab] = useState('1');

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };
//   const handleFilterChange = (key, value) => {
//     setSelectedFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   // 定义一个函数来获取和设置过滤选项, 
//   const setFilterOptionsFromResponse = (navs) => {
//     console.log("navs--",navs)
//     if (navs == null) {
//       setSelectedFilters({})
//       setFilterOptions({})
//     }

//     const options = {};

//     for (const key in navs) {
//       options[key] = navs[key].map((item) => ({
//         value: item[0],
//         label: `${item[0]}`,
//       }));
//       // 默认选择第一个选项
//       setSelectedFilters((prev) => ({ ...prev, [key]: options[key][0].value }));
//     }
//     setFilterOptions(options);
//   };

//   const setColumnsFromResponse = (columns) => {
//     // 根据元数据构建列定义
//     const generatedColumns = columns.map((col, index) => ({
//       title: col.title || '', // 为属性提供默认值
//       dataIndex: col.dataIndex || '',
//       key: col.key || '',
//       fixed: index === 0 ? 'left' : undefined,
//       sorter: true, // 允许排序
//       sortOrder: sort.field === col.dataIndex ? sort.order : false,
//       render: (text, record) => {
//         // 使用 record.id 获取 id 字段
//         if (col.key === 'img' || col.type === 'base64') {
//           return   <Image  src={`data:image/png;base64,${text}`} />
//         }
      

//         const id = record.id;
//         if (col.link) {
//           return <a href={`/data/bar?id=${id}`} title={text} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</a>
//         } else {
//           return <div title={text} style={{ maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
//         }
        

//       },
//     }));
//     setColumns(generatedColumns);
//   }
  

//   const handleSearch = (value) => {
//     setQkey(value) 
//   };

//   const handleTableChange = (pagination, filters, sorter) => {
//     const { field, order } = sorter;
//     setSort({ field, order });
//   };
 

//     // 用于更新 dataStates 的逻辑
//   useEffect(() => {
//     // 只在相关值发生更改时更新 dataStates
//     if (prevDataNameRef.current === dataName) {
//       setDataStates((prevDataStates) => ({
//         ...prevDataStates,
//         [dataName]: { currentPage, selectedFilters, qkey, sort, isFiltersInitialized,filterOptions },
//       }));
//     } else {
//       prevDataNameRef.current = dataName;
//     }
//   }, [dataName, currentPage, selectedFilters, qkey, sort,isFiltersInitialized,filterOptions]);

//   useEffect(() => {

//     // setCurrentPage(currentDataState.currentPage);
//     // setSelectedFilters(currentDataState.selectedFilters); 
//     // setQkey(currentDataState.qkey); 
//     // setSort(currentDataState.sort); 

//     const currentDataState = dataStates[dataName] || defaultState;
//     setCurrentDataState(currentDataState);
//     const url = `${baseURL}/q?name=${dataName}&page=${currentDataState.currentPage}&size=20`
//               + `&filter=${JSON.stringify(currentDataState.selectedFilters)}`
//               +`&qkey=${currentDataState.qkey}&sort_field=${currentDataState.sort.field}&sort_order=${currentDataState.sort.order}`;

//     axios.get(url).then((response) => { 
//       let ret_data = response.data
//       //console.log("ret_data--",ret_data)
//       if (typeof response.data === 'string') {
//         ret_data = JSON.parse(response.data)
//       }

//       setData(ret_data.data);
//       setTotal(ret_data.total_cnt);
//       //设置导航
//       if (!currentDataState.isFiltersInitialized) {
//         //仅仅在第一次加载时设置导航
//         setFilterOptionsFromResponse(response.data.navs)
//         console.log("currentDataState.isFiltersInitialized--",currentDataState.isFiltersInitialized,filterOptions,response.data.navs)
//         currentDataState.isFiltersInitialized = true;
//         setIsFiltersInitialized(true); // 标记过滤选项已初始化
//       } 
//       setColumnsFromResponse(ret_data.columns)

//     }).catch((error) => {
//       console.error('An error occurred while fetching data:', error);
//     });
//   }, [dataName,dataStates]); //,filterOptions ,filterOptions #location.pathname

//   return (
//     <>
//     <div style={{margin:"10px 10px 0px 30px"}}>
//     <Breadcrumb style={{ marginBottom: 0 }}>
//     <Breadcrumb.Item><Link to="/">数据</Link></Breadcrumb.Item>
//     <Breadcrumb.Item>
//         <Link to="/stg/factor">行情</Link>
//     </Breadcrumb.Item>
//     {/* <Breadcrumb.Item>{name}</Breadcrumb.Item> */}
//    </Breadcrumb>
//    </div>
//   <PageContainer 
//       extra={[ 
//         // <Button key="1" type="primary">
//         //   主操作
//         // </Button>,
//       ]}
//       tabList={[
//         {
//           tab: '明细',
//           key: '1',
//         },
//         {
//           tab: '统计',
//           key: '2',
//         }
//       ]}
//       onTabChange={handleTabChange}

//     />
//    <div style={{margin:'10px 10px 10px 10px'}}>
//    {activeTab === '1' && 
//      <>
//       <div style={{ display: 'flex', background:"#fff", 
//       padding: '15px 20px 10px 20px',
//       justifyContent: 'space-between', alignItems: 'center',marginBottom:0}}>
//         <div>
//           {Object.keys(currentDataState.filterOptions).map((key) => (
//             <>
//               <Radio.Group key={key}
//                 style={{ marginRight: 20 }}
//                 value={currentDataState.selectedFilters[key]}
//                 onChange={(e) => handleFilterChange(key, e.target.value)}
//               >
//                 {currentDataState.filterOptions[key].map((option) => (
//                   <Radio.Button key={option.value} value={option.value}>
//                     {option.label}
//                   </Radio.Button>
//                 ))}
//               </Radio.Group>
//             </>
//           ))}
//         </div>
//         <Input.Search
//           placeholder="search"
//           onSearch={handleSearch}
//           style={{ width: 200 }}
//         />
//       </div>
//         <Table columns={columns} dataSource={data}  //rowKey={record => record.code}
//           scroll={{ x: 'max-content' }}
//           style={{   padding: '0'}}  
//           onChange={handleTableChange} 
//           //size='middle'
//           pagination={{ // 分页配置
//               current: currentDataState.currentPage,
//               pageSize:20,
//               total:total,
//               showTotal:(total) => `共 ${total} 条`,
//               onChange: (page) => setCurrentPage(page),
//           }} />;
//      </>
//     }

//     {activeTab === '2'  && 
//       <>sdsd</>
//     }
//      </div>
//     </>
//     )};

// export default KData;