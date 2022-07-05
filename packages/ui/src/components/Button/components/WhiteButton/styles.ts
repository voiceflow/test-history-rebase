import ButtonContainer, { ButtonContainerProps } from '@ui/components/Button/components/ButtonContainer';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';

export interface ContainerProps extends ButtonContainerProps {
  rounded?: boolean;
}

export const Icon = styled(SvgIcon)`
  ${transition('opacity')}
  color: #6e849a;
  opacity: 0.85;
`;

export const Container = styled(ButtonContainer)<ContainerProps>`
  ${transition('all')}
  border-radius: ${({ rounded }) => (rounded ? '50%' : '10px')};
  color: #132144;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  gap: 20px;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgb(19 33 68 / 6%), 0 1px 0 0 rgb(19 33 68 / 3%), 0 1px 1px 0 rgb(19 33 68 / 1%), 0 2px 2px 0 rgb(19 33 68 / 1%),
    0 4px 4px 0 rgb(19 33 68 / 2%), 0 8px 12px 0 rgb(19 33 68 / 4%);

  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    box-shadow: 0 0 0 1px rgb(19 33 68 / 6%), 0 1px 0 0 rgb(19 33 68 / 3%), 0 1px 1px 0 rgb(19 33 68 / 1%), 0 2px 2px 0 rgb(19 33 68 / 1%),
      0 4px 4px 0 rgb(19 33 68 / 2%), 0 8px 12px 0 rgb(19 33 68 / 4%), 0 8px 24px 0 rgb(19 33 68 / 4%);

    & ${Icon} {
      opacity: 1;
    }
  }

  &:active {
    background-color: #f7f7f7;
    box-shadow: 0 0 0 1px rgb(19 33 68 / 8%), 0 2px 2px 0 rgb(19 33 68 / 2%), 0 2px 4px 0 rgb(19 33 68 / 2%), 0 2px 8px 0 rgb(19 33 68 / 4%);

    & ${Icon} {
      opacity: 1;
      color: rgba(19, 33, 68, 0.85);
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      box-shadow: none;
      opacity: 0.4;

      & ${Icon} {
        opacity: 0.46;
      }
    `}
`;

export const Label = styled.span`
  font-weight: 600;
  letter-spacing: 0.2px;
`;
