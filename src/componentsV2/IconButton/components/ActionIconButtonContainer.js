import styled, { css } from 'styled-components';

import { importantStyles } from '../styles';
import IconButtonContainer from './IconButtonContainer';

const ActionIconButtonContainer = styled(IconButtonContainer)`
  ${importantStyles}

  border: 1px solid #fff;
  color: rgba(93, 157, 245, 0.85);
  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: 0px 1px 2px rgba(17, 49, 96, 0.16);
    `};
`;

export default ActionIconButtonContainer;
