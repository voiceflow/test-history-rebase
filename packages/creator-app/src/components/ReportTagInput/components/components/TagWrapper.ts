import { SvgIconContainer } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

const TagWrapper = styled.span<{ onClick: (e: React.MouseEvent) => void }>`
  margin: 3px 3px 0px 0px;
  height: 26px;
  padding: 4px 0px 4px 12px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.16);
  background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);
  cursor: default;
  max-width: calc(100% - 3px);

  div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  & > ${SvgIconContainer} {
    color: ${({ theme }) => theme.iconColors.disabled};
    padding-right: 12px;
  }
`;

export default TagWrapper;
