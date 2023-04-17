import SvgIcon from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';

export const CornerActionButton = styled(SvgIcon)`
  ${transition('color')}
  position: absolute;
  padding: 5px;
  margin: -5px;
  top: 14px;
  right: 15px;
  cursor: pointer;
  color: #6e849a8f;

  :hover {
    color: #6e849a8f;
  }
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
`;
