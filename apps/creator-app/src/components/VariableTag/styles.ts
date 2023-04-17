import { createGlobalStyle, css, styled } from '@/hocs/styled';

export interface BaseVariableTagProps {
  color?: string;
  inheritedCursor?: boolean;
  isPrototypeSettings?: boolean;
}

export const DEFAULT_SLOT_COLOR = '#5D9DF5';

export const variableStyle = css<BaseVariableTagProps>`
  display: inline-block;
  padding: 0px 4px 1px 4px;
  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  background-color: #eef4f6a8;
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px #dfe5ea;
  cursor: ${({ inheritedCursor }) => (inheritedCursor ? 'inherit' : 'default')};
  line-height: 20px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.default {
    color: #62778c;
  }

  ${({ isPrototypeSettings }) =>
    isPrototypeSettings &&
    css`
      padding: 0;
      background-color: white;
      border: none;
      border-radius: 0px;
      text-transform: uppercase;
    `}
`;

export const VariableTagTooltipStyles = createGlobalStyle`
  .tippy-box {
    max-width: 600px;
  }
`;

export const VariableTagContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const VariableTagWrapper = styled.span`
  ${variableStyle}
  display: flex;
`;
