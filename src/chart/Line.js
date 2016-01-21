/**
 * @fileOverview Line
 */
import React, { PropTypes } from 'react';
import Curve from '../shape/Curve';
import Dot from '../shape/Dot';
import Layer from '../container/Layer';
import pureRender from 'pure-render-decorator';
import ReactUtils from '../util/ReactUtils';
import { findDOMNode } from 'react-dom';
import Animate from 're-animate';

@pureRender
class Line extends React.Component {

  static displayName = 'Line';

  static propTypes = {
    type: PropTypes.oneOf(['linear', 'monotone', 'step', 'stepBefore', 'stepAfter']),
    unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    yAxisId: PropTypes.number,
    xAxisId: PropTypes.number,
    legendType: PropTypes.string,
    formatter: PropTypes.func,

    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    className: PropTypes.string,
     // whether have dot in line
    dot: PropTypes.oneOfType([PropTypes.object, PropTypes.element, PropTypes.bool]),
    label: PropTypes.oneOfType([PropTypes.object, PropTypes.element, PropTypes.bool]),

    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      value: PropTypes.value,
    })),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    layout: PropTypes.string,
    isAnimationActive: PropTypes.bool,
    animationBegin: PropTypes.number,
    animationDuration: PropTypes.number,
    animationEasing: PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  };

  static defaultProps = {
    xAxisId: 0,
    yAxisId: 0,
    dot: true,
    legendType: 'line',
    stroke: '#3182bd',
    strokeWidth: 1,
    fill: '#fff',
    points: [],
    onClick() {},
    onMouseEnter() {},
    onMouseLeave() {},
    layout: 'vertical',
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
  };

  constructor(props) {
    super(props);
  }

  state = {
    isAnimationFinished: false,
    totalLength: 0,
  };

  componentDidMount() {
    const { isAnimationActive } = this.props;

    if (!isAnimationActive) {
      return;
    }

    const totalLength = findDOMNode(this.refs.curve).getTotalLength() || 0;

    this.setState({ totalLength });
  }

  handleAnimationEnd() {
    this.setState({ isAnimationFinished: true });
  }

  renderDots() {
    const { dot, points, isAnimationActive } = this.props;
    const lineProps = ReactUtils.getPresentationAttributes(this.props);
    const customDotProps = ReactUtils.getPresentationAttributes(dot);
    const isDotElement = React.isValidElement(dot);

    if (isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }

    const dots = points.map((entry, i) => {
      const dotProps = {
        key: `dot-${i}`,
        r: 3,
        ...lineProps,
        ...customDotProps,
        cx: entry.x,
        cy: entry.y,
        index: i,
        payload: entry,
      };

      return isDotElement ? React.cloneElement(dot, dotProps) : <Dot {...dotProps}/>;
    });

    return <Layer className="recharts-layer-line-dots">{dots}</Layer>;
  }

  renderLabels() {
    const { points, label } = this.props;
    const lineProps = ReactUtils.getPresentationAttributes(this.props);
    const customLabelProps = ReactUtils.getPresentationAttributes(label);
    const isLabelElement = React.isValidElement(label);

    const labels = points.map((entry, i) => {
      const x = entry.x + entry.width / 2;
      const y = entry.y;
      const labelProps = {
        textAnchor: 'middle',
        ...entry,
        ...lineProps,
        ...customLabelProps,
        index: i,
        key: `label-${i}`,
        payload: entry,
      };

      return isLabelElement ? React.cloneElement(label, labelProps) : (
        <text {...labelProps}>{entry.value}</text>
      );
    });

    return <Layer className="recharts-layer-line-labels">{labels}</Layer>;
  }

  render() {
    const {
      dot,
      points,
      label,
      className,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      ...other,
    } = this.props;
    const { totalLength } = this.state;

    if (!points || !points.length) {
      return null;
    }
    const hasSinglePoint = points.length === 1;

    return (
      <Layer className={'recharts-line ' + (className || '')}>
        {!hasSinglePoint && (
          <Animate isActive={isAnimationActive}
            begin={animationBegin}
            canBegin={totalLength > 0}
            from={'0px ' + (totalLength === 0 ? 1 : totalLength) + 'px'}
            to={totalLength + 'px 0px'}
            easing={animationEasing}
            duration={animationDuration}
            attributeName="strokeDasharray"
            onAnimationEnd={::this.handleAnimationEnd}
          >
            <Curve
              {...other}
              fill="none"
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
              onClick={this.props.onClick}
              points={points}
              ref="curve"
            />
          </Animate>
        )}
        {(hasSinglePoint || dot) && this.renderDots()}
        {label && this.renderLabels()}
      </Layer>
    );
  }
}

export default Line;
