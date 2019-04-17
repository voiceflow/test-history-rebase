import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Checkbox';
import GroupFormInline from '../GroupFormInline';

export default function RadioButtons(props) {
  const { label, checked, buttons, onChange, className, disabledAll } = props;

  return (
    <Fragment>
      {!!label && <label className="form-label">{label}</label>}

      <GroupFormInline
        cols={buttons.map(button => ({
          content: (
            <Checkbox
              {...button}
              value={button.id}
              isRadio
              checked={checked === button.id}
              disabled={disabledAll || button.disabled}
              onChange={() => onChange(button)}
            />
          ),
        }))}
        className={className}
      />
    </Fragment>
  );
}

RadioButtons.propTypes = {
  label: PropTypes.any,
  checked: PropTypes.any,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabledAll: PropTypes.bool,
};
