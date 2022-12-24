import { createGlobalStyle } from '@/hocs/styled';

const DisableOverscrollBehavior = createGlobalStyle`
  html, body {
    overscroll-behavior-x: none;
  }
`;

export default DisableOverscrollBehavior;
