import { css, styled } from '@/hocs';

export const variableStyle = css`
  display: inline-block;
  padding: 0px 4px 1px 4px;
  color: #62778c;
  font-weight: 600;
  font-size: 14px;
  background-color: #eef4f6a8;
  border-radius: 7px;
  border: 1px solid #dfe5ea;
  cursor: default;
  line-height: 20px;
  text-align: center;

  &.default {
    color: #62778c;
  }
`;

export const VariableTag = styled.span`
  ${variableStyle}
`;

export const InlineVariableTag = styled(VariableTag)`
  display: inline;
`;
