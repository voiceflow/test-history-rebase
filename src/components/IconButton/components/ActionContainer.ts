import styled, { css } from 'styled-components';

import { importantStyles } from '../styles';
import Container from './Container';

const ActionContainer = styled(Container)`
  ${importantStyles}

  border: 1px solid #fff;
  color: #5d9df5;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);

  &:hover {
    box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: 0px 1px 2px rgba(17, 49, 96, 0.16);
    `};
`;

export default ActionContainer;
