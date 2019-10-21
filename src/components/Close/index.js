import styled from 'styled-components';

export default styled.button`
  width: 14px;
  height: 14px;
  font-weight: normal;
  background-image: url('/close.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 13px;
  background-color: transparent;
  opacity: 1 !important;
  transition: all ease 0.25s;
  border: none;

  &:hover {
    background-image: url('/close-dark.svg');
  }
`;
