import React, { useEffect, useState } from 'react';
import { Radio, Row, Col, Space } from 'antd';

const KNavTree = ({ data, onChange }) => {
  const [selected, setSelected] = useState({});
  const initialLevel = data[0]?.level || 'root';

  const renderRadioGroup = (nodes, level) => (
    <Radio.Group
      key={level}
      defaultValue={selected[level] || (nodes.length > 0 ? nodes[0].key : undefined)}
      onChange={(e) => handleRadioChange(level, e)}
      buttonStyle="solid"
      style={{ marginRight: 20 }}
    >
      {nodes.map((node) => (
        <Radio.Button key={node.key} value={node.key}>
          {node.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );

  const renderCascade = (nodes, level = initialLevel) => (
    <Space wrap key={level}>
      {renderRadioGroup(nodes, level)}
      {nodes.map((node) => {
        if ((selected[level] || (nodes.length > 0 ? nodes[0].key : undefined)) === node.key && node.children) {
          return renderCascade(node.children, node.children[0]?.level);
        }
        return null;
      })}
    </Space>
  );

  useEffect(() => {
    const initSelected = {};
    const findSelected = (nodes, level) => {
      let found = false;
      for (const node of nodes) {
        if (node.selected) {
          initSelected[level] = node.key;
          if (node.children) {
            findSelected(node.children, node.children[0]?.level);
          }
          found = true;
          break;
        }
      }

      if (!found && nodes.length > 0) {
        initSelected[level] = nodes[0].key;
        if (nodes[0].children) {
          findSelected(nodes[0].children, nodes[0].children[0]?.level);
        }
      }
    };

    findSelected(data, initialLevel);
    setSelected(initSelected);

    if (onChange) {
      onChange(initSelected);
    }
  }, [data]);

  const handleRadioChange = (level, e) => {
    const newSelected = { ...selected, [level]: e.target.value };
    setSelected(newSelected);

    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Row justify="space-between" align="middle" style={{ background: '#fff', marginBottom: 0, padding: '18px 20px 12px 20px', margin: '0 0 10px 0' }}>
      <Col flex="auto">
        {renderCascade(data)}
      </Col>
    </Row>
  );
};

export default KNavTree;
