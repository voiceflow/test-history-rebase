import SvgIcon from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';

export const CornerActionButton = styled(SvgIcon)`
  ${transition('opacity')};
  position: absolute;
  padding: 3px;
  top: 14px;
  right: 14px;
  cursor: pointer;
  color: #6e849a;
`;

export const StatusButton = styled(SvgIcon)`
  display: inline-block;
  color: #449127;
  position: relative;
  top: 3px;
  margin-right: 15px;
`;

export const Container = styled.section`
  border-radius: 6px;
  border: 1px #dfe3ed solid;
  background-color: #fff;
  padding: 30px 32px;
  width: 100%;
  position: relative;
  cursor: default;

  & ${CornerActionButton} {
    opacity: 0;
  }

  &:hover ${CornerActionButton} {
    opacity: 0.65;
  }

  & ${CornerActionButton}:hover {
    opacity: 0.85;
  }
`;
