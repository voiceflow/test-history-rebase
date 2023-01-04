import { Flex, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Flex)<{ isActive?: boolean }>`
  cursor: pointer;

  ${SvgIcon.Container} {
    color: #6e849a;
    opacity: 0.65;
  }

  &:hover ${SvgIcon.Container} {
    opacity: 1;
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
