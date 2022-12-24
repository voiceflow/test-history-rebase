import { colors, FlexEnd, SvgIcon, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(FlexEnd)<{ focused?: boolean; utteranceAdded?: boolean }>`
  color: ${colors(ThemeColor.SECONDARY)};
  margin-top: -16px;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: right;
  align-items: flex-start;

  ${({ focused }) =>
    focused &&
    css`
      opacity: 100% !important;
    `}

  ${({ utteranceAdded = false }) =>
    utteranceAdded &&
    css`
      color: ${colors(ThemeColor.TERTIARY)};

      & > span {
        text-align: none;
        align-items: none;

        color: ${colors(ThemeColor.SECONDARY)};
      }
    `}
`;

export const IntentText = styled.div`
  ::first-letter {
    text-transform: capitalize;
  }

  color: #62778c;
  font-style: normal;
  display: inline-block;
`;

export const ConfidenceScore = styled.div`
  color: #8da2b5;
  display: inline-block;
  padding-left: 2px;
`;

export const StatusIcon = styled(SvgIcon)`
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: 2px;
`;

export const TextContainer = styled.div`
  color: ${colors(ThemeColor.SECONDARY)};
`;
