import { css, styled, transition } from '@ui/styles';
import type { HSLShades } from '@ui/utils/colors/hsl';

export interface Props {
  palette: HSLShades;
  noColor?: boolean;
}

export const Container = styled.span<Props>`
  ${transition('background-color')}

  padding: 2px 4px 4px 4px;
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
    css`
      box-shadow: rgba(19, 33, 68, 0.16) 0px -1px 0px 0px inset;
      background-color: #e7f0f2;
    `}

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}
`;

export const Label = styled.span<Props>`
  ${transition('color')}
  margin-bottom: -1px;

  color: ${({ noColor, palette }) => (noColor ? '#62778c' : palette[50])};
`;
