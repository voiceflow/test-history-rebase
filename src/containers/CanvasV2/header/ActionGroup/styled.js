import { withProps } from 'recompose';
import styled, { css, keyframes } from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import { ANIMATION_SPEED } from '@/styles/theme';

export const SubTitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
  border-left: 1px solid #e2e9ec;
`;

export const UploadButtonWrapper = styled.div`
  ${({ options }) =>
    options
      ? css`
          position: relative;
          padding-right: 42px;
        `
      : ''}

  .publish-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    ${({ isGoogle }) =>
      isGoogle
        ? css`
            width: 203px;
          `
        : css`
            width: 192px;
          `};
    height: 42px;
    padding: 0 22px;

    color: #fff;
    font-weight: 600;
    font-size: 15px;
    text-transform: none;
    background: linear-gradient(-180deg, #5d9df5 0%, #176ce0 68%);
    background-size: 1px 52px;
    border: none;
    border-radius: 90px;
    box-shadow: 0 0 1px 0 rgba(17, 49, 96, 0.1), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-position: 0px;
    }

    &:active {
      box-shadow: 0 0 6px 0 rgba(17, 49, 96, 0.1), 0 6px 12px 0 rgba(17, 49, 96, 0.2);
    }
  }

  .publish-btn.multi-vendor-btn {
    width: 165px;
    padding-right: 15px;
    padding-left: 15px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .vendor-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    color: #fff;
    background-color: red;
    background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    background-repeat: no-repeat;
    background-position: center;
    background-position-x: 45%;
    background-size: 10px, auto;
    border-radius: 8px 50px 50px 8px;
    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
    border: none;

    &:hover {
      background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    }
  }

  .vendor-dropdown.active {
    background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
  }

  .spinning-publish {
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.35) 0%, #2c85ff80 100%);
    box-shadow: none;

    .publish-spinner {
      background: linear-gradient(-180deg, #5d9df5 0%, #176ce0 68%);
      box-shadow: 0px 4px 8px rgba(19, 33, 68, 0.1);
      opacity: 1;

      .spinner-icon {
        animation-name: spin;
        animation-duration: 1500ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }

    &:hover,
    &:active {
      background: linear-gradient(180deg, rgba(93, 157, 245, 0.35) 0%, #2c85ff80 100%);
    }
  }

  .spinning-publish.publish-btn:hover {
    box-shadow: none;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .publish-btn.btn-opaque {
    opacity: 0.65;
  }

  .publish-spinner {
    position: absolute;
    right: 6px;
    display: flex;
    padding: 7px;
    color: #fff;
    text-align: center;

    background-color: #00000030;
    border-radius: 100%;
    transition: all 0.2s;

    justify-content: center;
    align-items: center;
  }
`;

export const VendorList = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  z-index: 1;
  width: 100%;
  max-height: 165px;
  padding: 10px 0 10px 0;
  overflow-y: scroll;
  background-color: #fff;
  border: 1px solid rgba(141, 162, 181, 0.28);
  border-radius: 5px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);

  .wh_select-list-header {
    height: 32px;
    margin: 0 5px 0 5px;
    padding: 0.5em 0.5em 0.5em 0.9em;
    overflow: hidden;
    color: #8da2b5;
    font-weight: 600;
    font-size: 0.9em;
    text-transform: uppercase;
    word-wrap: break-word;
  }
`;

const slideIn = keyframes`
  from {
    transform: translate3d(0, 10px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PopupTransition = styled.div`
  transform: translate3d(0, 0, 0);
  animation: ${slideIn} 150ms ease-in-out 150ms;
  animation-fill-mode: both;
  width: 100%;
`;

const CloseIcon = styled(SvgIcon)`
  cursor: pointer;
  color: #becedc;
  transition: color ${ANIMATION_SPEED}s ease;

  & :hover {
    color: #6e849a;
  }
`;

export const Close = withProps({ icon: 'close', size: 12 })(CloseIcon);

export const PopupContainer = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: absolute;
  top: 62px;
  right: 15px;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  min-width: 350px;
  max-width: 350px;
  white-space: normal;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  animation: ${fadeIn} 150ms ease-in-out;

  ${CloseIcon} {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 18px;
    z-index: 100;
  }
`;
