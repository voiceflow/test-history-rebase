import { css, styled } from '@/hocs/styled';

export interface AuthenticationContainerProps {
  dark?: boolean;
}

const AuthenticationContainer = styled.div<AuthenticationContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 10%;
  overflow: scroll;

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
