import React from 'react';
import CartesianChart from './CartesianChart';
import LodashUtils from '../util/LodashUtils';
import Surface from '../container/Surface';
import ReactUtils from '../util/ReactUtils';
import Legend from '../component/Legend';
import Tooltip from '../component/Tooltip';
import Area from '../chart/Area';
import Dot from '../shape/Dot';
import Curve from '../shape/Curve';

class AreaChart extends CartesianChart {
  static displayName = 'AreaChart';

  static defaultProps = {
    style: {},
    layout: 'horizontal',
    margin: { top: 5, right: 5, bottom: 5, left: 5 },
  };

  displayName = 'AreaChart';

  constructor(props) {
    super(props);
  }
  /**
   * Compose the data of each area
   * @param  {Object} xAxis   The configuration of x-axis
   * @param  {Object} yAxis   The configuration of y-axis
   * @param  {String} dataKey The unique key of a group
   * @return {Array} Composed data
   */
  getComposeData(xAxis, yAxis, dataKey) {
    const { data, layout } = this.props;
    const xTicks = this.getAxisTicks(xAxis);
    const yTicks = this.getAxisTicks(yAxis);
    const points = data.map((entry, index) => {
      return {
        x: layout === 'horizontal' ? xTicks[index].coord : xAxis.scale(entry[dataKey]),
        y: layout === 'horizontal' ? yAxis.scale(entry[dataKey]) : yTicks[index].coord,
        value: entry[dataKey],
      };
    });

    let range;
    let baseLine;

    if (layout === 'horizontal') {
      range = yAxis.scale.range();
      baseLine = xAxis.orient === 'top' ? Math.min(range[0], range[1]) : Math.max(range[0], range[1]);
    } else {
      range = xAxis.scale.range();
      baseLine = yAxis.orient === 'left' ? Math.min(range[0], range[1]) : Math.max(range[0], range[1]);
    }

    return {
      points,
      baseLine,
      baseLineType: layout,
    };
  }
  /**
   * Handler of mouse entering area chart
   * @param {String} key  The unique key of a group of data
   * @return {Object} null
   */
  handleAreaMouseEnter(key) {
    this.setState({
      activeAreaKey: key,
    });
  }
  /**
   * Handler of mouse leaving area chart
   * @return {Object} null
   */
  handleAreaMouseLeave() {
    this.setState({
      activeAreaKey: null,
    });
  }
  /**
   * Draw the main part of area chart
   * @param  {Array} items     React elements of Area
   * @param  {Object} xAxisMap The configuration of all x-axis
   * @param  {Object} yAxisMap The configuration of all y-axis
   * @param  {Object} offset   The offset of main part in the svg element
   * @return {ReactComponent} The instances of Area
   */
  renderItems(items, xAxisMap, yAxisMap, offset) {
    const { children } = this.props;
    const { activeAreaKey, isTooltipActive, activeTooltipIndex } = this.state;
    const tooltipItem = ReactUtils.findChildByType(children, Tooltip);
    const hasDot = tooltipItem && isTooltipActive;
    let areaItems = [];
    const dotItems = [];

    items.forEach((child, i) => {
      const { xAxisId, yAxisId, dataKey, fillOpacity, fill } = child.props;
      const xAxis = xAxisMap[xAxisId];
      const yAxis = yAxisMap[yAxisId];
      const composeData = this.getComposeData(xAxis, yAxis, dataKey);
      const activePoint = composeData.points && composeData.points[activeTooltipIndex];
      const pointStyle = { fill, strokeWidth: 4, stroke: '#fff' };

      let finalFillOpacity = fillOpacity === +fillOpacity ? fillOpacity : Area.defaultProps.fillOpacity;
      finalFillOpacity = activeAreaKey === dataKey ? Math.min(finalFillOpacity * 1.2, 1) : finalFillOpacity;

      const area = React.cloneElement(child, {
        key: 'area-' + i,
        ...offset,
        ...composeData,
        fillOpacity: finalFillOpacity,
        onMouseLeave: ::this.handleAreaMouseLeave,
        onMouseEnter: this.handleAreaMouseEnter.bind(this, dataKey),
      });

      areaItems = activeAreaKey === dataKey ? [...areaItems, area] : [area, ...areaItems];

      if (hasDot && activePoint) {
        dotItems.push(<Dot key={'area-dot-' + i} cx={activePoint.x} cy={activePoint.y} r={8} {...pointStyle}/>);
      }
    });

    return (
      <g key="recharts-area-wrapper">
        <g key="recharts-area">{areaItems}</g>
        <g key="recharts-area-dot">{dotItems}</g>
      </g>
    );
  }

  renderCursor(xAxisMap, yAxisMap, offset) {
    const { children } = this.props;
    const tooltipItem = ReactUtils.findChildByType(children, Tooltip);

    if (!tooltipItem || !this.state.isTooltipActive) {return null;}

    const { layout } = this.props;
    const { activeTooltipIndex } = this.state;
    const axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
    const ids = Object.keys(axisMap);
    const axis = axisMap[ids[0]];
    const ticks = this.getAxisTicks(axis);
    const start = ticks[activeTooltipIndex].coord;
    const x1 = layout === 'horizontal' ? start : offset.left;
    const y1 = layout === 'horizontal' ? offset.top : start;
    const x2 = layout === 'horizontal' ? start : offset.left + offset.width;
    const y2 = layout === 'horizontal' ? offset.top + offset.height : start;
    const cursorProps = {
      stroke: '#ccc',
      ...ReactUtils.getPresentationAttributes(tooltipItem.props.cursor),
      points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    };

    return React.isValidElement(tooltipItem.props.cursor) ?
          React.cloneElement(tooltipItem.props.cursor, cursorProps) :
          <Curve {...cursorProps} type="linear" className="recharts-cursor"/>;
  }

  render() {
    const { style, children } = this.props;
    const items = ReactUtils.findAllByType(children, Area);
    const legendItem = ReactUtils.findChildByType(children, Legend);

    let xAxisMap = this.getAxisMap('xAxis', items);
    let yAxisMap = this.getAxisMap('yAxis', items);
    const offset = this.getOffset(xAxisMap, yAxisMap);

    xAxisMap = this.getFormatAxisMap(xAxisMap, offset, 'xAxis');
    yAxisMap = this.getFormatAxisMap(yAxisMap, offset, 'yAxis');

    return (
      <div className="recharts-wrapper"
        style={{ position: 'relative', cursor: 'default', ...style }}
        onMouseEnter={this.handleMouseEnter.bind(this, offset, xAxisMap, yAxisMap)}
        onMouseMove={this.handleMouseMove.bind(this, offset, xAxisMap, yAxisMap)}
        onMouseLeave={::this.handleMouseLeave}
      >

        {legendItem && legendItem.props.layout === 'horizontal'
          && legendItem.props.verticalAlign === 'top'
          && this.renderLegend(items, offset, legendItem)
        }

        <Surface {...this.props}>
          {this.renderGrid(xAxisMap, yAxisMap, offset)}
          {this.renderReferenceLines(xAxisMap, yAxisMap, offset)}
          {this.renderXAxis(xAxisMap)}
          {this.renderYAxis(yAxisMap)}
          {this.renderCursor(xAxisMap, yAxisMap, offset)}
          {this.renderItems(items, xAxisMap, yAxisMap, offset)}
        </Surface>

        {legendItem && (legendItem.props.layout !== 'horizontal'
          || legendItem.props.verticalAlign !== 'top')
        && this.renderLegend(items, offset, legendItem)}
        {this.renderTooltip(items, offset)}
      </div>
    );
  }
}

export default AreaChart;
