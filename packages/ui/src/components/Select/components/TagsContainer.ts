import { css, styled } from '../../../styles';

const TagsContainer = styled.div<{ isActive?: boolean }>`
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px #d4d9e6;
  min-height: ${({ theme }) => theme.components.input.height}px;
  max-height: 117px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  cursor: text;
  padding: 8px;

  ${({ isActive }) =>
    isActive &&
    css`
      border-color: ${({ theme }) => theme.colors.blue};
    `}
  input {
    min-width: 70px;
    max-width: 210px;

    ::placeholder {
      line-height: 20px;
    }
  }
`;

export default TagsContainer;
