import React from 'react';
import styled, { css } from 'styled-components';

const spinnerStyles = css`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  display: inline-flex;
  font-size: ${(props) => (props.isMd ? '2rem' : '4rem')};
`;
const LoadContainer = styled.div`
  ${spinnerStyles}
  box-shadow: 0 1px 2px 0 rgba(17, 49, 96, 0.24);
`;

const LoadCircle = styled.span`
  ${spinnerStyles}
  line-height: 1;
  background-color: #fff;
  background-image: url('/loader-2.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75%;
  animation: spin 1s linear infinite;
`;

const Loader = (props) => (
  <LoadContainer {...props}>
    <LoadCircle />
  </LoadContainer>
);

export default React.memo(Loader);
