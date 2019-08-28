import styled, { css } from 'styled-components';

const centerContent = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Page404Wrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    color: #8c94a6;
    margin-top: 1rem;
  }
`;

export const ErrorBoundaryWrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    color: #8c94a6;
    margin-top: 1rem;
  }
`;
