import { PrimaryButton } from '@ui/components/Button';
import { FlexCenter } from '@ui/components/Flex';
import { LoadCircle, LoaderProps } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';

interface ContainerProps {
  active?: boolean;
}

export const Container = styled(FlexCenter)<ContainerProps>`
  height: 100%;
  min-height: 115px;
  border: 1px dashed #d4d9e6;
  border-radius: 5px;
  padding: 16px;
  color: #62778c;
  cursor: auto;
  width: 100%;
  position: relative;
  background: white;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  ${transition('background', 'color', 'border-color', 'background-color')}

  &:active, &:focus {
    outline: none;
  }

  &:hover {
    background: rgba(238, 244, 246, 0.5);
  }

  ${({ active }) =>
    active &&
    css`
      background: rgba(238, 244, 246, 0.5);
    `}
`;

export const ReturnButton = styled.div`
  color: #8da2b5;
  display: inline-block;
  cursor: pointer;
`;

export const UploadingSpinner = styled(LoadCircle)<LoaderProps>``;

export const StatusIcon = styled(SvgIcon)`
  position: absolute;
  left: 32px;
`;

export const Message = styled.div`
  cursor: default;
  display: inline-block;
`;

export const BrowseButton = styled(PrimaryButton).attrs({ squareRadius: true })`
  display: inline-block;
  margin-top: 16px;
`;

export const ErrorMessage = styled.div`
  color: #ec417b;
`;
