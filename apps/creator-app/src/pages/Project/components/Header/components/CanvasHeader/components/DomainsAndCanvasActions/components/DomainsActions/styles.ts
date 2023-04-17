import { Flex, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Flex)<{ isActive?: boolean }>`
  cursor: pointer;

  ${SvgIcon.Container} {
    color: rgba(110, 132, 154, 0.85);
  }

  &:hover ${SvgIcon.Container} {
    color: #6e849a;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      ${SvgIcon.Container} {
        color: #132144;
        opacity: 1;
      }
    `}
`;

export const Name = styled.div`
  max-width: 205px;
  margin-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
