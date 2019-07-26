import styled, { css } from 'styled-components';

const UploadButtonWrapper = styled.div`
  ${({ multiVendor }) =>
    multiVendor
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
    padding: 0 20px;

    color: #fff !important;
    font-weight: 500;
    font-size: 15px;
    text-transform: none;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    border: none;
    border-radius: 50px;

    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(0deg, #2c85ff, #2c85ff);
      border: none !important;
      box-shadow: 0px 4px 8px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
    }

    &:active {
      background: linear-gradient(0deg, #2c85ff, #2c85ff);
      border: none !important;
      box-shadow: 0px 7px 12px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
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
    background-image: url('/caret-down.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    background-repeat: no-repeat;
    background-position: center;
    background-position-x: 45%;
    background-size: 10px, auto;
    border-radius: 8px 50px 50px 8px;
    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;

    &:hover {
      background-image: url('/caret-down.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    }
  }

  .vendor-dropdown.active {
    background-image: url('/caret-down.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
  }

  .spinning-publish {
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.35) 0%, #2c85ff80 100%);
    box-shadow: none;

    .publish-spinner {
      background: linear-gradient(180deg, #5d9df5 0%, #2779eb 100%);
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
    right: 8px;
    display: flex;
    width: 30px;
    height: 30px;
    color: #fff;
    text-align: center;

    background-color: #00000030;
    border-radius: 100%;
    transition: all 0.2s;

    justify-content: center;
    align-items: center;
  }
`;

export default UploadButtonWrapper;
