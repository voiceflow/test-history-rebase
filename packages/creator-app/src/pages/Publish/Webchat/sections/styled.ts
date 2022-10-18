import { Box, colors, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const SectionIcon = styled(Box.FlexCenter)`
  height: 42px;
  width: 42px;
  border-radius: 6px;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  color: ${colors(ThemeColor.PRIMARY)};
`;

export const SectionArrow = styled.div`
  ${transition('transform')}
`;

export const SectionBody = styled.div`
  border-top: 1px solid #eaeff4;
  padding: 24px 32px;
`;

export const SectionHeader = styled(Box.Flex)`
  cursor: pointer;
  padding: 24px 32px;
`;

export const SectionContainer = styled.div<{ isOpen: boolean }>`
  background: #fff;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.1), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  width: 100%;
  border-radius: 8px;

  ${({ isOpen }) =>
    isOpen &&
    css`
      & ${SectionArrow} {
        transform: rotate(90deg);
      }
    `}
`;

export const SectionGroup = styled(Box)<{ horizontal?: boolean }>`
  &:not(:first-of-type) {
    margin-top: 24px;
  }

  ${({ horizontal }) =>
    horizontal &&
    css`
      display: flex;
      width: 100%;
      gap: 16px;

      & > div {
        flex-grow: 1;
      }
    `}
`;

export const ToggleGroup = styled(Box.FlexCenter)`
  border-radius: 10px;
  border: 1px solid #dfe3ed;
  padding: 0 16px;
  height: 42px;
`;

export const PreviewCrop = styled.div`
  border-radius: 6px;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  border: 1px solid #eaeff4;
  height: 80px;
  width: 96px;
  overflow: hidden;
`;

export const SelectorLine = styled.div`
  width: 64px;
  border-top: 1px dashed #d4d9e6;
`;
