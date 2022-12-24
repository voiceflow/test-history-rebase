import { FlexApart, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface UserNameContainerProps {
  isOpen: boolean;
}

export const UserNameContainer = styled(FlexApart)<UserNameContainerProps>`
  font-size: 16px;
  color: #132144;
  cursor: pointer;
  padding: 15px 0;
  margin-left: 24px;

  div {
    flex: 1;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5;
    `}

  ${SvgIcon.Container} {
    display: inline-block;
    margin-left: 12px;
  }
`;
