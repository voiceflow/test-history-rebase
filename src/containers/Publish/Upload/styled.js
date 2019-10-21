import styled from 'styled-components';

export const UploadPromptWrapper = styled.div`
  text-align: center;
  padding: 36px 22px 22px 22px;
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
  margin: 0 -22px -24px;
  padding: 23px 32px 24px;
  background: #f9f9f9;
  border-top: 1px solid #eaeff4;

  .modal & {
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 0 -2rem;
  }
`;

export const PopUpText = styled.div`
  font-size: 15px;
  color: #62778c;
  padding: 20px 0px 32px 0px;
`;

export const PopUpLink = styled.a`
  text-decoration: none;
  color: #fff;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;
