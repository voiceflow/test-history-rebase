import { SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const WorkspaceDropdownContainer = styled.div<{ isLoading: boolean }>`
  padding: 20px;
  padding-right: 12px;
  cursor: pointer;
  font-size: 18px;
  color: #132144;
  align-items: center;
  height: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: not-allowed;
    `}

  div {
    overflow: hidden;
    width: 90%;
    display: inline;
  }

  ${SvgIcon.Container} {
    display: inline-block;
    margin-left: 12px;
  }
`;

export default WorkspaceDropdownContainer;
