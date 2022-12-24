import { createGlobalStyle } from '@/hocs/styled';

const ExportGlobalStyle = createGlobalStyle`
  html, body, #root {
    position: unset !important;
    top: unset !important;
    right: unset !important;
    bottom: unset !important;
    left: unset !important;
    display: unset !important;
    flex-direction: unset !important;
    min-width: unset !important;
    height: unset !important;
    min-height: unset !important;
    overflow: unset !important;
  }
`;

export default ExportGlobalStyle;
