/**
 * @fileOverview Area
 */
import React, { PropTypes } from 'react';
import Curve from '../shape/Curve';
import Dot from '../shape/Dot';
import Layer from '../container/Layer';
import ReactUtils from '../util/ReactUtils';
import pureRender from 'pure-render-decorator';

@pureRender
class Area extends React.Component {

  static displayName = 'Area';

  static propTypes = {
    type: PropTypes.string,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    className: PropTypes.string,
    // dot configuration
    dot: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.bool]),
    // have curve configuration
    curve: PropTypes.bool,
    baseLineType: PropTypes.oneOf(['horizontal', 'vertical', 'curve']),
    baseLine: PropTypes.oneOfType([
      PropTypes.number, PropTypes.array,
    ]),
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      value: PropTypes.value,
    })),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    strokeWidth: 1,
    // 数据
    data: [],
    dot: false,
    curve: true,
    onClick() {},
    onMouseEnter() {},
    onMouseLeave() {},
  };

  constructor(props) {
    super(props);
  }

  renderArea() {
    const { stroke, className, ...other } = this.props;

    return <Curve {...other} stroke="none"/>;
  }

  renderCurve() {
    const { points, type } = this.props;

    return <Curve {...ReactUtils.getPresentationAttributes(this.props)} points={points} type={type} fill="none" />;
  }

  renderDots() {
    const { dot, points } = this.props;
    const areaProps = ReactUtils.getPresentationAttributes(this.props);
    const customDotProps = ReactUtils.getPresentationAttributes(dot);
    const isDotElement = React.isValidElement(dot);

    const dots = points.map((entry, i) => {
      const dotProps = {
        key: `dot-${i}`,
        r: 3,
        ...areaProps,
        ...customDotProps,
        cx: entry.x,
        cy: entry.y,
        index: i,
        playload: entry,
      };

      return isDotElement ? React.cloneElement(dot, dotProps) : <Dot {...dotProps}/>;
    });

    return <Layer className="recharts-layer-area-dots">{dots}</Layer>;
  }

  render() {
    const { dot, curve, points, className, ...other } = this.props;

    if (!points || !points.length) {
      return null;
    }
    const hasSinglePoint = points.length === 1;

    return (
      <Layer className={`recharts-line ${className || ''}`}>
        {curve && !hasSinglePoint && this.renderCurve()}
        {!hasSinglePoint && this.renderArea()}

        {(dot || hasSinglePoint) && this.renderDots()}
      </Layer>
    );
  }
}

export default Area;
