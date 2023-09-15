import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const setHighchartsLangOptions = () => {
  Highcharts.setOptions({
    lang: {
        rangeSelectorZoom: '',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

        }
  });
};

const processData = (rawData) => {
  const ohlc = [];
  const volume = [];
  rawData.forEach((item) => {
    const dateStr = item["time"];
    const formattedDateString = `${dateStr.substring(0, 4)}-${dateStr.substring(5, 7)}-${dateStr.substring(8, 9)}`;
    const date = new Date(formattedDateString);
    //console.log(dateStr,formattedDateString,date);

    const timestamp = date.getTime();
    ohlc.push([timestamp, item["open"], item["high"], item["low"], item["close"]]);
    volume.push([timestamp, item["amount"]]);
  });
  console.log("rawData--",rawData);
  const title = rawData[0]["name"] + "(" + rawData[0]["code"] +")";
  return { title,ohlc, volume };
};

const generateChartOptions = (title, ohlc, volume) => {
  return  { 
    lang: {
      rangeSelectorZoom: ''
   },
    chart: {
      //width: '100%',
      height: 800,
    },
    rangeSelector: {
      allButtonsEnabled: true,

                  inputDateFormat: '%Y-%m-%d',
      buttons: [ {
          type: 'month',
          count: 1,
          text: '1月'
        }, {
          type: 'month',
          count: 3,
          text: '3月'
      },   {
        type: 'year',
        count: 1,
        text: '1年'
      }, {
        type: 'year',
        count: 3,
        text: '3年'
      },
    ],
    selected: 4,
    },
    title: {
      text: title,
    },
    tooltip: {
                  split: false,
                  shared: true,
            },
    xAxis: {
      dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%m-%d',
          week: '%m-%d',
          month: '%y-%m',
          year: '%Y'
        }
    },
    yAxis: [{
                  labels: {
                          align: 'right',
                          x: -3
                  },
                  title: {
                          text: '股价'
                  },
                  height: '75%',
                  resize: {
                          enabled: true
                  },
                  lineWidth: 2
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: '成交量'
        },
        top: '75%',
        height: '25%',
        offset: 0,
        lineWidth: 2
    }],

    series: [{
      type: 'candlestick',
      name: '平安银行',
      color: 'green',
      lineColor: 'green',
      upColor: 'red',
      upLineColor: 'red',
      tooltip: {
      },
      navigatorOptions: {
          color: Highcharts.getOptions().colors[0]
      },
      data: ohlc,
    //   dataGrouping: {
    //       units: groupingUnits
    //   },
      id: 'sz'
  },
  {
      type: 'column',
      data: volume,
      yAxis: 1,
    //   dataGrouping: {
    //       units: groupingUnits
    //   }
  }
  ],
  };
};

const HChartBar = ({ id, data }) => {
  const [options, setOptions] = useState({});
  console.log("data--",data);
  useEffect(() => {
    setHighchartsLangOptions();
    const {title, ohlc, volume } = processData(data);
    const newOptions = generateChartOptions(title, ohlc, volume);
    setOptions(newOptions);
  }, [id, data]);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
      />
    </div>
  );
};

export default HChartBar;