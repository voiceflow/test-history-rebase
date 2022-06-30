import { css, styled, transition } from '@/hocs';

export const MIN_HEIGHT = 36;

export const Container = styled.div<{ isSticky?: boolean; collapsed?: boolean }>`
  ${transition('border-color')}

  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  padding: 10px 0;

  border-bottom: solid 1px transparent;
  z-index: 1;

  ${({ isSticky }) =>
    isSticky &&
    css`
      border-color: #dfe3ed;
    `}

  ${({ collapsed }) =>
    collapsed &&
    css`
      padding-bottom: 10px;
    `}
`;

export const LabelContainer = styled.header`
  color: #132144;
  font-size: 13px;
  line-height: normal;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
`;
