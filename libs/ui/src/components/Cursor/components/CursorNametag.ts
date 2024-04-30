import { styled } from '@/styles';

export interface CursorNametagProps {
  color: string;
}

export const CursorNametag = styled.div<CursorNametagProps>`
  position: absolute;
  left: 50%;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 3px 6px;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  line-height: 15px;
  color: #ffffffe6;
  box-shadow: 0px 1px 3px rgba(19, 33, 68, 0.0810122);
  background: ${({ color }) => color};
`;
