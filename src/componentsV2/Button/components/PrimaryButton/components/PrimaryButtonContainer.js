import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { css, styled, transition } from '@/hocs';

import Icon from './PrimaryButtonIcon';

const PrimaryButtonContainer = styled(ButtonContainer)`
  color: #fff;
  background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
  box-shadow: 0px 4px 8px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
  font-weight: 600;
  ${transition()}

  ${({ disabled, canHover }) =>
    disabled
      ? css`
          background: linear-gradient(180deg, rgba(93, 157, 245, 0.351647) 0%, rgba(44, 133, 255, 0.390597) 100%);
          box-shadow: none;

          & ${Icon} {
            opacity: 0.46;
          }
        `
      : canHover &&
        css`
          &:hover {
            background: linear-gradient(180deg, rgba(93, 157, 245, 0.99) 0%, #2c85ff 100%);
            box-shadow: 0px 4px 8px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
          }
        `}

  &:active {
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.99) 0%, #2c85ff 100%);
    box-shadow: 0px 7px 12px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
  }
`;

PrimaryButtonContainer.defaultProps = {
  canHover: true,
};

export default PrimaryButtonContainer;
