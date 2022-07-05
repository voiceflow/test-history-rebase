import { styled, units } from '@ui/styles';
import { border, BorderProps, space, SpaceProps } from 'styled-system';

export const Button = styled.div<BorderProps>`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 ${units(2)}px;
  border: 1px solid #dfe3ed;
  line-height: 1;
  border-radius: 6px;
  width: 100%;
  color: #132144;
  font-weight: 600;
  cursor: pointer;
  ${border}

  &:not(:first-of-type) {
    margin-top: -1px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-top-color: #eaeff4;
  }

  &:not(:last-of-type) {
    border-bottom-color: #eaeff4;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
`;

export const ButtonGroup = styled.div<SpaceProps>`
  width: 100%;
  ${space}
`;

export default Object.assign(ButtonGroup, { Button });
