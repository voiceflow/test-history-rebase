import styled, { css } from 'styled-components';

const SingleStepWrapper = styled.div`
  overflow-y: hidden;

  transition: height 0.3s ease;

  ${({ isActive, height }) =>
    height !== null &&
    css`
      height: ${isActive ? height : 0}px;
    `}
`;

export default SingleStepWrapper;
