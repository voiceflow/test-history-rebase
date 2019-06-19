import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';

export default function Icon({ custom, className, isBig, textPosition, textSmPosition, ...props }) {
  const iconClassName = isBig ? `sl-big-icon sl-big-icon-${className}` : `sl-icon sl-icon-${className}`;

  return (
    <i
      className={cn(custom ? className : iconClassName, {
        '__text-position': textPosition,
        '__text-sm-position': textSmPosition,
      })}
      {...props}
    />
  );
}

Icon.propTypes = {
  custom: PropTypes.bool,
  textPosition: PropTypes.bool,
};

Icon.defaultProps = {
  custom: false,
};
