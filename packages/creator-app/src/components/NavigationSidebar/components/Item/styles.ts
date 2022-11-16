import { FlexApart, Link, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const SidebarItemNumber = styled.div`
  font-size: 13px;
  color: #8da2b5;
`;

export const Container = styled(FlexApart)<{ active?: boolean }>`
  ${transition('background', 'border')}
  padding: 7px 12px 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  display: flex;
  margin-bottom: 4px;
  background: transparent;
  border: solid 1px transparent;

  ${Link} {
    opacity: 0;
  }

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
      border: solid 1px #dfe3ed;
    `}

  ${SvgIcon.Container} {
    opacity: 0.85;
    align-self: center;
  }

  &:hover {
    background: #eef4f6;

    ${SvgIcon.Container} {
      opacity: 1;
    }

    ${Link} {
      opacity: 0.85;
    }
  }

  &:active {
    border: solid 1px #dfe3ed;

    ${SvgIcon.Container} {
      opacity: 1;
    }
  }
`;
