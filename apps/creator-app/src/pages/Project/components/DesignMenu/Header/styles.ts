import { SvgIcon } from '@voiceflow/ui';
import { space, SpaceProps } from 'styled-system';

import { css, styled, transition } from '@/hocs/styled';

import { HEADER_MIN_HEIGHT } from '../Layers/constants';

export interface ContainerProps extends SpaceProps {
  isSticky?: boolean;
  collapsed?: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${transition('border-color')}
  background-color: #fdfdfd;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${HEADER_MIN_HEIGHT}px;
  padding: 12px 12px 0 24px;
  ${space}

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
      cursor: pointer;
      padding-bottom: 10px;

      &:hover ${SvgIcon.Container} {
        opacity: 1 !important;
      }
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
  height: 34px;
`;

export const SearchContainer = styled.div`
  height: 34px;
  display: flex;
  align-items: center;
`;
