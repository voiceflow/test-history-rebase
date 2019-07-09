import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

const LoadContainer = styled.div`
  box-shadow: 0 1px 2px 0 rgba(17, 49, 96, 0.24);
  width: 1em;
  height: 1em;
  border-radius: 50%;
  display: inline-flex;
`;

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
  background-size: 75%;
  animation: spin 1s linear infinite;
`;

const Text = styled.div`
  color: #132144;
  font-weight: 400;
  font-size: 18px;
  padding-bottom: 14px;
`;
export const Spinner = (props) => {
  return (
    <div id="loading-diagram" className={cn({ transparent: props.transparent })}>
      <div className="text-center">
        <LoadContainer>
          <Loader />
        </LoadContainer>
        <Text>{props.message || `Loading ${props.name}...`}</Text>
      </div>
    </div>
  );
};
