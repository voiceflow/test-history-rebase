import { inputStyle } from '@/components/Input';
import { css, styled } from '@/styles';

import PrefixContainer from './PrefixContainer';

const InlineInputValue = styled.div<{ isSecondary?: boolean; withoutIcon?: boolean }>`
  ${inputStyle}
  position: absolute;
  bottom: 0;
  left: -100%;
  display: inline-block;
  width: auto;
  padding-right: ${({ withoutIcon }) => (withoutIcon ? 16 : 36)}px;
  padding-left: 16px;
  visibility: hidden;

  ${PrefixContainer} {
    margin-right: 12px;
  }

  ${({ isSecondary }) =>
    isSecondary &&
    css`
      color: #62778c;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    `}
`;

export default InlineInputValue;
