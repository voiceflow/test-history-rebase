import { FlexApart } from '@/components/Box';
import { css, styled, transition } from '@/hocs';

export const Header = styled(FlexApart)`
  background-color: #002240;
  padding: 12px 24px;
`;

export const Option = styled.div<{ active: boolean }>`
  color: #fff;
  display: inline-block;
  border-radius: 16px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 600;

  :hover {
    opacity: 0.8;
  }

  ${transition('color', 'background-color', 'opacity')};

  ${({ active }) =>
    active &&
    css`
      background-color: #172f4e;
      color: #59a1ce;
      cursor: default;
      opacity: 1 !important;
    `}
`;
