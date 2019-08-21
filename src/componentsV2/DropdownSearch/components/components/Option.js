import React from 'react';
import { components } from 'react-select';
import styled from 'styled-components';

const ActionButton = styled.div`
  background: #fff;
  color: #0f7ec0;
  display: block;
  padding: 24px 42px;
  width: 100%;
  user-select: none;
  border-top: 1px solid #dce5e8;
  text-align: center;
  bottom: 0;
  position: sticky;
  border-radius: 0px 0px 8px 8px;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 10px;
`;

const Option = (props) => {
  const {
    children,
    selectProps: { actionClick, actionText },
  } = props;
  return (
    <>
      <components.Option {...props}>{children}</components.Option>
      {actionClick && <ActionButton onClick={() => actionClick()}>{actionText}</ActionButton>}
    </>
  );
};

export default Option;
