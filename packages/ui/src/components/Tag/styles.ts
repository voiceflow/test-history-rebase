import { HSLShades } from '@ui/utils/colors/hsl';
import styled from 'styled-components';

export interface BaseTagProps {
  palette: HSLShades;
}

export const TagWrapper = styled.section<BaseTagProps>`
  padding: 1px 0px 3px;
  font-weight: 600;
  font-size: 12px;
  border-radius: 5px;
  cursor: default;
  line-height: 14px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  background-color: ${({ palette }) => palette[700]};
`;

export const Label = styled.section<BaseTagProps>`
  margin-bottom: -1px;

  color: ${({ palette }) => palette[50]};
`;

export const CurlyBraces = styled.span<BaseTagProps>`
  display: inline-block;
  margin: 0px 3px;

  color: ${({ palette }) => palette[400]};
`;
