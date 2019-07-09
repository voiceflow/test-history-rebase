import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

const Loader = styled.span`
  display: inline-flex;
  width: 1.2em;
  height: 1.2em;
  line-height: 1;
  background-color: #fff;
  border-radius: 50%;
  background-image: url('/loader-2.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75%;
  animation: spin 1s linear infinite;
`;

export const Spinner = (props) => {
  return (
    <div id="loading-diagram" className={cn({ transparent: props.transparent })}>
      <div className="text-center">
        <Loader />
        <h5 className="text-muted mb-2">{props.message || `Loading ${props.name}...`}</h5>
      </div>
    </div>
  );
};
