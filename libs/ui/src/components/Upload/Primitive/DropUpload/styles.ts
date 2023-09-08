import { FlexCenter } from '@ui/components/Flex';
import { LoadCircle, LoaderProps } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';
import { fontResetStyle } from '@ui/styles/bootstrap';
import { Nullable } from '@voiceflow/common';

import { UploadMode } from './constants';

export const CornerActionButton = styled(SvgIcon)`
  ${transition('color')}
  position: absolute;
  padding: 5px;
  margin: -5px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #8da2b5;

  :hover {
    color: #8da2b5;
  }
`;

export const DropInput = styled.input`
  ${fontResetStyle};
`;

export const ReturnButton = styled.div`
  color: #8da2b5;
  display: inline-block;
  cursor: pointer;
`;

export const UploadingSpinner = styled(LoadCircle)<LoaderProps>`
  position: absolute;
  left: 24px;
`;

export const StatusIcon = styled(SvgIcon)`
  position: absolute;
  left: 32px;
`;

interface ContainerProps {
  mode: UploadMode;
  height?: number;
  isImage?: boolean;
  active?: boolean;
  error?: Nullable<string>;
  isDragReject?: boolean;
}

export const Container = styled(FlexCenter)<ContainerProps>`
  height: ${({ height, theme, isImage }) => height || (isImage ? theme.components.imageUpload.height : theme.components.audioPlayer.height)}px;
  border: 1px dashed #d4d9e6;
  border-radius: 5px;
  padding: 0 16px;
  color: #62778c;
  cursor: auto;
  width: 100%;
  position: relative;
  background: white;
  flex: 1;
  text-align: center;
  cursor: pointer;
  ${transition('background', 'color', 'border-color', 'background-color')}

  &:active, &:focus {
    outline: none;
  }

  ${({ mode }) =>
    mode === UploadMode.DROP &&
    css`
      &:hover {
        background: rgba(238, 244, 246, 0.5);
      }
    `}

  ${({ active }) =>
    active &&
    css`
      background: rgba(238, 244, 246, 0.5);
    `}

  ${({ error, isDragReject }) =>
    (error || isDragReject) &&
    css`
      color: #ec417b;
      border-color: #ec417b;
      background-color: rgba(233, 30, 99, 0.1);
    `}
`;
