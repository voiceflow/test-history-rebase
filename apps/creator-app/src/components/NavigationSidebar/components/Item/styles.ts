import { FlexApart, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Icon = styled(SvgIcon).attrs({ inline: true })<{ isActive?: boolean }>`
  color: ${({ isActive }) => (isActive ? '#132144' : '#6e849a')};
`;

export const LinkIcon = styled(SvgIcon).attrs({ icon: 'editorURL' })`
  color: #6e849a;
`;

export const SubText = styled.span`
  color: #8da2b5;
  font-size: 13px;
`;

const activeStyle = css`
  background: #eef4f6;
  border: solid 1px #dfe3ed;

  ${Icon} {
    opacity: 1;
  }

  ${SubText} {
    color: #62778c;
  }
`;

export const Container = styled(FlexApart)<{ active?: boolean; isDisabled?: boolean }>`
  ${transition('background', 'border')}
  padding: 7px 12px 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  display: flex;
  margin-bottom: 2px;
  background: transparent;
  border: solid 1px transparent;
  user-select: none;

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      pointer-events: none;
    `}

  ${Icon} {
    opacity: 0.85;
    align-self: center;
  }

  ${LinkIcon} {
    opacity: 0;
  }

  &:hover {
    background: #eef4f6;

    ${Icon} {
      opacity: 1;
    }

    ${LinkIcon} {
      opacity: 0.85;
    }
  }

  &:active {
    ${activeStyle}
  }

  ${({ active }) => active && activeStyle}
`;
