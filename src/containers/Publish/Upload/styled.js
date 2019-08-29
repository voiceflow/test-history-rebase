import styled from 'styled-components';

export const UploadPromptWrapper = styled.div`
  text-align: center;
  padding: 20px;
  width: 100%;

  .modal & {
    padding: 0 2rem;
    text-align: left;
  }
`;

export const PopupButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -20px -20px;
  padding: 16px 2rem;
  background: #f9fafc;

  .modal & {
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 0 -2rem;
  }
`;

export const PopUpText = styled.div`
  font-size: 15px;
  color: #62778c;
  padding: 20px 0;
  font-size: 15px;
`;

export const PopUpLink = styled.a`
  text-decoration: none;
  color: #fff;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;
