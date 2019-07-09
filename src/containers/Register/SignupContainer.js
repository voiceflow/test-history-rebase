import styled from 'styled-components';

export const SignupContainer = styled.div`
  .signup-form-wrapper {
    width: 404px;
    max-width: 404px;
    padding: 32px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(14, 30, 37, 0.12);
  }

  .signup-form {
    text-align: center;
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
  }

  .confirm-helper {
    font-size: 15px;
    line-height: 22px;
    color: #62778c;
    margin-bottom: 32px;
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
    margin-top: 15px;
  }

  .social-button {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    height: 50px;
    font-weight: 500;
    font-size: 15px;
    text-align: center;
    box-shadow: 0 2px 5px 0 rgba(14, 30, 37, 0.15);
    cursor: pointer;
    transition: transform 0.25s ease;
    padding: 12px 22px;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
    border: 1px solid #dfe3ed;
    border-radius: 90px;
    margin-left: 8px;
  }

  .social-button-light {
    background: transparent;
    border: 1px solid #dfe3ed;
    box-shadow: none;
  }

  .social-button:hover {
    box-shadow: 0 4px 8px 0 rgba(14, 30, 37, 0.15) !important;
    transform: translateY(-3px);
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
