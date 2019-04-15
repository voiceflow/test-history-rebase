import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export default function Header(props) {
  const {
    title,
    className,
    leftRenderer,
    rightRenderer,
    leftClassName,
    gridClassName,
    rightClassName,
    centerRenderer,
    subHeaderRenderer,
  } = props;

  return (
    <div className={cn('header', className)}>
      <div className="header-inner">
        <div className={cn('header-grid', gridClassName)}>
          {(leftRenderer || !!title) && (
            <div className={cn('header-grid__left', leftClassName)}>
              {leftRenderer && leftRenderer()}

              {!!title && <div className="header__title">{title}</div>}
            </div>
          )}

          {centerRenderer && <div className="header-grid__center">{centerRenderer()}</div>}

          {rightRenderer && (
            <div className={cn('header-grid__right', rightClassName)}>{rightRenderer()}</div>
          )}
        </div>
      </div>

      {subHeaderRenderer && subHeaderRenderer()}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
  leftRenderer: PropTypes.func,
  rightRenderer: PropTypes.func,
  leftClassName: PropTypes.string,
  gridClassName: PropTypes.string,
  rightClassName: PropTypes.string,
  centerRenderer: PropTypes.func,
  subHeaderRenderer: PropTypes.func,
};
