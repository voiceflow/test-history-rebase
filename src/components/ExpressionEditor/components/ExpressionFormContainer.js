import { styled } from '@/hocs';

const ExpressionFormContainer = styled.div`
  position: relative;
  padding: 10px;
  background-color: #f7f9fb;
  border: 1px solid #c5d3e0ad;
  border-radius: 6px;

  & & {
    padding: 10px;
  }

  &.variable,
  &.value,
  &.advance {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
  }

  & .type-button-container {
    position: absolute;
    top: 9px;
    right: 8px;
  }

  & .type-button {
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 50%;
    color: #8da2b5;
    background: #fff;
    font-size: 11px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: #62778c;
      background-color: #f7f9fb;
      box-shadow: 0 1px 6px rgba(17, 49, 96, 0.24), 0 0 0 rgba(17, 49, 96, 0.04);
    }
  }

  & .operator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    font-weight: 600;
    width: 100%;
    margin: 4px 0;
    padding: 3px 7px;
    overflow: hidden;
    color: #8da2b5;
    cursor: pointer;

    & > .dropdown {
      flex: 1;
    }

    &:hover {
      background-color: #f0f2f5;
    }

    & > .type-button {
      visibility: hidden;
    }

    &:hover > .type-button {
      visibility: visible;
    }
  }

  & .expression-menu {
    margin-top: 5px;
    padding: 0;
    min-width: auto;
    overflow: hidden;
    color: #8da2b5;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
    border: none;
  }

  & .expression-group {
    display: grid;
    border-bottom: 1px solid #eaeff4;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;

    /* "Expression" */
    &.group-1 {
      grid-template-columns: 1fr;
      border-bottom: none;
    }

    /* "Value", "Variable" */
    &.group-2 {
      grid-template-columns: 1fr 1fr;
    }

    /* "+", "-", "x", "÷" */
    &.group-4 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    & > div {
      padding: 8px 20px;
      cursor: pointer;

      &:hover {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
        color: #62778c;
      }
    }
  }

  & .form-control {
    height: 40px;
    padding-right: 36px;
  }

  & .variable-box__control {
    padding-right: 30px;
  }

  & .editor.oneline .public-DraftEditor-content {
    min-height: 0;
  }
`;

export default ExpressionFormContainer;
