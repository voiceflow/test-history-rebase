import { createGlobalStyle } from '@ui/styles';

export const GlobalStyle = createGlobalStyle`
  .tippy-box {
    border-radius: 8px;
    background-color: #2b2f32;
    color: #f2f7f7;
  }

  .tippy-box .tippy-content {
    padding: 8px 16px;
    font-size: 13px;
  }

  .tippy-box[data-theme~="warning"] .arrow-regular {
    left: 15px !important;
    border-bottom-color: #e23c61 !important;
  }

  .tippy-box[data-theme~="warning"] [x-circle] {
    background: #e23c61 !important;
  }

  .tippy-box[data-theme~="warning"] {
    max-width: 180px;
    background-color: #e23c61 !important;
  }

  .tippy-box .arrow {
    border-bottom-color: #2b2f32 !important;
  }

  .tippy-box [x-circle] {
    width: 140%;
    height: 140%;
    background-color: #2b2f32;
    border: 1px solid #2b2f32;
    border-radius: 8px;
  }
`;
