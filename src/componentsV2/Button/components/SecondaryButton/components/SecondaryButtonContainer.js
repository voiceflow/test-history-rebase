import styled, { css } from 'styled-components';

import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';

import { hoverStyles } from '../styles';
import Icon from './SecondaryButtonIcon';

const SecondaryButtonContainer = styled(ButtonContainer)`
  border: 1px solid #dfe3ed;
  font-weight: 600;
  padding: 9px 22px 10px;
  color: #132144;
  line-height: 22px;
  background-color: #eef4f6d9;
  transition: all 0.15s ease-out;
  background-size: 1px 42px;

  /* background: linear-gradient(-180deg, rgba(238, 244, 246, 0.85), #eef4f6); */
  box-sizing: border-box;
  transition: all ease 0.15s;

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(19, 33, 68, 0.5);
          background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, #eef4f6 100%);

          & ${Icon} {
            opacity: 0.5;
          }
        `
      : css`
          &:hover,
          &:active {
            ${hoverStyles}
          }
        `}
`;

export default SecondaryButtonContainer;
