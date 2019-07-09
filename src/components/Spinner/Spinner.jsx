import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

const Loader = styled.span`
  display: inline-flex;
  width: 1em;
  height: 1em;
  line-height: 1;
  background-color: #fff;
  border-radius: 50%;
  background-image: url('/loader-2.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
  animation: spin 1s linear infinite;
`;

const Text = styled.div`
  color: #132144;
  font-weight: 400;
  font-size: 18px;
`;
export const Spinner = (props) => {
  return (
    <div id="loading-diagram" className={cn({ transparent: props.transparent })}>
      <div className="text-center">
        <Loader />
        <Text className="mb-2">{props.message || `Loading ${props.name}...`}</Text>
      </div>
    </div>
  );
};
