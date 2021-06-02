import styled from 'styled-components';

import { FlexCenter } from '@/components/Flex';
import { css } from '@/hocs';

const activeStyles = css`
  box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.06);
  border: 1px solid ${({ color = '#5D9DF5' }) => color};
`;

const InnerContainer = styled(FlexCenter)`
  box-sizing: border-box;
  border: 1px solid #d4d9e6;
  box-shadow: 0px 0px 3px rgba(17, 49, 96, 0.06);
  border-radius: 5px;
  transition: box-shadow 0.15s ease, border 0.15s ease;
  cursor: pointer;
  height: ${({ theme }) => theme.components.input.height}px;
  padding: 0 16px;
  ${({ active }) => active && activeStyles}
`;

export default InnerContainer;
