import { css, styled } from '@ui/styles';

const TagsContainer = styled.div<{ isActive?: boolean; hasTags: boolean }>`
  border-radius: 6px;
  background: white;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px #d4d9e6;
  max-height: 111px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  cursor: text;
  min-height: 42px;
  padding: ${({ hasTags }) => (hasTags ? '7px 8px' : '7px 12px')};
  padding-top: 4px;

  ${({ isActive }) =>
    isActive &&
    css`
      border-color: ${({ theme }) => theme.colors.blue};
    `}

  input {
    ${({ hasTags }) =>
      hasTags
        ? css`
            min-width: 10px;
          `
        : css`
            min-width: 70px;
          `}

    max-width: 220px;
    text-overflow: clip;

    ::placeholder {
      line-height: 20px;
    }
  }
`;

export default TagsContainer;
