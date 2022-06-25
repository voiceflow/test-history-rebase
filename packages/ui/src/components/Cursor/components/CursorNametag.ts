import { styled } from '@ui/styles';

export interface CursorNametagProps {
  color: string;
  backgroundColor: string;
}

export const CursorNametag = styled.div<CursorNametagProps>`
  position: absolute;
  left: 50%;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid #ffffff;
  padding: 3px 6px;
  white-space: nowrap;
  font-size: 13px;
  line-height: 15px;
  color: ${({ color }) => color};
  box-shadow: 0px 1px 3px rgba(19, 33, 68, 0.0810122);
  background: ${({ backgroundColor }) => backgroundColor};
`;
