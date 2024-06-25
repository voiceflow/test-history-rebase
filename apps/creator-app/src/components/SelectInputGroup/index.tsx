import type { BaseSelectProps } from '@voiceflow/ui';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

export enum OrientationType {
  LEFT = 'left',
  RIGHT = 'right',
}

interface RenderInputProps {
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

interface RenderInput {
  (props: RenderInputProps): React.ReactElement;
}

export interface SelectInputGroupProps {
  children: (props: BaseSelectProps) => React.ReactNode;
  multiline?: boolean;
  renderInput: RenderInput;
  orientation?: OrientationType;
  overflowHidden?: boolean;
}

const SelectInputGroup: React.FC<SelectInputGroupProps> = ({
  children,
  overflowHidden = true,
  multiline,
  renderInput,
  orientation = OrientationType.RIGHT,
}) => {
  const isLeft = orientation === OrientationType.LEFT;

  const child = (
    <S.SelectContainer isLeft={isLeft} onClick={stopPropagation()}>
      {children({
        inline: true,
        minWidth: false,
        autoWidth: false,
        borderLess: true,
        isSecondaryInput: true,
        showDropdownColorOnActive: true,
      })}
    </S.SelectContainer>
  );

  return (
    <S.InputContainer overflowHidden={overflowHidden} isLeft={isLeft} multiline={multiline}>
      {renderInput({
        leftAction: isLeft ? child : undefined,
        rightAction: isLeft ? undefined : child,
      })}
    </S.InputContainer>
  );
};

export default Object.assign(SelectInputGroup, { OrientationType });
