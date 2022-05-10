import { transition } from '@ui/styles';
import { HSLShades } from '@ui/utils/colors/hsl';
import React from 'react';
import styled from 'styled-components';

export interface BaseTagProps {
  palette: HSLShades;
  noColor: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export const TagWrapper = styled.span<BaseTagProps>`
  ${transition('background-color')}
  padding: 2px 5px 4px 6px;
  font-weight: 600;
  font-size: 12px;
  border-radius: 5px;
  cursor: default;
  line-height: 14px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  position: relative;
  background-color: ${({ palette }) => palette[700]};
  box-shadow: inset 0 -1px 0 0 #0000001e;

  ${({ noColor }) =>
    noColor &&
    `
    box-shadow: rgb(223 229 234) 0px 0px 0px 1px inset;
    background-color: #f4f8f9;
  `}

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
  `}

  &::before,
  &::after {
    ${transition('color', 'background-color')}
    position: absolute;
    top: 2px;
    font-weight: 900;
    width: 8px;
    height: calc(100% - 4px);
    background-color: ${({ palette }) => palette[700]};
    color: ${({ palette }) => palette[400]};
    opacity: 1;
    line-height: 12px;

    ${({ noColor }) =>
      noColor &&
      `
      color: #8d9eae;
      background-color: #f4f8f9;
    `}
  }

  &::before {
    content: '{';
    left: 3px;
    text-align: left;
  }

  &::after {
    content: '}';
    right: 2px;
    text-align: right;
  }
`;

export const Label = styled.span<BaseTagProps>`
  ${transition('color')}
  margin-bottom: -1px;

  color: ${({ palette }) => palette[50]};

  ${({ noColor }) => noColor && `color: #62778c;`}
`;
