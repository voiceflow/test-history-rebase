import { styled } from '@/hocs';

/*
 *  attrs is used due to performance reason
 */
export const DiagramButton = styled.button.attrs(({ depth }) => ({
  style: { paddingLeft: `${depth > 1 ? (depth - 1) * 14 + 16 : 16}px` },
}))`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  padding: 0;
  color: #132144;
  font-size: 13px;
  text-align: left;
  border: none;
  border-radius: 0;
  cursor: pointer;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  background-color: #fff;
  background: none;
  transition: ease all 0.15s;

  &[disabled] {
    pointer-events: none;
  }

  &.active {
    background-color: #eef4f6bd !important;
    color: #132144;
    border-top: 1px solid #dfe3ed;
    border-bottom: 1px solid #dfe3ed;
    background: none;
  }

  &:hover {
    background-color: #eef4f6bd !important;
    opacity: 1;
    background: none;
  }

  &::before {
    position: relative;
    top: 2px;
    display: ${({ depth }) => (depth ? 'inline' : 'none')};
    margin-right: 4px;
    width: 14px;
    color: #62778c;
    content: '↳';
    font-size: 12px;
  }

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
