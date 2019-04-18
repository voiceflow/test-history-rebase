import React, { Fragment } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export default function Checkbox(props) {
  const {
    id,
    label,
    error,
    isRadio,
    disabled,
    className,
    wrapValue,
    noWrapValue,
    iconKey,
    onIconClick,
    ...ownProps
  } = props;

  return (
    <Fragment>
      <label className={cn(className, 'form-checkbox', { '__is-disabled': disabled })}>
        <div className="form-checkbox__btn">
          <input
            {...ownProps}
            id={`${id}`}
            type={isRadio ? 'radio' : 'checkbox'}
            disabled={disabled}
            className="form-checkbox__input"
          />
          <span className="form-checkbox__fake" />
        </div>

        {label && (
          <div className="form-checkbox__value">
            {noWrapValue || wrapValue ? (
              <div className={noWrapValue ? 'text-nowrap' : 'text-wrap'}>{label}</div>
            ) : (
              label
            )}

            {
              iconKey && (
                <span className="form-checkbox__action" onClick={onIconClick}>
                  <i className={`sl-icon sl-icon-${iconKey}`} />
                </span>
              )
            }
          </div>
        )}
      </label>

      {!!error && <small className="form-hint text-danger">{error}</small>}
    </Fragment>
  );
}

Checkbox.propTypes = {
  id: PropTypes.any,
  label: PropTypes.any,
  error: PropTypes.string,
  isRadio: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapValue: PropTypes.bool,
  noWrapValue: PropTypes.bool,
};
