import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Flex)`
  flex: 1;
  flex-direction: row-reverse;
`;

export const IconContainer = styled.div<{ isEmotion?: boolean }>`
  margin-left: -4px;

  ${({ isEmotion }) =>
    isEmotion &&
    css`
      margin-bottom: 1px;
    `}
`;

export const EmotionContainer = styled.img`
  width: 16px;
  height: 16px;
  margin-bottom: 1px;
`;
