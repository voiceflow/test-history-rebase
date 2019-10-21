import { css, styled } from '@/hocs';

export const DiagramButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  padding: 10px 0 10px 16px;
  color: #132144;
  font-size: 13px;
  text-align: left;
  background: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ depth }) =>
    depth &&
    css`
      padding: 10px 0;
    `}

  /* margin-left: ${({ depth }) => (depth ? `${depth * 5}px` : 0)}; */

  .diagram-text {
    display: block;
    width: 100%;
    padding-left: 0;
    overflow: hidden;
    font-weight: 500;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #132144;
  }

  .form-control {
    height: 19px;
    margin-right: 1px;
    padding: 0;
    overflow: hidden;
    color: #62778c;
    font-weight: 600;
    font-size: 13px;
    line-height: 19px;
    letter-spacing: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: none;
    border: none;
    box-shadow: none;
  }
`;

export default DiagramButton;
