import { css, styled } from '../../../styles';
import { importantStyles } from '../styles';
import IconButtonContainer from './IconButtonContainer';

const ActionContainer = styled(IconButtonContainer)`
  ${importantStyles}
  color: #5d9df5;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);

  &:hover {
    color: #5d9df5;
    box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: 0 1px 2px rgba(17, 49, 96, 0.16);
    `};
`;

export default ActionContainer;
