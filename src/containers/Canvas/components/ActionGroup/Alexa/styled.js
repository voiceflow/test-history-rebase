import styled from 'styled-components';

export const UploadPromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: ${({ disablePadding }) => (disablePadding ? '0px' : '20px')};
  width: 100%;
`;

export const PopupButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -20px -20px;
  padding: 16px 2rem;
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #fff;
`;

export const PopUpText = styled.div`
  font-size: 15px;
  color: #62778c;
  padding: 20px 0;
  font-size: 15px;
  ${({ align }) => `text-align: ${align}`}
`;

export const PopUpLink = styled.a`
  text-decoration: none;
  color: #fff;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;
