import SvgIcon from '@ui/components/SvgIcon';
import type { TippyTooltipProps } from '@ui/components/TippyTooltip';
import TippyTooltip from '@ui/components/TippyTooltip';
import { css, styled } from '@ui/styles';
import React from 'react';

const StyledIcon = styled(SvgIcon).attrs({ size: 16, icon: 'info' })<{ opened?: boolean }>`
  color: #becedc;

  &:hover {
    color: #6e849a;
  }

  ${({ opened }) =>
    opened &&
    css`
      opacity: 1 !important;
      color: #6e849a;
    `}
`;

const InfoIconTooltip: React.FC<React.PropsWithChildren<Omit<TippyTooltipProps, 'content'>>> = ({
  children,
  interactive,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TippyTooltip
      {...props}
      onShow={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      content={children}
      interactive={interactive}
    >
      <StyledIcon opened={isOpen} />
    </TippyTooltip>
  );
};

export default Object.assign(InfoIconTooltip, { StyledIcon });
