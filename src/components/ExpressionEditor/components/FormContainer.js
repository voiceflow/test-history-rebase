import { styled } from '@/hocs';

const FormContainer = styled.div`
  position: relative;
  padding: 10px;
  background-color: #f7fafb;
  border: 1px solid #d4d9e6;
  border-radius: 6px;

  & > .composite {
    padding: 0 0 0 10px !important;
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
  }

  & > .same {
    padding: 0 !important;
    border: none !important;
  }

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

  & .type-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin: -6px;
    border: 0;
    border-radius: 5px;
    color: #8da2b5;
    /* background: #fff; */
    line-height: 24px;
    text-align: center;
    transition: all 0.15s ease;
    cursor: pointer;

    &:hover {
      color: #62778c;
      background: linear-gradient(-180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
      box-shadow: inset 0 0 0 1px #dfe3ed;
    }
    &:active,
    &:focus {
      color: #132144;
      background: linear-gradient(-180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
      box-shadow: inset 0 0 0 1px #dfe3ed;
      outline: none;
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
    padding: 3px;
    overflow: hidden;
    color: #62778c;
    cursor: pointer;

    & > .dropdown {
      flex: 1;
    }

    &:hover {
      background-color: #eef4f6;
    }

    & > .type-button {
      visibility: hidden;
    }

    &:hover > .type-button {
      visibility: visible;
    }
  }

  /* Targeting 3rd party library  */
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
    border-bottom: 1px solid #dfe3ed;
    font-weight: 600;
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
    padding-right: 72px;
  }

  & .variable-box__control {
    padding-right: 30px;
  }

  & .editor.oneline .public-DraftEditor-content {
    min-height: 0;
  }
`;

export default FormContainer;
