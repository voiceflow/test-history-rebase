import React from 'react';

import { css, styled } from '@/hocs/styled';

export enum AddonType {
  PREPEND = 'prepend',
  APPEND = 'append',
}

interface WrapperProps {
  addonType: AddonType;
}

const Wrapper = styled.div<WrapperProps>`
  ${({ addonType }) =>
    addonType === AddonType.PREPEND &&
    css`
      margin-right: -4px;
      & > * {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    `}
  ${({ addonType }) =>
    addonType === AddonType.APPEND &&
    css`
      margin-left: -4px;
      & > * {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    `}
`;

interface InputGroupAddonProps extends React.PropsWithChildren {
  addonType: AddonType;
  className?: string;
}

const InputGroupAddon: React.FC<InputGroupAddonProps> = ({ addonType, className, children }): React.ReactElement => {
  return (
    <Wrapper className={`${className || ''} ${addonType}`} addonType={addonType}>
      {children}
    </Wrapper>
  );
};

export default InputGroupAddon;
