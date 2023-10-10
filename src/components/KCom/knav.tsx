// CustomTable.js
import React, { useEffect, useState } from 'react';
import { Col, Radio, Row, Select } from 'antd';
const { Option } = Select;

 
interface NavItemOption {
    key: string;
    label: string;
    rank?: number;  // 根据实际情况，此字段可能是可选的
  }
  
  interface NavItem {
    name: string;
    values: NavItemOption[];
    selected: string;
    label: string;
  }
  
  // 然后，可以在 NavsBarProps 接口中更新 filterOptions 的类型定义：
  interface NavsBarProps {
    navOptions: NavItem[];
    handleNavChange: (key: string, value: any) => void;  // 根据实际情况定义正确的类型
  }

const KNav: React.FC<NavsBarProps> = ({ navOptions, handleNavChange }) => {   
  const navs_bar = () => {
    return (
      <Row justify="space-between" align="middle" style={{ background: "#fff", marginBottom: 0 }}>
        <Col flex="auto">
          {navOptions.map((navItem) => {
            const { name, values, selected } = navItem;
            const defaultSelected = selected || (values.length > 0 ? values[0].key : null);
  
            if (values.length > 12) {
              return (
                <Select
                  key={name}
                  defaultValue={defaultSelected}
                  style={{ width: 120, margin: '10px 20px 10px 20px' }}
                  onChange={(value) => handleNavChange(name, value)}
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
                  onChange={(e) => handleNavChange(name, e.target.value)}
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
  return (  

    <div style={{
        margin: '0px 0px 10px 0px',
        background: '#fff', 
        padding: '15px 20px 10px 20px',
      }}>
          {navs_bar()}
          {/* <Divider /> 
          { search_bar()} */}
    </div>
   
    
  );
};

export default KNav;