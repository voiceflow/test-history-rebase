import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const MsgBox = styled.div`
  ${({ error }) => (error ? 'color: #e91e63;' : '')}
  font-size: 12px;
  line-height: 15px;
  padding: 5px 0px 0px 15px;
  background: #ffffff;
  text-align: left;

  animation: ${fadeIn} 1s;
`;

export const AuthBox = styled.div`
  text-align: center;

  #login-container {
    background: linear-gradient(180deg, rgba(19, 33, 68, 0.85) 0%, #132144 100%), #fff;
  }

  .auth-form-wrapper {
    width: 404px;
    max-width: 404px;
    padding: 32px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.08), 0px 0px 1px rgba(17, 49, 96, 0.08);
    .form-group {
      margin-bottom: 23px;
    }
    .row {
      margin-top: 32px;
    }
  }

  .auth-logo {
    width: 140px;
    margin-bottom: 32px;
  }

  .auth__link {
    padding-top: 10px;
    text-align: left;
  }

  .auth__link > a {
    color: #5d9df5;
    font-size: 15px;
    line-height: 18px;
    cursor: pointer;
    &:hover {
      color: #5d9df5;
    }
    &:active {
      color: #326fc3;
    }
  }

  .passwordInput {
    position: relative;

    .forgotLink {
      position: absolute;
      top: 13px;
      right: 15px;
      color: #5d9df5;
      cursor: pointer;
      font-size: 13px;
    }

    .viewPassword {
      position: absolute;
      top: 17px;
      right: 16px;
      cursor: pointer;
    }

    .hiddenEye {
      top: 15px;
    }
  }

  .confirm-helper {
    font-size: 15px;
    line-height: 22px;
    color: #62778c;
    margin-bottom: 24px;
    text-align: left;
  }

  .errorContainer {
    color: #e91e63;
    font-size: 13px;
    line-height: 15px;
    padding: 13px;
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.08), 0px 0px 1px rgba(17, 49, 96, 0.08);
    border-radius: 5px;
    margin: 32px 0;
    text-align: left;
    img {
      width: 16px;
      height: 16px;
    }
    .col-1 {
      padding: 0;
    }
    .col-11 {
      padding: 0;
    }
  }
`;

export const SocialLoginContainer = styled.div`
  text-align: right;
  margin-top: 32px;
  width: 404px;
  .helperText {
    font-size: 15px;
    color: #8da2b5;
    float: left;
    margin-top: 13px;
  }

  .social-button {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    font-weight: 500;
    font-size: 15px;
    text-align: center;
    box-shadow: 0 2px 5px 0 rgba(14, 30, 37, 0.15);
    cursor: pointer;
    transition: transform 0.25s ease;
    padding: 10px 22px;
    background-color: #fff;
    border: 1px solid #dfe3ed;
    border-radius: 90px;
    margin-left: 8px;
    &:hover {
      background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.85), #eef4f6);
    }
  }

  .social-button-light {
    background: transparent;
    border: 1px solid #dfe3ed;
    box-shadow: none;
  }

  img {
    margin-right: 16px;
  }

  .errorContainer {
    color: #e91e63;
    font-size: 13px;
    line-height: 15px;
    padding: 13px;
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.08), 0px 0px 1px rgba(17, 49, 96, 0.08);
    border-radius: 5px;
    margin: 32px 0;
    text-align: left;
    img {
      width: 16px;
      height: 16px;
    }
    .col-1 {
      padding: 0;
    }
    .col-11 {
      padding: 0;
    }
  }
`;
