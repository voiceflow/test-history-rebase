import { css } from 'styled-components';

import { FlexCenter } from '@/componentsV2/Flex';
import { styled, transition } from '@/hocs';

import { UploadMode } from '../constants';

const Container = styled(FlexCenter)`
  height: ${({ theme }) => theme.components.audioPlayer.height}px;
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
export default Container;
