import { Tag } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const StyledTag = styled(Tag)`
  pointer-events: none;
  display: inline-flex;
  max-width: 100%;
  position: relative;
  top: -1px;

  > span {
    pointer-events: all;

    word-break: normal;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
`;
