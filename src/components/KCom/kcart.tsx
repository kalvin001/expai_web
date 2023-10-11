import React from 'react';
import { Card, Image } from 'antd';
import { baseURL } from "@/app" 
const KCart = ({data,config }) => {
  const data_ = data.data
  const data_type = data.data_type 

  //console.log('data.page_size',config.page_size);
  if (data_type === 'img') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
      {data_.map((item, index) => (
          <Card key={index}   style={{ 
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
    );
  } else if (data_type === 'audio') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {data_.map((item, index) => (
          <Card key={index}>
            <audio controls>
              <source src={`data:audio/mp3;base64,${item.audio}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </Card>
        ))}
      </div>
    );
  } else if (data_type === 'video') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {data_.map((item, index) => (
          <Card key={index}>
            <video width="320" height="240" controls>
              <source src={`${baseURL}/video?name=${item.video_path}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        ))}
      </div>
    );
  }

  return null;  // 或者你可以返回一个默认的空白或者占位组件
};

export default KCart;
