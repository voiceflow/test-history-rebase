import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { css, styled, transition } from '@/hocs';

import Icon from './PrimaryButtonIcon';

const PrimaryButtonContainer = styled(ButtonContainer)`
  color: #fff;
  box-shadow: 0 0 1px 0 rgba(17, 49, 96, 0.10), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
  font-weight: 600;
  background: linear-gradient(-180deg, #5d9df5 0%, #176ce0 68%);
  transition: all 0.15s ease-out;
  background-size: 1px 52px;
  /* ${transition()} */

  ${({ disabled, canHover }) =>
    disabled
      ? css`
          background: linear-gradient(180deg, #5d9df56b 0%, #176ce075 68%);
          box-shadow: none;

          & ${Icon} {
            opacity: 0.46;
          }
        `
      : canHover &&
        css`
          &:hover {
            background-position: 0px;
            /* background-image: linear-gradient(-180deg, #5d9df5 0%, #1f79f3 78%);
            box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.18), 0 4px 8px 0 rgba(17, 49, 96, 0.16); */
          }
        `}

  &:active {
    box-shadow: 0 0 6px 0 rgba(17, 49, 96, 0.1), 0 6px 12px 0 rgba(17, 49, 96, 0.2);
  }
`;

PrimaryButtonContainer.defaultProps = {
  canHover: true,
};

export default PrimaryButtonContainer;
