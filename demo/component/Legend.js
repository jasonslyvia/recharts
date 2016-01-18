import React from 'react';
import {Surface, Legend} from 'recharts';

export default React.createClass({
  render () {
    let data = [{value: 'Apple', color: '#ff7300'}, {value: 'Samsung', color: '#bb7300'}, {value: 'Huawei', color: '#887300'}, {value: 'Sony', color: '#667300'}];
    let data2 = [{value: 'Apple', type: 'scatter', color: '#ff7300'}, {value: 'Samsung', type: 'scatter', color: '#bb7300'}, {value: 'Huawei', type: 'scatter', color: '#bb0067'}, {value: 'Sony', type: 'scatter', color: '#167300'}];
    let data3 = [{value: 'Apple', type: 'line', color: '#ff7300'}, {value: 'Samsung', type: 'line', color: '#bb7300'}, {value: 'Huawei', type: 'line', color: '#bb7300'}, {value: 'Sony', type: 'line', color: '#ff7812'}];

    return (
      <div>
        <Legend width={500} height={30} data={data} />

        <div style={{position: 'relative', height: 200}}>
          <Legend layout='vertical' width={200} height={100} data={data2} />
        </div>

        <div>
          <Legend width={200} height={30} data={data3} />
        </div>
      </div>
    );
  }
});

