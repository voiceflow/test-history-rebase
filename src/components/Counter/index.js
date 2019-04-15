import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

import Tooltip from '../Tooltip';

export default function Counter(props) {
  const { limit, length, absolute, className, withLabel, counterWord, withDangerLabel } = props;

  const isDanger = length > limit;
  let style = {};

  if (absolute) {
    style = {
      top: '-13px',
      height: '0',
      position: 'relative',
    };
  }

  return (
    <Tooltip
      gap={1}
      text={isDanger ? null : `${limit - length} of ${limit} ${counterWord} left`}
      TagName="div"
      buttonProps={{ style }}
    >
      <div className={cn('barchart-group', className)}>
        {(withLabel || (withDangerLabel && isDanger)) && (
          <div className="barchart-group__label">
            <span className={cn({ 'text-danger': isDanger })}>{length}</span>/{limit}
          </div>
        )}

        <div className="barchart-group__value">
          <div className={cn('barchart', { '__has-danger': isDanger })}>
            <div className="barchart-line" />
            <div
              style={{ width: `${Math.min((length / limit) * 100, 100)}%` }}
              className="barchart-track"
            />
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

Counter.propTypes = {
  limit: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  absolute: PropTypes.bool,
  className: PropTypes.string,
  withLabel: PropTypes.bool,
  counterWord: PropTypes.string,
  withDangerLabel: PropTypes.bool,
};

Counter.defaultProps = {
  counterWord: 'symbols',
};
