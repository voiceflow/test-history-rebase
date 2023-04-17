import { FlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const activeStyles = css`
  border: 1px solid ${({ color = '#5D9DF5' }) => color};
  box-shadow: 0 1px 3px rgba(17, 49, 96, 0.06);
`;

const InnerContainer = styled(FlexCenter)`
  box-sizing: border-box;
  height: ${({ theme }) => theme.components.input.height}px;
  padding: 0 16px;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  box-shadow: 0 0 3px rgba(17, 49, 96, 0.06);
  cursor: pointer;
  transition: box-shadow 0.15s ease, border 0.15s ease;
  ${({ active }) => active && activeStyles}
`;

export default InnerContainer;
