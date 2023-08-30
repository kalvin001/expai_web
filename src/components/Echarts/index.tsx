import React from 'react';
import ReactECharts from 'echarts-for-react';

interface CurveProps {
  data: { [key: string]: any }[]; // 你可以根据实际数据结构进一步详细定义
  yKeys: string[];
}

const Curve: React.FC<CurveProps> = ({ data, yKeys }) => {
  // 创建一个 ECharts 的 option
  const option = {
    xAxis: {
      type: 'category',
      data: data.map(item => item.time),
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      data: yKeys,
      // 如果你想默认选择某些项，可以使用以下设置
      selected: yKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    },
    series: yKeys.map(key => ({
      name: key,
      data: data.map(item => item[key]),
      type: 'line',
      smooth: true,
    })),
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default Curve;
