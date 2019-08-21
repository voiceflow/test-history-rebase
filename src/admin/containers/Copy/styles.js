import styled from 'styled-components';

export const CopyContent = styled.div`
  display: flex;
  justify-content: flex-start;
  & > * + * {
    margin-left: 16px;
  }
`;

export const ToField = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 8px;
  }
`;

export const CopyFields = styled.div`
  & > * + * {
    margin-top: 8px;
  }
`;
