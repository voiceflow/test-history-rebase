import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export { default as SelectOption } from './SelectOption';
export { default as FullWidthWrapper } from './FullWidthWrapper';
export { default as TagsSelect } from './TagsSelect';
export { default as SelectInputOption } from './SelectInputOption';
export { default as SelectInputOptionWrapper } from './SelectInputOptionWrapper';
export { default as SelectInputOptionWrapperAbsolute } from './SelectInputOptionWrapperAbsolute';

export const Wrapper = styled.div`
  height: ${({ theme }) => theme.components.input.height}px;
`;

export const ControlsWrapper = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
`;

export const HistoryWrapper = styled.div`
  padding: 4px;
  cursor: pointer;
  color: #6e849a;
  opacity: 0.8;
`;
