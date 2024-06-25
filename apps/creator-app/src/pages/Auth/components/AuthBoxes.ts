import { css, keyframes, styled } from '@/hocs/styled';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const MsgBox = styled.div<{ error: boolean }>`
  ${({ error }) =>
    error &&
    css`
      color: #bd425f;
    `}
  font-size: 12px;
  line-height: 15px;
  padding: 5px 0px 0px 15px;
  background: #ffffff;
  text-align: left;

  animation: ${fadeIn} 1s;
`;

export const Check = styled.div`
  position: absolute;
  top: 13px;
  right: 12px;
`;

export const AuthBox = styled.div`
  #login-container {
    background: linear-gradient(180deg, rgba(19, 33, 68, 0.85) 0%, #132144 100%), #fff;
  }

  .auth-form-wrapper {
    width: 416px;
    max-width: 416px;
    padding: 32px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow:
      0 0 1px 1px rgba(17, 49, 96, 0.08),
      0 1px 3px 0 rgba(17, 49, 96, 0.08);
    .form-group {
      margin-bottom: 22px;
    }
    .row {
      margin-top: 32px;
    }
  }

  .auth-logo {
    width: 140px;
    margin-left: 32px;
    margin-bottom: 20px;
  }

  .passwordInput {
    position: relative;

    .forgotLink {
      display: block;
      margin-top: 11px;
      text-align: right;
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
    color: #bd425f;
    font-size: 13px;
    line-height: 15px;
    padding: 13px;
    background: #ffffff;
    box-shadow:
      0px 1px 3px rgba(17, 49, 96, 0.08),
      0px 0px 1px rgba(17, 49, 96, 0.08);
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

  .social-button {
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
    &:hover {
      background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.85), #eef4f6);
    }

    :not(:last-child) {
      margin-right: 14px;
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
    color: #bd425f;
    font-size: 13px;
    line-height: 15px;
    padding: 13px;
    background: #ffffff;
    box-shadow:
      0px 1px 3px rgba(17, 49, 96, 0.08),
      0px 0px 1px rgba(17, 49, 96, 0.08);
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
