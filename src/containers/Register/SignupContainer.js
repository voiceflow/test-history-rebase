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
`;

export const SocialLoginContainer = styled.div`
  text-align: right;
  margin-top: 32px;

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
    box-shadow: 0 2px 5px 0 rgba(14, 30, 37, 0.15) !important;
    cursor: pointer;
    transition: transform 0.25s ease;
    padding: 12px 22px;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
    border: 1px solid #dfe3ed;
    border-radius: 90px;
    margin-left: 8px;
  }

  .social-button:hover {
    box-shadow: 0 4px 8px 0 rgba(14, 30, 37, 0.15) !important;
    transform: translateY(-3px);
  }

  img {
    margin-right: 16px;
  }
`;
