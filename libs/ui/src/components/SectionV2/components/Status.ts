import { styled, units } from '@/styles';

export enum StatusColor {
  PRIMARY = '#8da2b5',
  TERTIARY = '#787878',
  SECONDARY = 'rgba(110, 132, 154, 0.65)',
}

export interface StatusProps {
  color?: StatusColor;
  hidden?: boolean;
}

const Status = styled.div<StatusProps>`
  font-size: 13px;
  line-height: 1;
  color: ${({ color = StatusColor.PRIMARY }) => color};
  overflow-x: ${({ hidden = true }) => (hidden ? 'hidden' : 'initial')};

  &:not(:last-child) {
    margin-right: ${units(1.5)}px;
  }
`;

export default Object.assign(Status, { Color: StatusColor });
