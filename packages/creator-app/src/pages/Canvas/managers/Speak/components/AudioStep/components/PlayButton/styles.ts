import { SvgIcon, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled.div<{ $playing: boolean; $hasContent: boolean }>`
  ${transition('background', 'background-color')};
  height: 40px;
  margin-right: 16px;
  width: 40px;
  border: 1px solid #dfe3ed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $playing, $hasContent }) =>
    $playing &&
    $hasContent &&
    css`
      background: #f2f7f8;
      color: #132144;
    `};

  ${({ $hasContent }) =>
    $hasContent &&
    css`
      &:hover {
        background: #f2f7f8;
      }
    `};

  &:active {
    color: #132144;
  }
`;

export const Icon = styled(SvgIcon)`
  ${transition('opacity', 'color')};

  svg {
    opacity: 0.85;

    &:hover {
      opacity: 1;
    }
  }

  &:active {
    color: #132144;
  }
`;
