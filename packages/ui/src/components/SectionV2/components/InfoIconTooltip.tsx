import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip, { TippyTooltipProps } from '@ui/components/TippyTooltip';
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

const InfoIconTooltip: React.FC<Omit<TippyTooltipProps, 'html'>> = ({ children, interactive, bodyOverflow = true, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TippyTooltip
      {...props}
      html={(children as any) ?? undefined}
      onShow={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      interactive={interactive}
      bodyOverflow={bodyOverflow}
    >
      <StyledIcon opened={isOpen} />
    </TippyTooltip>
  );
};

export default Object.assign(InfoIconTooltip, { StyledIcon });
