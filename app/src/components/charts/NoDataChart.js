import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class NoDataChart extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    horizontalValues: PropTypes.array.isRequired,
  };

  render() {
    const { title, values, horizontalValues } = this.props;

    return (
      <div className="chart-nodata">
        <div className="chart-nodata__text">{title}</div>
        <ul className="chart-nodata-list">
          {values.map((value, index) => (
            <li
              key={index}
              className={cn('chart-nodata-list__list-item', {
                __last: values.length === index + 1,
              })}
            >
              <div className="chart-nodata-list__label">{value}</div>
              <div className="chart-nodata-list__value">
                <div className="chart-nodata-list__line" />
              </div>
            </li>
          ))}
          {horizontalValues.length && (
            <li className="chart-nodata-list__list-item __horizontal-values">
              <div className="chart-nodata-list__label">&nbsp;</div>
              <div className="chart-nodata-list__value">
                <ul className="chart-nodata-bottom-list">
                  {horizontalValues.map((value, index) => (
                    <li key={index} className="chart-nodata-bottom-list__list-item">
                      {Number.isInteger(value) ? value : <strong>{value}</strong>}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
