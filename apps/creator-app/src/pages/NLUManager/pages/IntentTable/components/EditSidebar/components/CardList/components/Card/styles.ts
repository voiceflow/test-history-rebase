import { transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
  background: rgb(238 244 246);
`;

export const TitleContainer = styled.div<{ color: string; isLoading?: boolean }>`
  ${transition('background', 'background-color', 'opacity')};

  padding: 11px 24px;
  background: #bd425f;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ color }) => css`
    background-color: ${color};
  `}

  ${({ isLoading }) =>
    isLoading &&
    css`
      opacity: 0.65;
    `}
`;

export const BodyContainer = styled.div`
  padding: 16px 24px;
  background: rgb(238 244 246);
  color: #132144;
`;
