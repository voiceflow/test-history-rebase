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
    justify-content: center;
    // width: 192px;
    // Google width: 203px;
    ${({ isGoogle }) =>
      isGoogle
        ? css`
            width: 203px;
          `
        : css`
            width: 192px;
          `};
    height: 42px;
    padding: 11px 58px 12px 22px !important;
    color: #fff !important;
    font-weight: normal !important;
    font-weight: 500 !important;
    font-size: 15px !important;
    font-family: 'Open Sans', sans-serif !important;
    text-transform: none !important;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    border: none !important;
    border-radius: 50px !important;
    box-shadow: inset 0 0 0 10px #ddd;

    /*    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08) !important; */
    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
    transition: all 0.2s ease !important;
  }

  .publish-btn:hover {
    color: #fff !important;
    background: linear-gradient(0deg, #2c85ff, #2c85ff);
    border: none !important;
    box-shadow: 0 4px 8px rgba(17, 49, 96, 0.16), 0 0 4px rgba(17, 49, 96, 0.08) !important;
  }

  .publish-btn:active {
    background: linear-gradient(0deg, #2c85ff, #2c85ff);
    border: none !important;
    box-shadow: 0 6px 12px rgba(17, 49, 96, 0.2), 0 0 6px rgba(17, 49, 96, 0.1) !important;
  }

  .publish-btn.multi-vendor-btn {
    width: 165px;
    padding-right: 15px !important;
    padding-left: 15px !important;
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }

  .vendor-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background-color: red;
    background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    background-repeat: no-repeat;
    background-position: center;
    background-position-x: 45%;
    background-size: 10px, auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    border-bottom-left-radius: 8px;
    box-shadow: inset 0 0 0 10px #ddd;
    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
  }

  .vendor-dropdown:hover {
    background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(95, 162, 255, 0.85) 0%, rgb(6, 109, 253) 100%);
  }

  .vendor-dropdown.active {
    background-image: url('/caret-down-white.svg'), linear-gradient(180deg, rgba(61, 142, 255, 0.85) 0%, rgb(20, 96, 202) 100%);
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
    top: 6px;
    right: 7px;
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
