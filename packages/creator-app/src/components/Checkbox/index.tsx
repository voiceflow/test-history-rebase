import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Button, ButtonContainer, Container } from './components';
import { CheckboxColor, CheckboxType } from './constants';

export { CheckboxType } from './constants';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: CheckboxType;
  error?: boolean;
  isFlat?: boolean;
  padding?: boolean;
}

const getIcon = (type: CheckboxType, checked?: boolean) => {
  switch (type) {
    case CheckboxType.CHECKBOX:
      return checked ? 'checked' : 'emptyCheckbox';
    case CheckboxType.DASH:
      return checked ? 'checkboxDash' : 'emptyCheckbox';
    default:
      return checked ? 'onRadioButton' : 'offRadioButton';
  }
};

const Checkbox: React.FC<CheckboxProps> = ({
  type = CheckboxType.CHECKBOX,
  error,
  color = CheckboxColor.DEFAULT,
  isFlat,
  padding = true,
  checked,
  children,
  disabled,
  className,
  ...props
}) => {
  // eslint-disable-next-line no-nested-ternary
  const checkBoxColor = error && !checked ? CheckboxColor.ERROR : disabled || !checked ? CheckboxColor.DISABLED : color;

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
        <Button type={type} checked={checked} disabled={disabled} color={checkBoxColor} {...props} />
        <SvgIcon color={checkBoxColor} size={16} icon={icon} ignoreEvents />
      </ButtonContainer>
      {children}
    </Container>
  );
};

export default Checkbox;
