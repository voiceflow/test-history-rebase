import { css, styled } from '@/hocs/styled';

import { dividerStyles } from '../styles';

export interface EditorContentContainerProps {
  fillHeight?: boolean;
}

const EditorContentContainer = styled.div<EditorContentContainerProps>`
  ${dividerStyles}
  ${({ fillHeight }) =>
    fillHeight &&
    css`
      flex: 1;
    `}
  overflow-x: hidden;
  overflow-y: auto;
  border-top: none !important;

  /* Firefox scrollbar fix */
  scrollbar-width: none;

  /* chrome scrollbar fix */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default EditorContentContainer;
