import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { Button, ButtonContainer, Container, IconContainer } from './components';
import * as T from './types';

export * as CheckboxTypes from './types';

const getIcon = (type: T.Type, checked?: boolean): SvgIconTypes.Icon => {
  switch (type) {
    case T.Type.CHECKBOX:
      return checked ? 'checked' : 'emptyCheckbox';
    case T.Type.DASH:
      return checked ? 'checkboxDash' : 'emptyCheckbox';
    default:
      return checked ? 'onRadioButton' : 'offRadioButton';
  }
};

export const getCheckboxColor = (color: string, error?: boolean, disabled?: boolean, checked?: boolean): string => {
  if (checked) return color;
  if (error) return T.Color.ERROR;
  if (disabled) return T.Color.DISABLED;
  return color;
};

const Checkbox: React.FC<T.Props> = ({
  type = T.Type.CHECKBOX,
  error,
  color = T.Color.DEFAULT,
  isFlat,
  padding = true,
  checked,
  onChange = Utils.functional.noop,
  children,
  disabled,
  className,
  ...props
}) => {
  const checkBoxColor = getCheckboxColor(color, error, disabled, checked);
  const icon = getIcon(type, checked);

  // eslint-disable-next-line xss/no-mixed-html
  const onLabelClick = (event: React.MouseEvent<HTMLLabelElement>) => {
    // onClick events are fired to times when clicked on the label
    // first time called for the label itself, and the second time for the checkbox, it's native browser behavior
    // so we need to stop propagation first event
    if ((event.target as HTMLElement).tagName !== 'INPUT') {
      event.stopPropagation();
    }
  };

  const inputType = type === T.Type.DASH ? T.Type.CHECKBOX : type;

  return (
    <Container isFlat={isFlat} disabled={disabled} className={className} onClick={onLabelClick}>
      <ButtonContainer padding={padding}>
        <Button type={inputType} checked={checked} disabled={disabled} color={checkBoxColor} onChange={onChange} {...props} />

        <IconContainer checked={checked}>
          <SvgIcon color={checkBoxColor} size={16} icon={icon} ignoreEvents />
        </IconContainer>
      </ButtonContainer>

      {children}
    </Container>
  );
};

export default Object.assign(Checkbox, {
  Type: T.Type,
  Color: T.Color,
});
