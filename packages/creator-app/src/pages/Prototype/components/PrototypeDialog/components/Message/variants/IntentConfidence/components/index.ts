import { colors, FlexEnd, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Container = styled(FlexEnd)<{ focused?: boolean; utteranceAdded?: boolean }>`
  color: ${colors('secondary')};
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
      color: ${colors('tertiary')};

      & > span {
        text-align: none;
        align-items: none;

        color: ${colors('secondary')};
      }
    `}
`;

export const IntentText = styled.div`
  ::first-letter {
    text-transform: capitalize;
  }

  font-weight: bold;
  font-style: normal;
  display: inline-block;
`;

export const ConfidenceScore = styled.div`
  color: ${colors('secondary')};
  display: inline-block;
`;

export const StatusIcon = styled(SvgIcon)`
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: 2px;
`;

export const TextContainer = styled.div`
  color: ${colors('secondary')};
`;
