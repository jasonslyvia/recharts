'use strict';

import React from 'react/addons';
import {Surface, Rectangle} from 'recharts';

export default React.createClass({
  render () {
    return (
      <Surface>
        <Rectangle x={50} y={50} width={80} height={100} radius={[5, 10, 8, 15]} fill='#ff7300'/>
      </Surface>
    );
  }
});


