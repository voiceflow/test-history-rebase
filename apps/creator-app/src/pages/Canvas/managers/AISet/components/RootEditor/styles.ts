import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const ResponsePreviewContainer = styled.div`
  border: 1px solid #e1e4e7;
  padding: 9px 44px 9px 16px;
  border-radius: 6px;
  color: RGBA(19, 33, 68, 0.65);
  position: relative;
  white-space: pre-wrap;
  word-break: break-word;

  & ${SvgIcon.Container} {
    position: absolute;
    top: 13px;
    right: 16px;
  }
`;
