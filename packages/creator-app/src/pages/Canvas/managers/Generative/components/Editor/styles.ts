import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const ResponsePreviewContainer = styled.div`
  border: 1px solid #e1e4e7;
  padding: 11px 44px 11px 16px;
  border-radius: 6px;
  color: RGBA(19, 33, 68, 0.65);
  position: relative;
  white-space: pre-wrap;

  & ${SvgIcon.Container} {
    position: absolute;
    top: 13px;
    right: 16px;
  }
`;
