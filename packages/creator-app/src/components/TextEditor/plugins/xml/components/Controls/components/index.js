import { Flex } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export { default as FullWidthWrapper } from './FullWidthWrapper';
export { default as SelectInputOption } from './SelectInputOption';
export { default as SelectInputOptionWrapper } from './SelectInputOptionWrapper';
export { default as SelectInputOptionWrapperAbsolute } from './SelectInputOptionWrapperAbsolute';
export { default as SelectOption } from './SelectOption';
export { default as TagsSelect } from './TagsSelect';

export const Wrapper = styled.div`
  height: ${({ theme }) => theme.components.input.height}px;
`;

export const ControlsWrapper = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  margin-right: -6px;
`;

export const HistoryWrapper = styled.div`
  padding: 4px 0 4px 4px;
  cursor: pointer;
  color: #6e849a;
  opacity: 0.8;
  ${transition('opacity', 'color')}

  &:hover {
    opacity: 1;
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5;
      opacity: 1;
    `}
`;
