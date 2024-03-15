import { Box } from '@ui/components/Box';
import { FlexCenter } from '@ui/components/Flex';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';
import { fontResetStyle } from '@ui/styles/bootstrap';
import { Nullable } from '@voiceflow/common';

import { RemoveButton } from '../styles';

export const IconUploadInput = styled.input`
  ${fontResetStyle};
  display: none;
`;

export interface ImageContainerProps {
  size: number;
  image?: Nullable<string>;
  error: Nullable<string>;
  isLoading: boolean;
  notAccepted: boolean;
  isSquare?: boolean;
  disabled?: boolean;
  isProfile?: boolean;
}

export const ImageContainer = styled(FlexCenter)<ImageContainerProps>`
  ${transition('background-color', 'border', 'opacity')}
  border-radius: ${({ isSquare }) => (isSquare ? '20%' : '50%')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-position: center center;
  background-size: contain;
  background-image: ${({ image }) => image && `url(${image})`};
  background-repeat: no-repeat;

  border: 1px solid rgb(225, 228, 231);
  background-color: #ffffff;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }

  ${({ image }) =>
    image &&
    css`
      opacity: 1;
      ${SvgIcon.Container} {
        opacity: 0;
      }

      &:hover {
        background: linear-gradient(rgba(19, 33, 68, 0.6) 100%, rgba(19, 33, 68, 0.6) 100%), url(${image});
        background-position: center center;
        background-size: cover;
        ${SvgIcon.Container} {
          opacity: 1;
        }
      }
    `};

  ${({ isProfile }) =>
    isProfile &&
    css`
      opacity: 1;
      border: none;

      ${SvgIcon.Container} {
        opacity: 0;
      }

      &:hover {
        ${SvgIcon.Container} {
          opacity: 1;
        }
      }
    `};

  &:before {
    background: none;
    border: none;
    border-radius: ${({ isSquare }) => (isSquare ? '20%' : '50%')};
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      background-color: #fff;
      :hover {
        background-color: #fff;
      }
    `}

  ${({ error, notAccepted }) =>
    (error || notAccepted) &&
    css`
      background-color: rgba(233, 30, 99, 0.1);
      border: 1px solid red;
    `}

    ${({ disabled }) =>
    disabled &&
    css`
      &:hover {
        opacity: 0.85;
      }
    `};
`;

export const IconUploadContainer = styled.div<{ isActive?: boolean }>`
  :not(:hover) {
    ${RemoveButton} {
      display: none;
    }
  }
  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}

  &:focus {
    outline: none;
  }
`;

export const OverlayContainer = styled(Box)<{ isSquare?: boolean }>`
  ${transition('background-color')}
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${({ isSquare }) => (isSquare ? '20%' : '50%')};
  background-color: none;
  &:hover {
    background-color: rgba(19, 33, 68, 0.6);
  }
`;
