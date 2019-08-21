import styled, { css } from 'styled-components';

const AuthenticationContainer = styled.div`
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  justify-content: center;
  height: 100%;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  -ms-flex-align: center;

  ${({ dark }) =>
    dark
      ? css`
          background: linear-gradient(180deg, rgba(19, 33, 68, 0.85) 0%, #132144 100%), #fff;
        `
      : css`
          background: #f8f9fb;
        `}
`;

export default AuthenticationContainer;
