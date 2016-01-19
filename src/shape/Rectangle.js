import React, { PropTypes } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
class Rectangle extends React.Component {

  static displayName = 'Rectangle';

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.array,
    ]),
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    className: PropTypes.string,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // The radius of border
    // The radius of four corners when radius is a number
    // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
    radius: 0,
    stroke: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    fill: '#000',
    onMouseEnter() {},
    onMouseLeave() {},
    onClick() {},
  };

  getPath(x, y, width, height, radius) {
    const maxRadius = Math.min(width / 2, height / 2);
    let newRadius = [];
    let path;

    if (maxRadius > 0 && radius instanceof Array) {
      for (let i = 0, len = 4; i < len; i++) {
        newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
      }

      path = `M${x},${y + newRadius[0]}`;

      if (newRadius[0] > 0) {
        path += `A ${newRadius[0]},${newRadius[0]},0,0,1,${x + newRadius[0]},${y}`;
      }

      path += `L ${x + width - newRadius[1]},${y}`;

      if (newRadius[1] > 0) {
        path += `A ${newRadius[1]},${newRadius[1]},0,0,1,${x + width},${y + newRadius[1]}`;
      }
      path += `L ${x + width},${y + height - newRadius[2]}`;

      if (newRadius[2] > 0) {
        path += `A ${newRadius[2]},${newRadius[2]},0,0,1,${x + width - newRadius[2]},${y + height}`;
      }
      path += `L ${x + newRadius[3]},${y + height}`;

      if (newRadius[3] > 0) {
        path += `A ${newRadius[3]},${newRadius[3]},0,0,1,${x},${y + height - newRadius[3]}`;
      }
      path += 'Z';

    } else if (maxRadius > 0 && radius === +radius && radius > 0) {
      newRadius = radius > maxRadius ? maxRadius : radius;

      path = `M ${x},${y + newRadius} A ${newRadius},${newRadius},0,0,1,${x + newRadius},${y}`
           + `L ${x + width - newRadius},${y} A ${newRadius},${newRadius},0,0,1,${x + width},${y + newRadius}`
           + `L ${x + width},${y + height - newRadius} A ${newRadius},${newRadius},0,0,1,${x + width - newRadius},${y + height}`
           + `L ${x + newRadius},${y + height} A ${newRadius},${newRadius},0,0,1,${x},${y + height - newRadius} Z`;

    } else {
      path = `M ${x},${y} h ${width} v ${height} h ${-width} Z`;
    }

    return path;
  }

  render() {
    const { x, y, width, height, radius,
        onClick, onMouseEnter, onMouseLeave,
        className, ...others } = this.props;

    if (x !== +x || y !== +y || width !== +width || height !== +height) {
      return null;
    }

    return (
      <path
        {...others}
        className={'recharts-rectangle ' + (className || '')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        d={this.getPath(x, y, width, height, radius)}
      />
    );
  }
}

export default Rectangle;
