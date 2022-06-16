import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import { Button, ButtonContainer, Container } from './components';
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

const Checkbox: React.FC<T.Props> = ({
  type = T.Type.CHECKBOX,
  error,
  color = T.Color.DEFAULT,
  isFlat,
  padding = true,
  checked,
  children,
  disabled,
  className,
  ...props
}) => {
  // eslint-disable-next-line no-nested-ternary
  const checkBoxColor = error && !checked ? T.Color.ERROR : disabled || !checked ? T.Color.DISABLED : color;

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

  return (
    <Container isFlat={isFlat} disabled={disabled} className={className} onClick={onLabelClick}>
      <ButtonContainer padding={padding}>
        <Button type={type === T.Type.DASH ? T.Type.CHECKBOX : type} checked={checked} disabled={disabled} color={checkBoxColor} {...props} />
        <SvgIcon color={checkBoxColor} size={16} icon={icon} ignoreEvents />
      </ButtonContainer>

      {children}
    </Container>
  );
};

export default Object.assign(Checkbox, {
  Type: T.Type,
  Color: T.Color,
});
