// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Checkbox from '../Checkbox';
import GroupFormInline from '../GroupFormInline';

export const YES_NO_RADIO_BUTTONS = [
  {
    id: true,
    label: 'Yes',
  },
  {
    id: false,
    label: 'No',
  },
];

export default function RadioButtons(props) {
  const { label, checked, buttons, onChange, className, disabledAll } = props;
  return (
    <Fragment>
      {!!label && <label className="form-label">{label}</label>}

      <GroupFormInline
        cols={buttons.map((button) => ({
          content: (
            <Checkbox
              {...button}
              value={button.id}
              checked={checked === button.id}
              disabled={disabledAll || button.disabled}
              onChange={() => onChange(button.id)}
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
