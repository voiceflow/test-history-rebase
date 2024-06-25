import { css, FlexCenter, PrimaryButton, styled, SvgIcon, transition } from '@voiceflow/ui';
import { space } from 'styled-system';

import { LoadCircle, LoaderProps } from '@/components/legacy/Loader';

import { RootDropAreaProps } from '../../types';

interface ContainerProps {
  active?: boolean;
  hasError?: boolean;
}

export const DropContainer = styled.div`
  height: 170px;
`;

export const RootDropArea = styled.div<RootDropAreaProps>`
  ${space}
`;

export const Container = styled(FlexCenter)<ContainerProps>`
  height: 100%;
  min-height: 115px;
  border: 1px dashed #d4d9e6;
  border-radius: 6px;
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

  ${({ hasError }) =>
    hasError &&
    css`
      color: #bd425f;
      border-color: #bd425f;
      background-color: #bd425f0e;
      &:hover {
        background-color: #bd425f0e;
      }
    `}
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

export const CornerActionButton = styled(SvgIcon)`
  ${transition('color')}
  position: absolute;
  padding: 5px;
  margin: -5px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #8da2b5;
  display: none;

  :hover {
    color: #8da2b5;
  }
`;

export const DropFileContainer = styled(FlexCenter)`
  height: 100%;
  min-height: 115px;
  border: 1px solid #d4d9e6;
  border-radius: 6px;
  padding: 32px;
  color: #62778c;
  cursor: auto;
  width: 100%;
  position: relative;
  background: white;
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: center;
  ${transition('background', 'color', 'border-color', 'background-color')}

  &:active, &:focus {
    outline: none;
  }

  &:hover {
    ${CornerActionButton} {
      display: block;
    }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;

  ${CornerActionButton} {
    display: block;
  }
`;
