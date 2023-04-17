import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';

import { Label } from './components';

const connectorReversedStyles = css`
  flex-direction: row-reverse;

  &:after {
    margin-left: -3px;
    border-radius: 50%;
  }
`;

export const Connector = styled.div<{ small?: boolean; reversed?: boolean }>`
  ${transition('width', 'color')}
  width: ${({ small }) => (small ? 9 : 12)}px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 6px;
  position: relative;
  overflow: hidden;
  color: #a1adba;

  &:before {
    height: 2px;
    position: absolute;
    top: 50%;
    right: 0px;
    left: 0px;
    background: currentColor;
    transform: translateY(-50%);
    content: '';
  }

  &:after {
    width: 6px;
    height: 6px;
    margin-right: -3px;
    border-radius: 50%;
    background: currentColor;
    content: '';
  }

  ${({ reversed }) => reversed && connectorReversedStyles}
`;

export const Separator = styled.hr`
  margin: 0;
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.colors.separator};
`;

export const Icon = styled(SvgIcon).attrs(({ size = 16, color = '#6e849a' }) => ({ size, color }))``;

const activeContentStyles = css`
  background-color: #e7f2fd;

  ${Label.Container} {
    color: ${({ theme }) => theme.colors.darkerBlue};
  }

  ${SvgIcon.Container} {
    color: ${({ theme }) => theme.colors.darkerBlue};
  }
`;

export const Content = styled.div<{ active?: boolean }>`
  ${transition('background-color')}

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  gap: 8px;

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        ${activeContentStyles}
      }
    `}

  ${({ active }) => active && activeContentStyles}
`;

const activePortStyles = css`
  background-color: #eef4f6;
`;

export const Port = styled.div<{ active?: boolean }>`
  ${transition('background-color')}
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f1f6f7;

  &:hover {
    ${activePortStyles}
  }

  ${({ active }) => active && activePortStyles}
`;

const containerReversedStyles = css`
  flex-direction: row-reverse;

  ${Content} {
    flex-direction: row-reverse;
  }
`;

export const Container = styled.div<{ borders?: boolean; reversed?: boolean }>`
  display: flex;
  height: 26px;
  box-shadow: 0 1px 0 0 ${({ theme }) => theme.colors.borders}, 0 0 1px 0 rgba(19, 33, 68, 0.16);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &:before {
    ${transition('opacity')}
    position: absolute;
    content: '';
    inset: 0;
    border: 1px solid #fff;
    opacity: ${({ borders }) => (borders ? 1 : 0)};
    pointer-events: none;
    z-index: 1;
    border-radius: 6px;
  }

  ${({ reversed }) => reversed && containerReversedStyles}
`;
