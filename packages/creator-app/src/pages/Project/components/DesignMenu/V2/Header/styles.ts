import { css, styled, transition } from '@/hocs';

import { HEADER_MIN_HEIGHT } from '../Layers/constants';

export const Container = styled.div<{ isSticky?: boolean; collapsed?: boolean }>`
  ${transition('border-color')}
  background-color: #fdfdfd;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${HEADER_MIN_HEIGHT}px;
  padding: 10px 2px 10px 12px;

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

export const Content = styled.div`
  padding-right: 16px;
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
