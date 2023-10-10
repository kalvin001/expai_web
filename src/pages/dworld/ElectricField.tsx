import React from 'react';
import Plot from 'react-plotly.js';

const VectorFieldDemo = () => {
  const x = [];
  const y = [];
  const u = [];
  const v = [];

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      x.push(i);
      y.push(j);
      u.push(Math.random() - 0.5);
      v.push(Math.random() - 0.5);
    }
  }

  return (
    <Plot
      data={[
        {
          type: 'cone',
          x: x,
          y: y,
          u: u,
          v: v,
          w: Array(x.length).fill(0),
          sizemode: 'scaled',
          sizeref: 2,
        },
      ]}
      layout={{
        width: 600,
        height: 600,
        margin: { t: 0, b: 0, l: 0, r: 0 },
        scene: {
          aspectratio: { x: 1, y: 1, z: 1 },
        },
      }}
    />
  );
};

export default VectorFieldDemo;
