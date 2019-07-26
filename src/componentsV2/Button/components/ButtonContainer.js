import styled from 'styled-components';

import { BUTTON_HEIGHT } from '../styles';
import BaseButton from './BaseButton';

const ButtonContainer = styled(BaseButton)`
  height: ${BUTTON_HEIGHT}px;
  border-radius: 90px;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.2px;
`;

export default ButtonContainer;
