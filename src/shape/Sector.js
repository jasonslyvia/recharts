import React, { PropTypes } from 'react';
import pureRender from 'pure-render-decorator';
const RADIAN = Math.PI / 180;

@pureRender
class Sector extends React.Component {

  static displayName = 'Sector';

  static propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
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
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
    onMouseEnter() {},
    onMouseLeave() {},
    onClick() {},
  };

  constructor(props) {
    super(props);
  }

  getPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
    const angle = endAngle - startAngle;
    // When the angle of sector equals to 360, star point and end point coincide
    const _endAngle = Math.abs(angle) >= 360 ? startAngle + 0.9999 * angle : endAngle;
    let path;


    if (innerRadius > 0) {
      path = `M ${cx + outerRadius * Math.cos(-startAngle * RADIAN)},${cy + outerRadius * Math.sin(-startAngle * RADIAN)}
              A ${outerRadius},${outerRadius},0,${+(Math.abs(angle) > 180)},${+(startAngle > _endAngle)},
              ${cx + outerRadius * Math.cos(-_endAngle * RADIAN)},${cy + outerRadius * Math.sin(-_endAngle * RADIAN)}
              L ${cx + innerRadius * Math.cos(-_endAngle * RADIAN)},${cy + innerRadius * Math.sin(-_endAngle * RADIAN)}
              A ${innerRadius},${innerRadius},0,${+(Math.abs(angle) > 180)},${+(startAngle <= _endAngle)},
              ${cx + innerRadius * Math.cos(-startAngle * RADIAN)},${cy + innerRadius * Math.sin(-startAngle * RADIAN)} Z`;
    } else {
      path = `M ${cx + outerRadius * Math.cos(-startAngle * RADIAN)},${cy + outerRadius * Math.sin(-startAngle * RADIAN)}
              A ${outerRadius},${outerRadius},0,${+(Math.abs(angle) > 180)},${+(startAngle > _endAngle)},
              ${cx + outerRadius * Math.cos(-_endAngle * RADIAN)},${cy + outerRadius * Math.sin(-_endAngle * RADIAN)}
              L ${cx},${cy} Z`;
    }

    return path;
  }

  render() {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
          onClick, onMouseEnter, onMouseLeave, className,
          ...others } = this.props;

    if (outerRadius < innerRadius || startAngle === endAngle) {
      return null;
    }

    return (
      <path
        {...others}
        className={'recharts-sector' + (className || '')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        d={this.getPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
      />
    );
  }
}

export default Sector;
