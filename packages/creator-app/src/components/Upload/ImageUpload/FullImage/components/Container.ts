import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const Container = styled(Flex)<{ isActive?: boolean; autoHeight?: boolean; height?: number }>`
  border-radius: 5px;
  height: ${({ autoHeight, height, theme }) => (autoHeight ? 'auto' : `${height || theme.components.imageUpload.height}px`)};

  position: relative;
  color: #62778c;

  &:focus {
    outline: none;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}
`;

export default Container;
