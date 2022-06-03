import { css, styled, transition } from '@/hocs';

export const ItemContainer = styled.div<{ hide: boolean; selected: boolean }>`
  ${transition('background')};
  display: flex;
  padding: 16px 32px;
  border-bottom: solid 1px #eaeff4;
  gap: 16px;

  background: white;
  cursor: pointer;

  &:hover {
    background: rgba(238, 244, 246, 0.3);
  }

  &:active {
    background: rgba(238, 244, 246, 0.5);
  }

  ${({ hide }) =>
    hide &&
    css`
      display: none;
    `}

  ${({ selected }) =>
    selected &&
    css`
      background: rgba(238, 244, 246, 0.5) !important;
      border-top: 1px solid #dfe3ed;
      border-bottom: 1px solid #dfe3ed;
      margin-top: -1px;
    `}
`;

export const StrengthContainer = styled.div<{ flex: number }>`
  ${({ flex }) => css`
    flex: ${flex};
  `}
  display: inline-flex;
  align-content: center;
  align-items: center;
  height: 100%;
`;

export const StrengthDescriptorContainer = styled.div`
  text-transform: lowercase;
  margin-left: 12px;
`;
