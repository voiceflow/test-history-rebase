import styled, { css } from 'styled-components';

const SingleStepWrapper = styled.div`
  overflow: hidden;

  transition: height 0.2s ease;

  ${({ isActive, height }) =>
    height !== null &&
    css`
      height: ${isActive ? Math.max(height, 500) : 0}px;
    `}
`;

export default SingleStepWrapper;
